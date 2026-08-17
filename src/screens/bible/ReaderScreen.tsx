import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import SkeletonBlock from '../../components/SkeletonBlock';
import {useTheme} from '../../context/ThemeContext';
import * as bibleRepo from '../../bible/bibleRepo';
import {BibleVerse} from '../../api/bible';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
type Props = NativeStackScreenProps<RootStackParamList, 'Reader'>;

function ReaderScreen({route, navigation}: Props) {
  const {bookId, bookName, chapter, chapterCount, translation} = route.params;
  const {colors, isDark} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';

  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadChapter = useCallback(
    async (ch: number) => {
      setLoading(true);
      setError(false);
      try {
        const data = await bibleRepo.getChapter(translation, bookId, ch);
        setVerses(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [translation, bookId],
  );

  useEffect(() => {
    loadChapter(chapter);
  }, [chapter, loadChapter]);

  // Update header title when chapter changes
  useEffect(() => {
    navigation.setOptions({headerTitle: `${bookName} ${chapter}`});
  }, [navigation, bookName, chapter]);

  const goToPrev = () => {
    if (chapter > 1) {
      navigation.replace('Reader', {
        bookId,
        bookName,
        chapter: chapter - 1,
        chapterCount,
        translation,
      });
    }
  };

  const goToNext = () => {
    if (chapter < chapterCount) {
      navigation.replace('Reader', {
        bookId,
        bookName,
        chapter: chapter + 1,
        chapterCount,
        translation,
      });
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {flex: 1, backgroundColor: colors.background},
        listContent: {
          paddingHorizontal: spacing.md + 2,
          paddingTop: spacing.md,
          paddingBottom: 120,
        },
        translationBadge: {
          alignSelf: 'flex-start',
          ...typography.eyebrow,
          color: colors.primaryDark,
          marginBottom: spacing.md,
        },
        verseRow: {
          flexDirection: 'row',
          marginBottom: spacing.sm + 4,
          gap: spacing.sm,
        },
        verseNum: {
          ...typography.caption1,
          fontWeight: '700',
          color: colors.primaryDark,
          width: 20,
          paddingTop: 3,
        },
        verseText: {
          flex: 1,
          ...typography.body,
          color: colors.text,
          lineHeight: 30,
        },
        skeletonList: {
          paddingHorizontal: spacing.md + 2,
          paddingTop: spacing.md,
          gap: spacing.md,
        },
        errorText: {
          ...typography.subhead,
          color: colors.muted,
          textAlign: 'center',
          marginTop: spacing.xl,
        },
        retryText: {
          ...typography.subhead,
          fontWeight: '700',
          color: colors.primaryDark,
          textAlign: 'center',
          marginTop: spacing.sm,
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
        },
        navBarGlass: {
          ...StyleSheet.absoluteFill,
        },
        navBtn: {
          flex: 1,
          borderRadius: radius.xl,
          minHeight: 48,
          alignItems: 'center',
          justifyContent: 'center',
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        navBtnGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xl,
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

  const renderVerse = useCallback(
    ({item}: {item: BibleVerse}) => (
      <View style={styles.verseRow}>
        <Text style={styles.verseNum}>{item.verse}</Text>
        <Text style={styles.verseText}>{item.text}</Text>
      </View>
    ),
    [styles],
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.skeletonList}>
          {Array.from({length: 6}).map((_, i) => (
            <SkeletonBlock
              key={i}
              height={i % 3 === 0 ? 60 : 44}
              borderRadius={radius.sm}
            />
          ))}
        </View>
      ) : error ? (
        <View>
          <Text style={styles.errorText}>Could not load this chapter.</Text>
          <Pressable onPress={() => loadChapter(chapter)}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={verses}
          keyExtractor={item => `${item.chapter}-${item.verse}`}
          renderItem={renderVerse}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <Text style={styles.translationBadge}>{translation}</Text>
          }
        />
      )}

      {/* Prev / Next nav bar */}
      <View style={styles.navBar}>
        {isLiquidGlassSupported && (
          <LiquidGlassView style={styles.navBarGlass} effect="regular" colorScheme={glassScheme} />
        )}
        <Pressable
          onPress={goToPrev}
          disabled={chapter <= 1}
          style={[styles.navBtn, chapter <= 1 && styles.navBtnDisabled]}>
          {isLiquidGlassSupported && (
            <LiquidGlassView style={styles.navBtnGlass} effect="clear" colorScheme={glassScheme} />
          )}
          <Text style={styles.navBtnText}>‹ Previous</Text>
        </Pressable>
        <Pressable
          onPress={goToNext}
          disabled={chapter >= chapterCount}
          style={[styles.navBtn, chapter >= chapterCount && styles.navBtnDisabled]}>
          {isLiquidGlassSupported && (
            <LiquidGlassView style={styles.navBtnGlass} effect="clear" colorScheme={glassScheme} />
          )}
          <Text style={styles.navBtnText}>Next ›</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default ReaderScreen;
