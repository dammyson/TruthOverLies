import * as bibleApi from '../api/bible';
import {ApiError} from '../api/types';
import {getDb} from './db';

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// ── SQLite cache helpers ──────────────────────────────────────────────────────

function cacheGet<T>(key: string): T | null {
  const db = getDb();
  const result = db.execute('SELECT val FROM cache WHERE key = ?', [key]);
  const row = result.rows?._array?.[0];
  return row ? (JSON.parse(row.val) as T) : null;
}

function cacheSet(key: string, value: unknown): void {
  const db = getDb();
  db.execute(
    'INSERT OR REPLACE INTO cache (key, val, ts) VALUES (?, ?, ?)',
    [key, JSON.stringify(value), new Date().toISOString()],
  );
}

// Module-level set so the modal can show in-progress status for background downloads
const _activeDownloads = new Set<string>();

export function isDownloadInProgress(id: string): boolean {
  return _activeDownloads.has(id);
}

const K = {
  translations: 'translations_list',
  books: (t: string) => `books/${t}`,
  chapter: (t: string, book: string, ch: number) => `ch/${t}/${book}/${ch}`,
};

// ── Translation list ──────────────────────────────────────────────────────────

export async function getTranslations(): Promise<bibleApi.BibleTranslation[]> {
  const cached = cacheGet<bibleApi.BibleTranslation[]>(K.translations);
  if (cached) {
    return cached;
  }
  const list = await bibleApi.getTranslations();
  cacheSet(K.translations, list);
  return list;
}

// ── Books ─────────────────────────────────────────────────────────────────────

export async function getBooks(translation: string): Promise<bibleApi.BibleBook[]> {
  const cached = cacheGet<bibleApi.BibleBook[]>(K.books(translation));
  if (cached) {
    return cached;
  }
  const books = await bibleApi.getBooks(translation);
  cacheSet(K.books(translation), books);
  return books;
}

// ── Chapter ───────────────────────────────────────────────────────────────────
// Priority: SQLite verses (downloaded offline) → SQLite cache (online) → API

export async function getChapter(
  translation: string,
  bookId: string,
  chapter: number,
): Promise<bibleApi.BibleVerse[]> {
  // 1. Offline — read directly from the downloaded verses table
  if (await isTranslationDownloaded(translation)) {
    const db = getDb();
    const result = db.execute(
      'SELECT verse, text FROM verses WHERE translation = ? AND book = ? AND chapter = ? ORDER BY verse ASC',
      [translation, bookId, chapter],
    );
    const rows: Array<{verse: number; text: string}> = result.rows?._array ?? [];
    return rows.map(r => ({chapter, verse: r.verse, text: r.text}));
  }

  // 2. Online — check cache then fetch
  const cacheKey = K.chapter(translation, bookId, chapter);
  const cached = cacheGet<bibleApi.BibleVerse[]>(cacheKey);
  if (cached) {
    return cached;
  }
  const res = await bibleApi.getChapterContent(bookId, chapter, translation);
  cacheSet(cacheKey, res.items);
  return res.items;
}

// ── Download status ───────────────────────────────────────────────────────────

export async function getDownloadedTranslations(): Promise<string[]> {
  const db = getDb();
  const result = db.execute('SELECT id FROM translations');
  const rows: Array<{id: string}> = result.rows?._array ?? [];
  return rows.map(r => r.id);
}

export async function isTranslationDownloaded(translationId: string): Promise<boolean> {
  const db = getDb();
  const result = db.execute('SELECT id FROM translations WHERE id = ?', [translationId]);
  return (result.rows?._array?.length ?? 0) > 0;
}

// ── Download all verses for a translation → SQLite ───────────────────────────

async function downloadBookWithRetry(
  translationId: string,
  bookId: string,
  maxRetries = 4,
): Promise<bibleApi.BibleDownloadBook | null> {
  let delay = 2000;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await bibleApi.downloadBook(translationId, bookId);
    } catch (err) {
      const isRateLimit = err instanceof ApiError && err.status === 429;
      if (isRateLimit && attempt < maxRetries) {
        await sleep(delay);
        delay = Math.min(delay * 2, 16000);
        continue;
      }
      return null;
    }
  }
  return null;
}

export async function downloadTranslation(
  translationId: string,
  books: bibleApi.BibleBook[],
  onProgress: (pct: number) => void,
): Promise<void> {
  _activeDownloads.add(translationId);
  const db = getDb();

  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    if (i > 0) {
      await sleep(250); // stay under rate limit
    }

    const bookData = await downloadBookWithRetry(translationId, book.id);
    if (bookData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      db.transaction((tx: any) => {
        for (const chStr of Object.keys(bookData)) {
          const ch = Number(chStr);
          for (const vStr of Object.keys(bookData[chStr])) {
            tx.execute(
              'INSERT OR REPLACE INTO verses (translation, book, chapter, verse, text) VALUES (?, ?, ?, ?, ?)',
              [translationId, book.id, ch, Number(vStr), bookData[chStr][vStr]],
            );
          }
        }
      });
    }
    onProgress((i + 1) / books.length);
  }

  // Mark translation as downloaded — this is what isTranslationDownloaded checks
  db.execute(
    'INSERT OR REPLACE INTO translations (id, downloaded_at, version) VALUES (?, ?, 1)',
    [translationId, new Date().toISOString()],
  );
  _activeDownloads.delete(translationId);
}

// ── Delete a downloaded translation ──────────────────────────────────────────

export async function deleteTranslation(translationId: string): Promise<void> {
  const db = getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db.transaction((tx: any) => {
    tx.execute('DELETE FROM verses WHERE translation = ?', [translationId]);
    tx.execute('DELETE FROM translations WHERE id = ?', [translationId]);
  });
}

// ── Search (SQLite only — requires downloaded translation) ────────────────────

export type SearchResult = {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
};

export async function searchVerses(
  translation: string,
  query: string,
  limit = 100,
): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const downloaded = await isTranslationDownloaded(translation);
  if (!downloaded) return [];

  const books = await getBooks(translation);
  const bookMap = new Map(books.map(b => [b.id, b.name]));

  const db = getDb();
  const result = db.execute(
    'SELECT book, chapter, verse, text FROM verses WHERE translation = ? AND text LIKE ? ORDER BY book, chapter, verse LIMIT ?',
    [translation, `%${trimmed}%`, limit],
  );

  const rows: Array<{book: string; chapter: number; verse: number; text: string}> =
    result.rows?._array ?? [];

  return rows.map(r => ({
    bookId: r.book,
    bookName: bookMap.get(r.book) ?? r.book,
    chapter: r.chapter,
    verse: r.verse,
    text: r.text,
  }));
}

// ── Selected translation (persisted choice, works online or offline) ─────────

export function getSelectedTranslation(): string | null {
  return cacheGet<string>('selected_translation');
}

export function setSelectedTranslation(id: string): void {
  cacheSet('selected_translation', id);
}

// ── Default bible download (KJV on first login) ───────────────────────────────

export async function ensureKjvDownloaded(): Promise<void> {
  if (_activeDownloads.has('KJV')) {
    return; // already in progress
  }
  try {
    const already = await isTranslationDownloaded('KJV');
    if (already) {
      if (!getSelectedTranslation()) {
        setSelectedTranslation('KJV');
      }
      return;
    }
    _activeDownloads.add('KJV');
    console.log('[Bible] Downloading KJV in background...');
    const books = await getBooks('KJV');
    await downloadTranslation('KJV', books, () => {});
    if (!getSelectedTranslation()) {
      setSelectedTranslation('KJV');
    }
    console.log('[Bible] KJV download complete');
  } catch (err) {
    console.warn('[Bible] KJV background download failed:', err);
  } finally {
    _activeDownloads.delete('KJV');
  }
}
