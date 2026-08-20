import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, {Circle, Line} from 'react-native-svg';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';

const TAB_BAR_HEIGHT = Platform.OS === 'android' ? 56 : 49;

import {useTheme} from '../../context/ThemeContext';
import {useBibleNav} from '../../context/BibleNavContext';

function MagnifyingGlass({size = 20, color = '#8E8E93'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="2.2" />
      <Line
        x1="15.5" y1="15.5" x2="21" y2="21"
        stroke={color} strokeWidth="2.2" strokeLinecap="round"
      />
    </Svg>
  );
}
import * as bibleRepo from '../../bible/bibleRepo';
import {BibleVerse} from '../../api/bible';
import BookChapterPickerModal from '../../components/BookChapterPickerModal';
import TranslationPickerModal from '../../components/TranslationPickerModal';
import BibleSearchModal from '../../components/BibleSearchModal';
import SkeletonBlock from '../../components/SkeletonBlock';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

function BibleHomeScreen() {
  const {colors, isDark} = useTheme();
  const {pending, clearPending} = useBibleNav();
  const insets = useSafeAreaInsets();

  const [bookId, setBookId] = useState('GEN');
  const [bookName, setBookName] = useState('Genesis');
  const [chapter, setChapter] = useState(1);
  const [chapterCount, setChapterCount] = useState(50);
  const [translation, setTranslation] = useState(
    bibleRepo.getSelectedTranslation() ?? 'KJV',
  );

  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [bookPickerVisible, setBookPickerVisible] = useState(false);
  const [versionPickerVisible, setVersionPickerVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const initialized = useRef(false);

  // On first focus: read stored translation
  useFocusEffect(
    useCallback(() => {
      if (initialized.current) return;
      initialized.current = true;
      const saved = bibleRepo.getSelectedTranslation() ?? 'KJV';
      setTranslation(saved);
    }, []),
  );

  // Apply pending Bible navigation (triggered by VerseLink from other screens)
  useFocusEffect(
    useCallback(() => {
      if (!pending) return;
      setBookId(pending.bookId);
      setBookName(pending.bookName);
      setChapter(pending.chapter);
      setChapterCount(pending.chapterCount);
      clearPending();
    }, [pending, clearPending]),
  );

  const loadChapter = useCallback(
    async (t: string, bId: string, ch: number) => {
      setLoading(true);
      setError(false);
      try {
        const data = await bibleRepo.getChapter(t, bId, ch);
        // Deduplicate by verse number in case the API returns duplicate entries
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
    if (chapter > 1) setChapter(ch => ch - 1);
  }, [chapter]);

  const goToNext = useCallback(() => {
    if (chapter < chapterCount) setChapter(ch => ch + 1);
  }, [chapter, chapterCount]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {flex: 1, backgroundColor: colors.background},
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingTop: insets.top + 10,
          paddingBottom: 12,
          paddingHorizontal: spacing.md,
          backgroundColor: colors.background,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        pill: {
          paddingHorizontal: 14,
          paddingVertical: 6,
          borderRadius: 20,
          overflow: 'hidden' as const,
        },
        pillFallback: {
          backgroundColor: colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        pillText: {
          ...typography.footnote,
          fontWeight: '700' as const,
          color: colors.text,
        },
        scrollContent: {
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          // clear the absolutely-positioned nav bar + tab bar
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 80, // clears nav bar + tab bar
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
          left: 0,
          right: 0,
          // 49 = standard iOS tab bar height; sits above it
          bottom: TAB_BAR_HEIGHT + insets.bottom,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.xs,
          backgroundColor: colors.background + 'E8',
        },
        navBtn: {
          width: 48,
          height: 48,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        navBtnText: {
          fontSize: 22,
          lineHeight: 26,
          fontWeight: '400',
          color: colors.primaryDark,
        },
        navBtnDisabled: {opacity: 0.3},
        iconBtn: {
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          overflow: 'hidden' as const,
        },
        iconBtnFallback: {
          backgroundColor: colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
      }),
    [colors, insets],
  );

  return (
    <>
      <View style={styles.container}>
        {/* Header — pill buttons + search icon */}
        <View style={styles.header}>
          <Pressable
            onPress={() => setBookPickerVisible(true)}
            style={({pressed}) => [
              styles.pill,
              !isLiquidGlassSupported && styles.pillFallback,
              pressed && {opacity: 0.7},
            ]}>
            {isLiquidGlassSupported && (
              <LiquidGlassView
                style={StyleSheet.absoluteFill}
                effect="regular"
                colorScheme={isDark ? 'dark' : 'light'}
              />
            )}
            <Text style={styles.pillText}>
              {bookName} {chapter}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setVersionPickerVisible(true)}
            style={({pressed}) => [
              styles.pill,
              !isLiquidGlassSupported && styles.pillFallback,
              pressed && {opacity: 0.7},
            ]}>
            {isLiquidGlassSupported && (
              <LiquidGlassView
                style={StyleSheet.absoluteFill}
                effect="regular"
                colorScheme={isDark ? 'dark' : 'light'}
              />
            )}
            <Text style={styles.pillText}>{translation}</Text>
          </Pressable>
          <Pressable
            onPress={() => setSearchVisible(true)}
            style={({pressed}) => [
              styles.iconBtn,
              !isLiquidGlassSupported && styles.iconBtnFallback,
              pressed && {opacity: 0.6},
            ]}
            hitSlop={8}>
            {isLiquidGlassSupported && (
              <LiquidGlassView
                style={StyleSheet.absoluteFill}
                effect="regular"
                colorScheme={isDark ? 'dark' : 'light'}
              />
            )}
            <MagnifyingGlass size={18} color={colors.text} />
          </Pressable>
        </View>

        <View style={{flex: 1}}>
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
        </View>

        <View style={styles.navBar}>
          <Pressable
            onPress={goToPrev}
            disabled={chapter <= 1}
            style={[styles.navBtn, chapter <= 1 && styles.navBtnDisabled]}>
            <Text style={styles.navBtnText}>‹</Text>
          </Pressable>
          <Pressable
            onPress={goToNext}
            disabled={chapter >= chapterCount}
            style={[styles.navBtn, chapter >= chapterCount && styles.navBtnDisabled]}>
            <Text style={styles.navBtnText}>›</Text>
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

      <BibleSearchModal
        visible={searchVisible}
        translation={translation}
        onSelect={(bId, bName, ch, cc) => {
          setBookId(bId);
          setBookName(bName);
          setChapter(ch);
          setChapterCount(cc);
        }}
        onClose={() => setSearchVisible(false)}
      />
    </>
  );
}

export default BibleHomeScreen;
