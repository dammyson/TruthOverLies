import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';
import {useTheme} from '../context/ThemeContext';
import * as bibleRepo from '../bible/bibleRepo';
import {BibleBook} from '../api/bible';
import {typography} from '../theme/typography';
import {radius, spacing} from '../theme/spacing';
import SkeletonBlock from './SkeletonBlock';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const GRID_PADDING = spacing.md;
const GRID_GAP = spacing.xs;
const NUM_COLS = 5;
const CHAPTER_BTN_SIZE =
  (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * (NUM_COLS - 1)) / NUM_COLS;

type Props = {
  visible: boolean;
  translation: string;
  currentBookId: string;
  currentChapter: number;
  onSelect: (bookId: string, bookName: string, chapter: number, chapterCount: number) => void;
  onClose: () => void;
};

function ChapterGrid({
  book,
  currentBookId,
  currentChapter,
  onSelect,
  colors,
  isDark,
}: {
  book: BibleBook;
  currentBookId: string;
  currentChapter: number;
  onSelect: (ch: number) => void;
  colors: any;
  isDark: boolean;
}) {
  const glassScheme = isDark ? 'dark' : 'light';
  const chapters = useMemo(
    () => Array.from({length: book.chapter_count}, (_, i) => i + 1),
    [book.chapter_count],
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: GRID_PADDING,
        paddingVertical: spacing.sm,
        gap: GRID_GAP,
      }}>
      {chapters.map(ch => {
        const isActive = book.id === currentBookId && ch === currentChapter;
        return (
          <Pressable
            key={ch}
            accessibilityRole="button"
            accessibilityLabel={`Chapter ${ch}`}
            onPress={() => onSelect(ch)}
            style={({pressed}) => [
              {
                width: CHAPTER_BTN_SIZE,
                height: CHAPTER_BTN_SIZE,
                borderRadius: radius.lg,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                backgroundColor: isActive
                  ? colors.primaryDark
                  : isLiquidGlassSupported
                  ? 'transparent'
                  : colors.surfaceStrong,
                borderWidth: isLiquidGlassSupported ? 0 : StyleSheet.hairlineWidth,
                borderColor: isActive ? colors.primaryDark : colors.border,
                opacity: pressed ? 0.65 : 1,
              },
            ]}>
            {isLiquidGlassSupported && !isActive && (
              <LiquidGlassView
                style={StyleSheet.absoluteFill}
                effect="regular"
                colorScheme={glassScheme}
              />
            )}
            <Text
              style={{
                ...typography.subhead,
                fontWeight: '600',
                color: isActive ? '#fff' : colors.text,
              }}>
              {ch}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function BookChapterPickerModal({
  visible,
  translation,
  currentBookId,
  currentChapter,
  onSelect,
  onClose,
}: Props) {
  const {colors, isDark} = useTheme();

  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loading, setLoading] = useState(true);
  // Which book has its chapter grid expanded
  const [expandedBookId, setExpandedBookId] = useState(currentBookId);

  useEffect(() => {
    if (!visible) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    // Reset expansion to current book each open
    setExpandedBookId(currentBookId);

    bibleRepo
      .getBooks(translation)
      .then(list => {
        if (!cancelled) {
          // Deduplicate by id in case API returns duplicates
          const unique = list.filter(
            (b, i, arr) => arr.findIndex(x => x.id === b.id) === i,
          );
          setBooks(unique);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBooks([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [visible, translation, currentBookId]);

  const handleToggle = useCallback((bookId: string) => {
    setExpandedBookId(prev => (prev === bookId ? '' : bookId));
  }, []);

  const handleChapterSelect = useCallback(
    (book: BibleBook, ch: number) => {
      onSelect(book.id, book.name, ch, book.chapter_count);
      onClose();
    },
    [onSelect, onClose],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        sheet: {flex: 1, backgroundColor: colors.background},
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.md,
          paddingTop: spacing.sm,
          paddingBottom: spacing.md,
        },
        headerBtn: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.surfaceStrong,
          alignItems: 'center',
          justifyContent: 'center',
        },
        headerBtnText: {
          ...typography.headline,
          color: colors.text,
          lineHeight: 20,
        },
        headerTitle: {
          flex: 1,
          ...typography.headline,
          fontWeight: '700',
          color: colors.text,
          textAlign: 'center',
        },
        // Book rows
        bookRow: {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm + 6,
          minHeight: 56,
          justifyContent: 'center',
        },
        bookRowActive: {
          backgroundColor: colors.primaryDark + '18',
        },
        bookName: {
          ...typography.title3,
          fontWeight: '600',
          color: colors.text,
        },
        bookNameActive: {
          color: colors.primaryDark,
          fontWeight: '700',
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.border,
          marginHorizontal: spacing.lg,
        },
        skeletonList: {padding: spacing.md, gap: spacing.xs},
      }),
    [colors],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.sheet}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={onClose}
            style={({pressed}) => [styles.headerBtn, pressed && {opacity: 0.7}]}
            hitSlop={8}>
            <Text style={styles.headerBtnText}>✕</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Books</Text>
          {/* Spacer to balance the X button */}
          <View style={{width: 36}} />
        </View>

        {loading ? (
          <View style={styles.skeletonList}>
            {Array.from({length: 8}).map((_, i) => (
              <SkeletonBlock key={i} height={52} borderRadius={radius.sm} />
            ))}
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: spacing.xl + spacing.lg}}>
            {books.map((book, index) => {
              const isCurrentBook = book.id === currentBookId;
              const isExpanded = book.id === expandedBookId;

              return (
                <View key={book.id}>
                  {index > 0 && <View style={styles.divider} />}

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => handleToggle(book.id)}
                    style={({pressed}) => [
                      styles.bookRow,
                      isCurrentBook && styles.bookRowActive,
                      pressed && {opacity: 0.7},
                    ]}>
                    <Text
                      style={[
                        styles.bookName,
                        isCurrentBook && styles.bookNameActive,
                      ]}>
                      {book.name}
                    </Text>
                  </Pressable>

                  {isExpanded && (
                    <ChapterGrid
                      book={book}
                      currentBookId={currentBookId}
                      currentChapter={currentChapter}
                      onSelect={ch => handleChapterSelect(book, ch)}
                      colors={colors}
                      isDark={isDark}
                    />
                  )}
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

export default BookChapterPickerModal;
