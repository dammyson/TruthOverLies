import * as bibleApi from '../api/bible';
import {getDb} from './db';

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

export async function downloadTranslation(
  translationId: string,
  books: bibleApi.BibleBook[],
  onProgress: (pct: number) => void,
): Promise<void> {
  const db = getDb();

  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    try {
      const bookData = await bibleApi.downloadBook(translationId, book.id);

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
    } catch {
      // Skip failed books — don't abort the whole download
    }
    onProgress((i + 1) / books.length);
  }

  // Mark translation as downloaded — this is what isTranslationDownloaded checks
  db.execute(
    'INSERT OR REPLACE INTO translations (id, downloaded_at, version) VALUES (?, ?, 1)',
    [translationId, new Date().toISOString()],
  );
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
