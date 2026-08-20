import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';

import SkeletonBlock from '../../components/SkeletonBlock';
import BookChapterPickerModal from '../../components/BookChapterPickerModal';
import TranslationPickerModal from '../../components/TranslationPickerModal';
import {useTheme} from '../../context/ThemeContext';
import * as bibleRepo from '../../bible/bibleRepo';
import {BibleVerse} from '../../api/bible';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'Reader'>;

// Defined outside component so they don't recreate on every render
function pillStyle(colors: any) {
  return {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: colors.surfaceStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  };
}

function pillTextStyle(colors: any) {
  return {
    ...typography.footnote,
    fontWeight: '700' as const,
    color: colors.text,
  };
}

function ReaderScreen({route, navigation}: Props) {
  const {colors} = useTheme();

  // Reading position — starts from route params, managed locally from then on
  const [bookId, setBookId] = useState(route.params.bookId);
  const [bookName, setBookName] = useState(route.params.bookName);
  const [chapter, setChapter] = useState(route.params.chapter);
  const [chapterCount, setChapterCount] = useState(route.params.chapterCount);
  const [translation, setTranslation] = useState(route.params.translation);

  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [bookPickerVisible, setBookPickerVisible] = useState(false);
  const [versionPickerVisible, setVersionPickerVisible] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  // ── Load chapter ──────────────────────────────────────────────────────────

  const loadChapter = useCallback(
    async (t: string, bId: string, ch: number) => {
      setLoading(true);
      setError(false);
      try {
        const data = await bibleRepo.getChapter(t, bId, ch);
        const unique = data.filter(
          (v, i, arr) => arr.findIndex(x => x.verse === v.verse) === i,
        );
        setVerses(unique);
        scrollRef.current?.scrollTo({y: 0, animated: false});
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadChapter(translation, bookId, chapter);
  }, [translation, bookId, chapter, loadChapter]);

  // ── Custom header: [Book Chapter] [Version] pill buttons ─────────────────

  useLayoutEffect(() => {
    const openBookPicker = () => setBookPickerVisible(true);
    const openVersionPicker = () => setVersionPickerVisible(true);

    navigation.setOptions({
      headerTitle: () => (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <Pressable
            onPress={openBookPicker}
            style={({pressed}) => [pillStyle(colors), pressed && {opacity: 0.7}]}>
            <Text style={pillTextStyle(colors)}>
              {bookName} {chapter}
            </Text>
          </Pressable>
          <Pressable
            onPress={openVersionPicker}
            style={({pressed}) => [pillStyle(colors), pressed && {opacity: 0.7}]}>
            <Text style={pillTextStyle(colors)}>{translation}</Text>
          </Pressable>
        </View>
      ),
      headerBackTitle: '',
    });
  }, [navigation, bookName, chapter, translation, colors]);

  // ── Navigation handlers ───────────────────────────────────────────────────

  const handleBookChapterSelect = useCallback(
    (bId: string, bName: string, ch: number, cc: number) => {
      setBookId(bId);
      setBookName(bName);
      setChapter(ch);
      setChapterCount(cc);
    },
    [],
  );

  const handleTranslationSelect = useCallback((t: string) => {
    bibleRepo.setSelectedTranslation(t);
    setTranslation(t);
  }, []);

  const goToPrev = useCallback(() => {
    if (chapter > 1) {
      setChapter(ch => ch - 1);
    }
  }, [chapter]);

  const goToNext = useCallback(() => {
    if (chapter < chapterCount) {
      setChapter(ch => ch + 1);
    }
  }, [chapter, chapterCount]);

  // ── Styles ────────────────────────────────────────────────────────────────

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {flex: 1, backgroundColor: colors.background},
        scrollContent: {
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: 120,
        },
        paragraph: {
          ...typography.body,
          color: colors.text,
          lineHeight: 34,
          fontSize: 18,
        },
        verseNum: {
          fontSize: 11,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        skeletonList: {
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          gap: spacing.md,
        },
        errorWrap: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.xl,
        },
        errorText: {
          ...typography.subhead,
          color: colors.muted,
          textAlign: 'center',
          marginBottom: spacing.sm,
        },
        retryText: {
          ...typography.subhead,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        navBar: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          paddingHorizontal: spacing.md,
          paddingBottom: spacing.lg + spacing.md,
          paddingTop: spacing.sm,
          gap: spacing.sm,
          backgroundColor: colors.background + 'F2',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
        },
        navBtn: {
          flex: 1,
          minHeight: 44,
          borderRadius: radius.xl,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        navBtnText: {
          ...typography.subhead,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        navBtnDisabled: {opacity: 0.3},
      }),
    [colors],
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.skeletonList}>
            {Array.from({length: 5}).map((_, i) => (
              <SkeletonBlock
                key={i}
                height={i % 2 === 0 ? 80 : 50}
                borderRadius={radius.sm}
              />
            ))}
          </View>
        ) : error ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>Could not load this chapter.</Text>
            <Pressable onPress={() => loadChapter(translation, bookId, chapter)}>
              <Text style={styles.retryText}>Tap to retry</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {/* Inline paragraph with superscript-style verse numbers */}
            <Text style={styles.paragraph}>
              {verses.map(v => (
                <Text key={`${bookId}-${chapter}-${v.verse}`}>
                  <Text style={styles.verseNum}>{v.verse} </Text>
                  {v.text}
                  {'  '}
                </Text>
              ))}
            </Text>
          </ScrollView>
        )}

        {/* Prev / Next chapter bar */}
        <View style={styles.navBar}>
          <Pressable
            onPress={goToPrev}
            disabled={chapter <= 1}
            style={[styles.navBtn, chapter <= 1 && styles.navBtnDisabled]}>
            <Text style={styles.navBtnText}>‹ Previous</Text>
          </Pressable>
          <Pressable
            onPress={goToNext}
            disabled={chapter >= chapterCount}
            style={[
              styles.navBtn,
              chapter >= chapterCount && styles.navBtnDisabled,
            ]}>
            <Text style={styles.navBtnText}>Next ›</Text>
          </Pressable>
        </View>
      </View>

      <BookChapterPickerModal
        visible={bookPickerVisible}
        translation={translation}
        currentBookId={bookId}
        currentChapter={chapter}
        onSelect={handleBookChapterSelect}
        onClose={() => setBookPickerVisible(false)}
      />

      <TranslationPickerModal
        visible={versionPickerVisible}
        selectedTranslation={translation}
        onSelect={handleTranslationSelect}
        onClose={() => setVersionPickerVisible(false)}
      />
    </>
  );
}

export default ReaderScreen;
