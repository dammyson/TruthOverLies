import request from './client';
import {SavedScripture, ScriptureCategory} from '../types/app';

// ── Response adapters ─────────────────────────────────────────────────────────

function toScripture(r: RawScripture): SavedScripture {
  return {
    id: r.id,
    categoryId: r.category_id,
    categoryName: r.category_name,
    categoryColor: r.category_color,
    translation: r.translation,
    bookId: r.book_id,
    chapter: r.chapter,
    verseStart: r.verse_start,
    verseEnd: r.verse_end,
    reference: r.reference,
    verseText: r.verse_text,
    moment: r.moment,
    createdAt: r.created_at,
  };
}

function toCategory(r: RawCategory): ScriptureCategory {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    color: r.color,
    createdAt: r.created_at,
  };
}

// ── Raw API shapes ────────────────────────────────────────────────────────────

type RawScripture = {
  id: number;
  category_id: number | null;
  category_name: string | null;
  category_color: string | null;
  translation: string;
  book_id: string;
  chapter: number;
  verse_start: number;
  verse_end: number | null;
  reference: string;
  verse_text: string | null;
  moment: string | null;
  created_at: string;
};

type RawCategory = {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  created_at: string;
};

// ── Scriptures ────────────────────────────────────────────────────────────────

export type SaveScriptureParams = {
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  reference?: string;
  verseText?: string;
  moment?: string;
  categoryId?: number;
  translation?: string;
};

export type UpdateScriptureParams = Partial<SaveScriptureParams>;

export async function listScriptures(
  token: string,
  opts?: {categoryId?: number; translation?: string},
): Promise<SavedScripture[]> {
  const params = new URLSearchParams();
  if (opts?.categoryId != null) params.set('category_id', String(opts.categoryId));
  if (opts?.translation) params.set('translation', opts.translation);
  const qs = params.toString();
  const raw = await request<RawScripture[]>(
    `/scriptures${qs ? `?${qs}` : ''}`,
    {},
    token,
  );
  return raw.map(toScripture);
}

export async function saveScripture(
  token: string,
  params: SaveScriptureParams,
): Promise<SavedScripture> {
  const raw = await request<RawScripture>(
    '/scriptures',
    {
      method: 'POST',
      body: JSON.stringify({
        book_id: params.bookId,
        chapter: params.chapter,
        verse_start: params.verseStart,
        verse_end: params.verseEnd,
        reference: params.reference,
        verse_text: params.verseText,
        moment: params.moment,
        category_id: params.categoryId,
        translation: params.translation ?? 'KJV',
      }),
    },
    token,
  );
  return toScripture(raw);
}

export async function updateScripture(
  token: string,
  id: number,
  params: UpdateScriptureParams,
): Promise<SavedScripture> {
  const raw = await request<RawScripture>(
    `/scriptures/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        book_id: params.bookId,
        chapter: params.chapter,
        verse_start: params.verseStart,
        verse_end: params.verseEnd,
        reference: params.reference,
        verse_text: params.verseText,
        moment: params.moment,
        category_id: params.categoryId,
        translation: params.translation,
      }),
    },
    token,
  );
  return toScripture(raw);
}

export async function deleteScripture(token: string, id: number): Promise<void> {
  await request<void>(`/scriptures/${id}`, {method: 'DELETE'}, token);
}

// ── Categories ────────────────────────────────────────────────────────────────

export type SaveCategoryParams = {
  name: string;
  description?: string;
  color?: string;
};

export async function listCategories(token: string): Promise<ScriptureCategory[]> {
  const raw = await request<RawCategory[]>('/scriptures/categories', {}, token);
  return raw.map(toCategory);
}

export async function createCategory(
  token: string,
  params: SaveCategoryParams,
): Promise<ScriptureCategory> {
  const raw = await request<RawCategory>(
    '/scriptures/categories',
    {method: 'POST', body: JSON.stringify(params)},
    token,
  );
  return toCategory(raw);
}

export async function updateCategory(
  token: string,
  id: number,
  params: Partial<SaveCategoryParams>,
): Promise<ScriptureCategory> {
  const raw = await request<RawCategory>(
    `/scriptures/categories/${id}`,
    {method: 'PATCH', body: JSON.stringify(params)},
    token,
  );
  return toCategory(raw);
}

export async function deleteCategory(token: string, id: number): Promise<void> {
  await request<void>(`/scriptures/categories/${id}`, {method: 'DELETE'}, token);
}
