import React, {useCallback} from 'react';
import {Pressable, StyleProp, Text, TextStyle} from 'react-native';
import {useBibleNav} from '../context/BibleNavContext';
import * as bibleRepo from '../bible/bibleRepo';

type Props = {
  reference: string; // e.g. "John 14:18" or "Psalm 103:2"
  style?: StyleProp<TextStyle>;
  onBeforeNavigate?: () => void;
};

function parseRef(ref: string): {bookName: string; chapter: number} | null {
  // Handles: "John 14:18", "1 John 3:16", "Psalm 103", "Romans 8:28"
  const m = ref.trim().match(/^((?:\d\s+)?[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+)(?::\d+)?$/);
  if (!m) return null;
  return {bookName: m[1].trim(), chapter: parseInt(m[2], 10)};
}

function VerseLink({reference, style, onBeforeNavigate}: Props) {
  const {navigateTo} = useBibleNav();

  const handlePress = useCallback(async () => {
    const parsed = parseRef(reference);
    if (!parsed) return;

    try {
      const translation = bibleRepo.getSelectedTranslation() ?? 'KJV';
      const books = await bibleRepo.getBooks(translation);

      const q = parsed.bookName.toLowerCase();
      const book = books.find(
        b =>
          b.name.toLowerCase() === q ||
          b.name.toLowerCase().startsWith(q) ||
          q.startsWith(b.name.toLowerCase()),
      );
      if (!book) return;

      onBeforeNavigate?.();
      navigateTo({
        bookId: book.id,
        bookName: book.name,
        chapter: Math.min(parsed.chapter, book.chapter_count),
        chapterCount: book.chapter_count,
      });
    } catch {}
  }, [reference, navigateTo, onBeforeNavigate]);

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <Text style={style}>{reference}</Text>
    </Pressable>
  );
}

export default VerseLink;
