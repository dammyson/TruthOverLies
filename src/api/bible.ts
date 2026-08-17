import request from './client';

export type BibleTranslation = {
  code: string;
  name: string;
};

export type BibleBook = {
  id: string;
  name: string;
  testament: string;
  chapter_count: number;
  verse_count: number;
};

export type BibleVerse = {
  chapter: number;
  verse: number;
  text: string;
};

export type BibleContentResponse = {
  translation: string;
  book_id: string;
  book_name: string;
  start_chapter: number;
  start_verse: number;
  items: BibleVerse[];
};

export type BibleDownloadBook = {
  [chapter: string]: {[verse: string]: string};
};

export type BibleDownloadResponse = {
  translation: string;
  version: number;
  language: string;
  books: {[bookId: string]: BibleDownloadBook};
};

export type BibleListItem = {
  id: string;
  name: string;
  language: string;
  version: number;
  sizeBytes: number;
};

export type BibleMeta = {
  translation: string;
  version: number;
  sizeBytes: number;
  updatedAt: string;
};

export function getTranslations() {
  return request<BibleTranslation[]>('/bible/translations');
}

export function getBooks(translation = 'KJV') {
  return request<BibleBook[]>(`/bible/books?translation=${encodeURIComponent(translation)}`);
}

export function getChapterContent(bookId: string, chapter: number, translation = 'KJV') {
  return request<BibleContentResponse>(
    `/bible/books/${encodeURIComponent(bookId)}/content?translation=${encodeURIComponent(translation)}&chapter=${chapter}&limit=200`,
  );
}

export function listAvailableTranslations() {
  return request<BibleListItem[]>('/v1/bibles');
}

export function getTranslationMeta(translationId: string) {
  return request<BibleMeta>(`/v1/bibles/${encodeURIComponent(translationId)}/meta`);
}

export function downloadBook(translationId: string, bookId: string) {
  return request<BibleDownloadBook>(`/v1/bibles/${encodeURIComponent(translationId)}/books/${encodeURIComponent(bookId)}`);
}
