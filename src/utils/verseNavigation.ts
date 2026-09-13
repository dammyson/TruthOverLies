import * as bibleRepo from '../bible/bibleRepo';
import {BibleNavTarget} from '../context/BibleNavContext';

export function parseReference(
  reference: string,
): {bookName: string; chapter: number; verse?: number} | null {
  // Handles references like "John 3:16", "1 John 4:8", and "Psalm 23".
  const match = reference
    .trim()
    .match(/^((?:\d\s+)?[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+)(?::(\d+))?$/);

  if (!match) {
    return null;
  }

  return {
    bookName: match[1].trim(),
    chapter: parseInt(match[2], 10),
    verse: match[3] != null ? parseInt(match[3], 10) : undefined,
  };
}

export async function resolveReferenceToBibleTarget(
  reference: string,
): Promise<BibleNavTarget | null> {
  const parsed = parseReference(reference);
  if (!parsed) {
    return null;
  }

  const translation = bibleRepo.getSelectedTranslation() ?? 'KJV';
  const books = await bibleRepo.getBooks(translation);

  const query = parsed.bookName.toLowerCase();
  const book = books.find(
    item =>
      item.name.toLowerCase() === query ||
      item.name.toLowerCase().startsWith(query) ||
      query.startsWith(item.name.toLowerCase()),
  );

  if (!book) {
    return null;
  }

  return {
    bookId: book.id,
    bookName: book.name,
    chapter: Math.min(parsed.chapter, book.chapter_count),
    chapterCount: book.chapter_count,
    verse: parsed.verse,
  };
}
