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

import {MenuView} from '@react-native-menu/menu';
import {useTheme} from '../../context/ThemeContext';
import {useBibleNav} from '../../context/BibleNavContext';
import {useTabNav} from '../../context/TabNavContext';
import SaveVerseSheet from '../../components/SaveVerseSheet';
import {renderOsisRichText} from '../../bible/osisRichText';

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

function EllipsisCircle({size = 20, color = '#8E8E93'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Circle cx="7.5" cy="12" r="1.2" fill={color} />
      <Circle cx="12" cy="12" r="1.2" fill={color} />
      <Circle cx="16.5" cy="12" r="1.2" fill={color} />
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
  const {jumpTo} = useTabNav();
  const insets = useSafeAreaInsets();

  const savedLocation = bibleRepo.resolveBibleInitialLocation(
    bibleRepo.getLastBibleLocation(),
    bibleRepo.getSelectedTranslation(),
  );

  const [bookId, setBookId] = useState(savedLocation.bookId);
  const [bookName, setBookName] = useState(savedLocation.bookName);
  const [chapter, setChapter] = useState(savedLocation.chapter);
  const [chapterCount, setChapterCount] = useState(50);
  const [translation, setTranslation] = useState(savedLocation.translation);

  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [bookPickerVisible, setBookPickerVisible] = useState(false);
  const [versionPickerVisible, setVersionPickerVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const [highlightVerse, setHighlightVerse] = useState<number | null>(null);
  const [selectedVerses, setSelectedVerses] = useState<Set<number>>(new Set());
  const [saveSheetVisible, setSaveSheetVisible] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const initialized = useRef(false);
  const pendingHighlightRef = useRef<number | null>(null);
  const verseYOffsets = useRef<Map<number, number>>(new Map());
  const highlightScrolled = useRef(false);

  // On first focus: read stored translation
  useFocusEffect(
    useCallback(() => {
      if (initialized.current) return;
      initialized.current = true;

      const applyRestored = async () => {
        const restored = await bibleRepo.getSavedBibleLocation();
        const resolved = bibleRepo.resolveBibleInitialLocation(
          restored ?? bibleRepo.getLastBibleLocation(),
          bibleRepo.getSelectedTranslation(),
        );

        setBookId(resolved.bookId);
        setBookName(resolved.bookName);
        setChapter(resolved.chapter);
        setTranslation(resolved.translation);
        bibleRepo.setSelectedTranslation(resolved.translation);
      };

      applyRestored();
    }, []),
  );

  // Apply pending Bible navigation (triggered by VerseLink from other screens)
  useFocusEffect(
    useCallback(() => {
      if (!pending) return;
      pendingHighlightRef.current = pending.verse ?? null;
      setBookId(pending.bookId);
      setBookName(pending.bookName);
      setChapter(pending.chapter);
      setChapterCount(pending.chapterCount);
      clearPending();
    }, [pending, clearPending]),
  );

  const toggleVerseSelection = useCallback((verseNum: number) => {
    setSelectedVerses(prev => {
      const next = new Set(prev);
      if (next.has(verseNum)) {
        next.delete(verseNum);
      } else {
        next.add(verseNum);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedVerses(new Set());
  }, []);

  const loadChapter = useCallback(
    async (t: string, bId: string, ch: number) => {
      setLoading(true);
      setError(false);
      setHighlightVerse(null);
      setSelectedVerses(new Set());
      verseYOffsets.current.clear();
      highlightScrolled.current = false;
      try {
        const data = await bibleRepo.getChapter(t, bId, ch);
        // Deduplicate by verse number in case the API returns duplicate entries
        const unique = data.filter(
          (v, i, arr) => arr.findIndex(x => x.verse === v.verse) === i,
        );
        setVerses(unique);
        scrollRef.current?.scrollTo({y: 0, animated: false});
        if (pendingHighlightRef.current != null) {
          setHighlightVerse(pendingHighlightRef.current);
          pendingHighlightRef.current = null;
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    bibleRepo.setLastBibleLocation({bookId, bookName, chapter, translation});
    bibleRepo.setSelectedTranslation(translation);
  }, [bookId, bookName, chapter, translation]);

  useEffect(() => {
    loadChapter(translation, bookId, chapter);
  }, [translation, bookId, chapter, loadChapter]);

  // Scroll to and highlight the target verse once positions are measured
  useEffect(() => {
    if (highlightVerse == null || highlightScrolled.current) {
      return;
    }
    const timer = setTimeout(() => {
      const yPos = verseYOffsets.current.get(highlightVerse);
      if (yPos != null) {
        highlightScrolled.current = true;
        scrollRef.current?.scrollTo({y: Math.max(0, yPos - 80), animated: true});
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [highlightVerse]);

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

  // Compute selected verse range and combined text
  const selectedVerseData = useMemo(() => {
    if (selectedVerses.size === 0) return null;
    const sortedVerseNums = Array.from(selectedVerses).sort((a, b) => a - b);
    const verseStart = sortedVerseNums[0];
    const verseEnd = sortedVerseNums[sortedVerseNums.length - 1];
    const selectedVersesList = verses.filter(v => selectedVerses.has(v.verse));
    selectedVersesList.sort((a, b) => a.verse - b.verse);
    const combinedText = selectedVersesList
      .map(v => `[${v.verse}] ${v.text}`)
      .join(' ');
    return {verseStart, verseEnd, combinedText};
  }, [selectedVerses, verses]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {flex: 1, backgroundColor: colors.background},
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: insets.top + 10,
          paddingBottom: 12,
          paddingHorizontal: spacing.md,
          backgroundColor: colors.background,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        headerLeft: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        headerRight: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
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
        verseBlock: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingVertical: 6,
          paddingHorizontal: spacing.xs,
          borderRadius: radius.sm,
          marginBottom: 2,
        },
        verseHighlight: {
          backgroundColor: colors.primaryDark + '18',
        },
        verseSelected: {
          backgroundColor: colors.primaryDark + '25',
        },
        verseNum: {
          fontSize: 11,
          fontWeight: '700',
          color: colors.primaryDark,
          marginTop: 5,
          marginRight: 6,
          minWidth: 18,
          textAlign: 'right',
        },
        verseText: {
          ...typography.body,
          color: colors.text,
          lineHeight: 28,
          fontSize: 17,
          flex: 1,
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
        selectionBar: {
          position: 'absolute',
          left: spacing.lg,
          right: spacing.lg,
          bottom: TAB_BAR_HEIGHT + insets.bottom + 70,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: radius.xl,
          backgroundColor: isDark ? '#3A2E20' : colors.primaryDark,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 8,
          shadowOffset: {width: 0, height: 4},
          elevation: 6,
        },
        selectionText: {
          ...typography.footnote,
          fontWeight: '600',
          color: isDark ? colors.text : '#FFFDF5',
        },
        selectionActions: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        },
        clearBtn: {
          paddingHorizontal: spacing.sm,
          paddingVertical: 6,
        },
        clearBtnText: {
          ...typography.footnote,
          fontWeight: '600',
          color: isDark ? colors.muted : 'rgba(255,255,255,0.7)',
        },
        saveBtn: {
          paddingHorizontal: spacing.md,
          paddingVertical: 8,
          borderRadius: radius.lg,
          backgroundColor: isDark ? colors.primaryDark + '30' : 'rgba(255,255,255,0.2)',
        },
        saveBtnText: {
          ...typography.footnote,
          fontWeight: '700',
          color: isDark ? colors.primaryDark : '#FFFDF5',
        },
      }),
    [colors, insets, isDark],
  );

  return (
    <>
      <View style={styles.container}>
        {/* Header — pills left, icons right */}
        <View style={styles.header}>
          {/* Left: book/chapter + translation pills */}
          <View style={styles.headerLeft}>
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
          </View>

          {/* Right: search + overflow menu */}
          <View style={styles.headerRight}>
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

            <MenuView
              onPressAction={({nativeEvent}) => {
                if (nativeEvent.event === 'saved') {
                  jumpTo(1);
                } else if (nativeEvent.event === 'settings') {
                  jumpTo(4);
                }
              }}
              actions={[
                {
                  id: 'saved',
                  title: 'Saved Scriptures',
                  image: 'bookmark',
                  imageColor: colors.primaryDark,
                },
                {
                  id: 'settings',
                  title: 'Settings',
                  image: 'gearshape',
                  imageColor: colors.primaryDark,
                },
              ]}>
              <Pressable
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
                <EllipsisCircle size={20} color={colors.text} />
              </Pressable>
            </MenuView>
          </View>
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
              {verses.map(v => {
                const isSelected = selectedVerses.has(v.verse);
                return (
                  <Pressable
                    key={`${bookId}-${chapter}-${v.verse}`}
                    onPress={() => toggleVerseSelection(v.verse)}
                    style={({pressed}) => [
                      styles.verseBlock,
                      v.verse === highlightVerse && styles.verseHighlight,
                      isSelected && styles.verseSelected,
                      pressed && {opacity: 0.7},
                    ]}
                    onLayout={e => {
                      verseYOffsets.current.set(v.verse, e.nativeEvent.layout.y);
                    }}>
                    <Text style={styles.verseNum}>{v.verse}</Text>
                    <Text style={styles.verseText}>
                      {renderOsisRichText(v.text, styles.verseText)}
                    </Text>
                  </Pressable>
                );
              })}
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

        {/* Floating selection bar */}
        {selectedVerses.size > 0 && (
          <View style={styles.selectionBar}>
            <Text style={styles.selectionText}>
              {selectedVerses.size} verse{selectedVerses.size > 1 ? 's' : ''} selected
            </Text>
            <View style={styles.selectionActions}>
              <Pressable
                onPress={clearSelection}
                style={({pressed}) => [styles.clearBtn, pressed && {opacity: 0.7}]}>
                <Text style={styles.clearBtnText}>Clear</Text>
              </Pressable>
              <Pressable
                onPress={() => setSaveSheetVisible(true)}
                style={({pressed}) => [styles.saveBtn, pressed && {opacity: 0.7}]}>
                <Text style={styles.saveBtnText}>Save Scripture</Text>
              </Pressable>
            </View>
          </View>
        )}
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

      {saveSheetVisible && selectedVerseData && (
        <SaveVerseSheet
          visible
          bookId={bookId}
          bookName={bookName}
          chapter={chapter}
          verseStart={selectedVerseData.verseStart}
          verseEnd={selectedVerseData.verseEnd > selectedVerseData.verseStart ? selectedVerseData.verseEnd : undefined}
          verseText={selectedVerseData.combinedText}
          translation={translation}
          onClose={() => setSaveSheetVisible(false)}
          onSaved={clearSelection}
        />
      )}
    </>
  );
}

export default BibleHomeScreen;
