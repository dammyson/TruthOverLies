import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import ScreenShell from '../../components/ScreenShell';
import SkeletonBlock from '../../components/SkeletonBlock';
import TranslationPickerModal from '../../components/TranslationPickerModal';
import {useTheme} from '../../context/ThemeContext';
import * as bibleRepo from '../../bible/bibleRepo';
import {BibleBook} from '../../api/bible';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
import {RootStackParamList} from '../../navigation/RootNavigator';

type Section = {title: string; data: BibleBook[]};

function BibleHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors, isDark} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';

  const [selectedTranslation, setSelectedTranslation] = useState('KJV');
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Auto-open the version picker on first tab focus
  const hasAutoOpened = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (!hasAutoOpened.current) {
        hasAutoOpened.current = true;
        setModalVisible(true);
      }
    }, []),
  );

  // Reload books whenever the selected translation changes
  useEffect(() => {
    setLoadingBooks(true);
    bibleRepo
      .getBooks(selectedTranslation)
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoadingBooks(false));
  }, [selectedTranslation]);

  const sections: Section[] = useMemo(() => {
    const ot = books.filter(b => b.testament === 'OT');
    const nt = books.filter(b => b.testament === 'NT');
    return [
      ...(ot.length ? [{title: 'Old Testament', data: ot}] : []),
      ...(nt.length ? [{title: 'New Testament', data: nt}] : []),
    ];
  }, [books]);

  const handleBookPress = useCallback(
    (book: BibleBook) => {
      navigation.navigate('ChapterGrid', {
        bookId: book.id,
        bookName: book.name,
        chapterCount: book.chapter_count,
        translation: selectedTranslation,
      });
    },
    [navigation, selectedTranslation],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        headerRow: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: spacing.md,
        },
        eyebrow: {
          ...typography.eyebrow,
          color: colors.primaryDark,
          marginBottom: spacing.xs,
        },
        title: {
          ...typography.largeTitle,
          fontWeight: '700',
          color: colors.text,
        },
        // Version badge button
        versionBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: radius.full,
          paddingHorizontal: spacing.sm + 4,
          paddingVertical: spacing.xs + 2,
          gap: 4,
          marginBottom: 4,
          overflow: 'hidden',
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        versionBtnGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.full,
        },
        versionText: {
          ...typography.footnote,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        versionChevron: {
          ...typography.footnote,
          color: colors.primaryDark,
          opacity: 0.6,
          marginTop: 1,
        },
        // Section header
        sectionHeader: {
          ...typography.eyebrow,
          color: colors.primaryDark,
          paddingVertical: spacing.sm,
          backgroundColor: colors.background,
        },
        // Book row
        bookWrapper: {
          borderRadius: radius.xl,
          marginBottom: spacing.xs,
          overflow: 'hidden',
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surface,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
          }),
        },
        bookGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xl,
        },
        bookRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 4,
          minHeight: 52,
          gap: spacing.sm,
        },
        bookName: {
          flex: 1,
          ...typography.subhead,
          fontWeight: '600',
          color: colors.text,
        },
        bookMeta: {
          ...typography.caption1,
          color: colors.muted,
        },
        chevron: {
          ...typography.body,
          color: colors.muted,
          marginLeft: spacing.xs,
        },
        skeletonList: {gap: spacing.xs},
      }),
    [colors],
  );

  return (
    <>
      <ScreenShell>
        {/* Header: title + version badge */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>Scripture</Text>
            <Text style={styles.title}>Bible</Text>
          </View>

          <Pressable
            onPress={() => setModalVisible(true)}
            style={({pressed}) => [styles.versionBtn, pressed && {opacity: 0.7}]}>
            {isLiquidGlassSupported && (
              <LiquidGlassView
                style={styles.versionBtnGlass}
                effect="regular"
                colorScheme={glassScheme}
              />
            )}
            <Text style={styles.versionText}>{selectedTranslation}</Text>
            <Text style={styles.versionChevron}>›</Text>
          </Pressable>
        </View>

        {/* Books list */}
        {loadingBooks ? (
          <View style={styles.skeletonList}>
            {Array.from({length: 8}).map((_, i) => (
              <SkeletonBlock key={i} height={52} borderRadius={radius.xl} />
            ))}
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={({section}) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            renderItem={({item}) => (
              <Pressable
                accessibilityRole="button"
                onPress={() => handleBookPress(item)}
                style={({pressed}) => [styles.bookWrapper, pressed && {opacity: 0.7}]}>
                {isLiquidGlassSupported && (
                  <LiquidGlassView
                    style={styles.bookGlass}
                    effect="regular"
                    colorScheme={glassScheme}
                  />
                )}
                <View style={styles.bookRow}>
                  <Text style={styles.bookName}>{item.name}</Text>
                  <Text style={styles.bookMeta}>{item.chapter_count} ch</Text>
                  <Text style={styles.chevron}>›</Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </ScreenShell>

      <TranslationPickerModal
        visible={modalVisible}
        selectedTranslation={selectedTranslation}
        onSelect={setSelectedTranslation}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

export default BibleHomeScreen;
