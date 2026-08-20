import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, {Circle, Line} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../context/ThemeContext';
import * as bibleRepo from '../bible/bibleRepo';
import {SearchResult} from '../bible/bibleRepo';
import {BibleBook} from '../api/bible';
import {spacing} from '../theme/spacing';

const H_PAD = 20;
const BTN_SIZE = 56;
const BTN_GAP = 8;

const TRENDING = [
  {label: 'Psalm 91', book: 'PSA', chapter: 91},
  {label: 'For I Know The Plans I Have For You', book: 'JER', chapter: 29},
  {label: 'Ephesians 4', book: 'EPH', chapter: 4},
  {label: 'John 3:16', book: 'JHN', chapter: 3},
  {label: 'Romans 8', book: 'ROM', chapter: 8},
  {label: 'Isaiah 40', book: 'ISA', chapter: 40},
  {label: 'Matthew 5', book: 'MAT', chapter: 5},
  {label: 'Proverbs 3:5', book: 'PRO', chapter: 3},
];

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

function XMark({size = 10, color = '#fff'}: {size?: number; color?: string}) {
  const off = size * 0.25;
  const far = size * 0.75;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <Line x1={off} y1={off} x2={far} y2={far} stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1={far} y1={off} x2={off} y2={far} stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

type Props = {
  visible: boolean;
  translation: string;
  onSelect: (bookId: string, bookName: string, chapter: number, chapterCount: number) => void;
  onClose: () => void;
};

function BibleSearchModal({visible, translation, onSelect, onClose}: Props) {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [verseResults, setVerseResults] = useState<SearchResult[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [notDownloaded, setNotDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [verseSearchRan, setVerseSearchRan] = useState(false);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!visible) return;
    setQuery('');
    setVerseResults([]);
    setNotDownloaded(false);
    setDownloading(false);
    setVerseSearchRan(false);
    setTimeout(() => inputRef.current?.focus(), 100);

    bibleRepo
      .getBooks(translation)
      .then(list => {
        const unique = list.filter((b, i, arr) => arr.findIndex(x => x.id === b.id) === i);
        setBooks(unique);
      })
      .catch(() => setBooks([]));
  }, [visible, translation]);

  const matchedBooks = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return books.filter(b => b.name.toLowerCase().includes(q));
  }, [query, books]);

  const runVerseSearch = useCallback(
    async (q: string) => {
      if (q.trim().length < 2) return;
      setVerseSearchRan(true);
      setLoadingVerses(true);
      try {
        const hits = await bibleRepo.searchVerses(translation, q);
        if (hits.length === 0) {
          if (bibleRepo.isDownloadInProgress(translation)) {
            setDownloading(true);
            setNotDownloaded(false);
          } else {
            const dl = await bibleRepo.isTranslationDownloaded(translation);
            setNotDownloaded(!dl);
            setDownloading(false);
          }
        } else {
          setNotDownloaded(false);
          setDownloading(false);
        }
        setVerseResults(hits);
      } catch {
        setVerseResults([]);
      } finally {
        setLoadingVerses(false);
      }
    },
    [translation],
  );

  const handleChangeText = useCallback((text: string) => {
    setQuery(text);
    setVerseResults([]);
    setNotDownloaded(false);
    setDownloading(false);
    setVerseSearchRan(false);
  }, []);

  const handleSelect = useCallback(
    (bookId: string, bookName: string, chapter: number, chapterCount: number) => {
      onSelect(bookId, bookName, chapter, chapterCount);
      onClose();
    },
    [onSelect, onClose],
  );

  const handleTrending = useCallback(
    (item: (typeof TRENDING)[number]) => {
      const book = books.find(b => b.id === item.book);
      if (book) handleSelect(book.id, book.name, item.chapter, book.chapter_count);
    },
    [books, handleSelect],
  );

  const clearQuery = useCallback(() => {
    setQuery('');
    setVerseResults([]);
    setNotDownloaded(false);
    setDownloading(false);
    setVerseSearchRan(false);
    inputRef.current?.focus();
  }, []);

  const highlight = useCallback(
    (text: string) => {
      const q = query.trim();
      if (!q) return <Text>{text}</Text>;
      const parts = text.split(new RegExp(`(${q})`, 'gi'));
      return (
        <>
          {parts.map((p, i) =>
            p.toLowerCase() === q.toLowerCase() ? (
              <Text key={i} style={{color: colors.primaryDark, fontWeight: '700'}}>{p}</Text>
            ) : (
              <Text key={i}>{p}</Text>
            ),
          )}
        </>
      );
    },
    [query, colors.primaryDark],
  );

  const s = useMemo(
    () =>
      StyleSheet.create({
        overlay: {flex: 1, backgroundColor: colors.background},
        scroll: {flex: 1},
        scrollContent: {paddingTop: insets.top + spacing.lg, paddingBottom: spacing.xl},
        trendingTitle: {
          fontSize: 22,
          fontWeight: '700',
          color: colors.text,
          paddingHorizontal: H_PAD,
          marginBottom: spacing.md,
        },
        trendingRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: H_PAD,
          paddingVertical: 13,
          gap: 14,
        },
        trendingIconCircle: {
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: colors.surfaceStrong,
          alignItems: 'center',
          justifyContent: 'center',
        },
        trendingIconText: {fontSize: 20},
        trendingLabel: {
          fontSize: 17,
          fontWeight: '400',
          color: colors.text,
          flexShrink: 1,
        },
        bookName: {
          fontSize: 22,
          fontWeight: '700',
          color: colors.text,
          paddingHorizontal: H_PAD,
          paddingTop: spacing.lg,
          paddingBottom: spacing.sm,
        },
        chapterRow: {
          paddingHorizontal: H_PAD,
          paddingBottom: spacing.sm,
        },
        chapterBtn: {
          width: BTN_SIZE,
          height: BTN_SIZE,
          borderRadius: 12,
          backgroundColor: colors.surfaceStrong,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: BTN_GAP,
        },
        chapterNum: {
          fontSize: 18,
          fontWeight: '700',
          color: colors.text,
        },
        verseSectionLabel: {
          fontSize: 13,
          fontWeight: '700',
          color: colors.muted,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          paddingHorizontal: H_PAD,
          paddingTop: spacing.md,
          paddingBottom: spacing.sm,
        },
        verseRow: {
          paddingHorizontal: H_PAD,
          paddingVertical: 11,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
        },
        verseRef: {
          fontSize: 13,
          fontWeight: '700',
          color: colors.primaryDark,
          marginBottom: 3,
        },
        verseText: {fontSize: 15, color: colors.text, lineHeight: 22},
        stateBox: {
          paddingHorizontal: H_PAD * 2,
          paddingTop: spacing.xl * 2,
          alignItems: 'center',
          gap: 8,
        },
        stateTitle: {
          fontSize: 17,
          fontWeight: '700',
          color: colors.text,
          textAlign: 'center',
        },
        stateSub: {
          fontSize: 14,
          color: colors.muted,
          textAlign: 'center',
          lineHeight: 20,
        },
        searchBarWrap: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: H_PAD,
          paddingVertical: 10,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
          gap: 10,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        },
        pill: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surfaceStrong,
          borderRadius: 999,
          height: 46,
          paddingHorizontal: 14,
          gap: 8,
        },
        pillIcon: {marginTop: 1},
        pillInput: {
          flex: 1,
          fontSize: 17,
          color: colors.text,
          paddingVertical: 0,
          includeFontPadding: false,
        },
        inlineClear: {
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: colors.muted + '80',
          alignItems: 'center',
          justifyContent: 'center',
        },
        closeCircle: {
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: colors.surfaceStrong,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [colors, insets],
  );

  const isEmpty = query.trim().length === 0;
  const hasBooks = matchedBooks.length > 0;
  const hasVerses = verseResults.length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}>
      <View style={s.overlay}>
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {isEmpty ? (
            <>
              <Text style={s.trendingTitle}>Trending Searches</Text>
              {TRENDING.map(item => (
                <Pressable
                  key={item.label}
                  style={({pressed}) => [s.trendingRow, pressed && {opacity: 0.5}]}
                  onPress={() => handleTrending(item)}>
                  <View style={s.trendingIconCircle}>
                    <Text style={s.trendingIconText}>🔥</Text>
                  </View>
                  <Text style={s.trendingLabel}>{item.label}</Text>
                </Pressable>
              ))}
            </>
          ) : (
            <>
              {hasBooks && matchedBooks.map(book => (
                <View key={book.id}>
                  <Text style={s.bookName}>{book.name}</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={s.chapterRow}>
                    {Array.from({length: book.chapter_count}, (_, i) => i + 1).map(ch => (
                      <Pressable
                        key={ch}
                        style={({pressed}) => [s.chapterBtn, pressed && {opacity: 0.5}]}
                        onPress={() => handleSelect(book.id, book.name, ch, book.chapter_count)}>
                        <Text style={s.chapterNum}>{ch}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              ))}

              {loadingVerses ? (
                <ActivityIndicator color={colors.primaryDark} style={{marginTop: spacing.xl}} />
              ) : downloading ? (
                <View style={s.stateBox}>
                  <Text style={s.stateTitle}>Downloading {translation}…</Text>
                  <Text style={s.stateSub}>
                    Verse search will be available once the download completes.
                  </Text>
                </View>
              ) : notDownloaded ? (
                <View style={s.stateBox}>
                  <Text style={s.stateTitle}>Not downloaded yet</Text>
                  <Text style={s.stateSub}>
                    Tap ↓ next to {translation} in the version picker to download it for verse search.
                  </Text>
                </View>
              ) : hasVerses ? (
                <>
                  <Text style={s.verseSectionLabel}>
                    Verses — {verseResults.length}{verseResults.length === 100 ? '+' : ''} results
                  </Text>
                  {verseResults.map(item => (
                    <Pressable
                      key={`${item.bookId}-${item.chapter}-${item.verse}`}
                      style={({pressed}) => [s.verseRow, pressed && {opacity: 0.5}]}
                      onPress={() => {
                        const book = books.find(b => b.id === item.bookId);
                        handleSelect(
                          item.bookId,
                          item.bookName,
                          item.chapter,
                          book?.chapter_count ?? item.chapter,
                        );
                      }}>
                      <Text style={s.verseRef}>
                        {item.bookName} {item.chapter}:{item.verse}
                      </Text>
                      <Text style={s.verseText} numberOfLines={3}>
                        {highlight(item.text)}
                      </Text>
                    </Pressable>
                  ))}
                </>
              ) : verseSearchRan && !hasBooks && !loadingVerses ? (
                <View style={s.stateBox}>
                  <Text style={s.stateTitle}>No results</Text>
                  <Text style={s.stateSub}>
                    Nothing matched "{query}" in {translation}.
                  </Text>
                </View>
              ) : null}
            </>
          )}
        </ScrollView>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={s.searchBarWrap}>
            <View style={s.pill}>
              <View style={s.pillIcon}>
                <MagnifyingGlass size={20} color={colors.muted} />
              </View>
              <TextInput
                ref={inputRef}
                style={s.pillInput}
                placeholder="Search"
                placeholderTextColor={colors.muted}
                value={query}
                onChangeText={handleChangeText}
                returnKeyType="search"
                onSubmitEditing={() => runVerseSearch(query)}
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="never"
              />
              {query.length > 0 && (
                <Pressable onPress={clearQuery} style={s.inlineClear} hitSlop={8}>
                  <XMark size={10} color={colors.background} />
                </Pressable>
              )}
            </View>
            <Pressable
              onPress={onClose}
              style={({pressed}) => [s.closeCircle, pressed && {opacity: 0.5}]}
              hitSlop={8}>
              <XMark size={14} color={colors.muted} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export default BibleSearchModal;
