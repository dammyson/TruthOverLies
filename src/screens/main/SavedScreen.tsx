import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const SEG_PAD = 4;
const SEG_GAP = 4;
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Path} from 'react-native-svg';

import ScreenShell from '../../components/ScreenShell';
import SkeletonBlock from '../../components/SkeletonBlock';
import VerseLink from '../../components/VerseLink';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';
import {useScriptures} from '../../context/ScriptureContext';
import {SavedScripture} from '../../types/app';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
import {RootStackParamList} from '../../navigation/RootNavigator';

type Tab = 'devotions' | 'scriptures';

// ── Icons ─────────────────────────────────────────────────────────────────────

function BookmarkIcon({size = 18, color = '#4A2F24', filled = false}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color + '28' : 'none'}
      />
    </Svg>
  );
}

function TrashIcon({size = 16, color = '#B85B5B'}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── Scripture card ────────────────────────────────────────────────────────────

function ScriptureCard({
  scripture,
  onDelete,
  colors,
  isDark,
}: {
  scripture: SavedScripture;
  onDelete: () => void;
  colors: ReturnType<typeof import('../../context/ThemeContext').useTheme>['colors'];
  isDark: boolean;
}) {
  const accentColor = scripture.categoryColor ?? colors.primaryDark;

  const cardStyles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          borderRadius: radius.xl,
          marginBottom: spacing.md,
          overflow: 'hidden',
          backgroundColor: isDark ? '#2A2218' : '#FFFDF5',
          shadowColor: accentColor,
          shadowOpacity: 0.15,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 3},
          elevation: 4,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: accentColor + '25',
        },
        header: {
          paddingLeft: 20,
          paddingRight: spacing.md,
          paddingTop: 14,
          paddingBottom: 14,
        },
        headerGradient: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        catBadge: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          alignSelf: 'flex-start',
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 10,
          backgroundColor: 'rgba(255,255,255,0.22)',
          marginBottom: 6,
        },
        catDot: {width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#FFFDF5'},
        catName: {fontSize: 10, fontWeight: '800', letterSpacing: 0.8, color: '#FFFDF5'},
        reference: {fontSize: 20, fontWeight: '800', color: '#FFFDF5', letterSpacing: 0.1},
        body: {
          paddingLeft: 20,
          paddingRight: spacing.md,
          paddingTop: 14,
          paddingBottom: 12,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: accentColor + '30',
        },
        quoteChar: {
          fontSize: 28,
          lineHeight: 24,
          color: accentColor + '55',
          fontWeight: '900',
          marginBottom: 4,
        },
        verseText: {
          fontSize: 15,
          color: isDark ? '#D8D4C8' : '#2E2C29',
          lineHeight: 23,
          letterSpacing: 0.1,
        },
        momentBlock: {
          marginTop: 12,
          borderLeftWidth: 3,
          borderLeftColor: accentColor + '70',
          paddingLeft: 10,
          paddingVertical: 3,
        },
        momentLabel: {
          fontSize: 9,
          fontWeight: '800',
          letterSpacing: 1.2,
          color: accentColor,
          marginBottom: 3,
        },
        momentText: {
          fontSize: 13,
          color: isDark ? '#A8A498' : '#72746A',
          lineHeight: 18,
          fontStyle: 'italic',
        },
        footer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 14,
          paddingTop: 10,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: accentColor + '35',
        },
        dateText: {fontSize: 11, color: isDark ? '#7E7B6E' : '#A8A498', letterSpacing: 0.3},
        deleteBtn: {padding: 4},
      }),
    [accentColor, isDark],
  );

  const formattedDate = useMemo(() => {
    const d = new Date(scripture.createdAt);
    return d.toLocaleDateString(undefined, {day: 'numeric', month: 'short', year: 'numeric'});
  }, [scripture.createdAt]);

  const headerColors: [string, string, string] = [
    accentColor + 'F0',
    accentColor + 'CC',
    accentColor + 'A0',
  ];

  return (
    <View style={cardStyles.card}>
      {/* Colored gradient header */}
      <View style={cardStyles.header}>
        <LinearGradient
          colors={headerColors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={cardStyles.headerGradient}
        />
        {scripture.categoryName ? (
          <View style={cardStyles.catBadge}>
            <View style={cardStyles.catDot} />
            <Text style={cardStyles.catName}>{scripture.categoryName.toUpperCase()}</Text>
          </View>
        ) : null}
        <Text style={cardStyles.reference}>{scripture.reference}</Text>
      </View>

      {/* Body content */}
      <View style={cardStyles.body}>
        {scripture.verseText ? (
          <>
            <Text style={cardStyles.quoteChar}>❝</Text>
            <Text style={cardStyles.verseText}>{scripture.verseText}</Text>
          </>
        ) : null}
        {scripture.moment ? (
          <View style={cardStyles.momentBlock}>
            <Text style={cardStyles.momentLabel}>REFLECTION</Text>
            <Text style={cardStyles.momentText}>{scripture.moment}</Text>
          </View>
        ) : null}
        <View style={cardStyles.footer}>
          <Text style={cardStyles.dateText}>{formattedDate} · {scripture.translation}</Text>
          <Pressable style={cardStyles.deleteBtn} onPress={onDelete} hitSlop={8}>
            <TrashIcon color="#B85B5B" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

function SavedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {savedCards, isSavedLoading} = useAppContext();
  const {scriptures, categories, isLoading: isScripturesLoading, deleteVerse} = useScriptures();
  const {colors, isDark} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';

  const [activeTab, setActiveTab] = useState<Tab>('devotions');
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const [segWidth, setSegWidth] = useState(0);
  const pillWidth = segWidth > 0 ? (segWidth - SEG_PAD * 2 - SEG_GAP) / 2 : 0;

  useEffect(() => {
    if (pillWidth > 0) {
      slideAnim.setValue(activeTab === 'devotions' ? 0 : pillWidth + SEG_GAP);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pillWidth]);

  const handleTabChange = useCallback(
    (tab: Tab) => {
      const toValue = tab === 'devotions' ? 0 : pillWidth + SEG_GAP;
      Animated.spring(slideAnim, {
        toValue,
        useNativeDriver: true,
        damping: 18,
        stiffness: 180,
        mass: 0.8,
      }).start();
      setActiveTab(tab);
    },
    [slideAnim, pillWidth],
  );

  const filteredScriptures = useMemo(
    () =>
      activeCategoryId == null
        ? scriptures
        : scriptures.filter(s => s.categoryId === activeCategoryId),
    [scriptures, activeCategoryId],
  );

  const handleDelete = useCallback(
    (s: SavedScripture) => {
      Alert.alert(
        'Remove Scripture',
        `Remove "${s.reference}" from your library?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => deleteVerse(s.id),
          },
        ],
      );
    },
    [deleteVerse],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // ── Header ──────────────────────────────────────────────
        header: {marginBottom: spacing.md},
        eyebrow: {
          ...typography.eyebrow,
          color: colors.primaryDark,
          marginBottom: spacing.xs,
        },
        titleRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          marginBottom: spacing.xs,
        },
        title: {
          ...typography.title2,
          fontWeight: '700',
          color: colors.text,
        },
        countBadge: {
          paddingHorizontal: spacing.sm,
          paddingVertical: 2,
          borderRadius: radius.full,
          backgroundColor: colors.backgroundAccent,
          alignSelf: 'center',
        },
        countText: {
          ...typography.caption1,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        subtitle: {
          ...typography.subhead,
          color: colors.muted,
          marginTop: spacing.xs,
        },
        // ── Segmented control ───────────────────────────────────
        segmentWrapper: {
          borderRadius: radius.xl,
          overflow: 'hidden',
          marginBottom: spacing.md,
          backgroundColor: colors.surface,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        segmentIndicator: {
          position: 'absolute',
          top: SEG_PAD,
          bottom: SEG_PAD,
          left: SEG_PAD,
          borderRadius: radius.lg,
          backgroundColor: colors.primaryDark,
        },
        segmentRow: {
          flexDirection: 'row',
          padding: SEG_PAD,
          gap: SEG_GAP,
        },
        segmentBtn: {
          flex: 1,
          paddingVertical: 9,
          alignItems: 'center',
          borderRadius: radius.lg,
        },
        segmentText: {
          ...typography.footnote,
          fontWeight: '600',
          color: colors.muted,
        },
        segmentTextActive: {
          color: '#FFFDF5',
          fontWeight: '700',
        },
        // ── Category filter ─────────────────────────────────────
        categoryScroll: {height: 40, marginBottom: spacing.md},
        categoryChip: {
          flexDirection: 'row',
          alignItems: 'center',
          height: 34,
          paddingHorizontal: 14,
          borderRadius: 17,
          marginRight: 8,
          gap: 5,
          backgroundColor: colors.surface,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        categoryChipActive: {
          backgroundColor: colors.primaryDark,
          borderColor: colors.primaryDark,
        },
        categoryDot: {
          width: 6,
          height: 6,
          borderRadius: 3,
        },
        categoryChipText: {
          ...typography.footnote,
          fontWeight: '600',
          color: colors.muted,
        },
        categoryChipTextActive: {
          color: '#FFFDF5',
          fontWeight: '700',
        },
        // ── Empty state ─────────────────────────────────────────
        emptyWrapper: {
          borderRadius: radius.xxl,
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        emptyGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xxl,
        },
        emptyContent: {padding: spacing.lg, alignItems: 'center', gap: spacing.sm},
        emptyIcon: {opacity: 0.3},
        emptyTitle: {
          ...typography.headline,
          fontWeight: '700',
          color: colors.text,
        },
        emptyText: {
          ...typography.subhead,
          color: colors.muted,
          textAlign: 'center',
        },
        // ── Devotion cards ──────────────────────────────────────
        cardWrapper: {
          borderRadius: radius.xl,
          marginBottom: spacing.sm,
          overflow: 'hidden',
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surfaceStrong,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        cardGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xl,
        },
        cardContent: {
          flexDirection: 'row',
          padding: spacing.md,
          gap: spacing.sm,
        },
        accentBar: {
          width: 3,
          borderRadius: 2,
          backgroundColor: colors.primary,
          alignSelf: 'stretch',
        },
        cardBody: {flex: 1},
        cardTitle: {
          ...typography.headline,
          fontWeight: '700',
          color: colors.text,
          marginBottom: spacing.xs,
        },
        cardExcerpt: {
          ...typography.footnote,
          color: colors.muted,
          marginBottom: spacing.sm,
          lineHeight: 18,
        },
        referenceRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
        },
        referenceDot: {
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.primaryDark,
        },
        referenceText: {
          ...typography.caption1,
          fontWeight: '700',
          color: colors.primaryDark,
        },
      }),
    [colors],
  );

  return (
    <ScreenShell>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Your Collection</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Saved</Text>
          {activeTab === 'devotions' && !isSavedLoading && savedCards.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{savedCards.length}</Text>
            </View>
          )}
          {activeTab === 'scriptures' && !isScripturesLoading && scriptures.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{scriptures.length}</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>
          {activeTab === 'devotions'
            ? 'Devotions and reflections you want to return to.'
            : 'Verses saved directly from the Bible.'}
        </Text>
      </View>

      {/* Segmented control */}
      <View
        style={styles.segmentWrapper}
        onLayout={e => setSegWidth(e.nativeEvent.layout.width)}>
        {pillWidth > 0 && (
          <Animated.View
            style={[
              styles.segmentIndicator,
              {width: pillWidth, transform: [{translateX: slideAnim}]},
            ]}
          />
        )}
        <View style={styles.segmentRow}>
          {(['devotions', 'scriptures'] as Tab[]).map(tab => (
            <Pressable
              key={tab}
              style={styles.segmentBtn}
              onPress={() => handleTabChange(tab)}>
              <Text style={[styles.segmentText, activeTab === tab && styles.segmentTextActive]}>
                {tab === 'devotions' ? 'Devotions' : 'Scriptures'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── SCRIPTURES TAB ── */}
      {activeTab === 'scriptures' && (
        <>
          {/* Category filter chips — View wrapper guarantees height:40 in layout */}
          {categories.length > 0 && (
            <View style={styles.categoryScroll}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{alignItems: 'center'}}>
                <Pressable
                  onPress={() => setActiveCategoryId(null)}
                  style={({pressed}) => [styles.categoryChip, activeCategoryId == null && styles.categoryChipActive, pressed && {opacity: 0.7}]}>
                  <Text style={[styles.categoryChipText, activeCategoryId == null && styles.categoryChipTextActive]}>
                    All
                  </Text>
                </Pressable>

                {categories.map(cat => {
                  const isActive = activeCategoryId === cat.id;
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => setActiveCategoryId(prev => (prev === cat.id ? null : cat.id))}
                      style={({pressed}) => [styles.categoryChip, isActive && styles.categoryChipActive, pressed && {opacity: 0.7}]}>
                      <View style={[styles.categoryDot, {backgroundColor: isActive ? '#FFFDF5' : (cat.color ?? colors.primaryDark)}]} />
                      <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                        {cat.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {isScripturesLoading ? (
            <>
              {[1, 2, 3].map(i => (
                <SkeletonBlock key={i} height={110} borderRadius={radius.xl} style={{marginBottom: spacing.sm}} />
              ))}
            </>
          ) : filteredScriptures.length === 0 ? (
            <View style={styles.emptyWrapper}>
              {isLiquidGlassSupported && (
                <LiquidGlassView style={styles.emptyGlass} effect="regular" colorScheme={glassScheme} />
              )}
              <View style={styles.emptyContent}>
                <View style={styles.emptyIcon}>
                  <BookmarkIcon size={36} color={colors.primaryDark} />
                </View>
                <Text style={styles.emptyTitle}>No scriptures saved</Text>
                <Text style={styles.emptyText}>
                  Tap the bookmark icon on any verse in the Bible reader to save it here.
                </Text>
              </View>
            </View>
          ) : (
            filteredScriptures.map(s => (
              <ScriptureCard
                key={s.id}
                scripture={s}
                onDelete={() => handleDelete(s)}
                colors={colors}
                isDark={isDark}
              />
            ))
          )}
        </>
      )}

      {/* ── DEVOTIONS TAB ── */}
      {activeTab === 'devotions' && (
        <>
          {isSavedLoading ? (
            <>
              {[1, 2, 3].map(i => (
                <SkeletonBlock key={i} height={120} borderRadius={radius.xl} style={{marginBottom: spacing.sm}} />
              ))}
            </>
          ) : savedCards.length === 0 ? (
            <View style={styles.emptyWrapper}>
              {isLiquidGlassSupported && (
                <LiquidGlassView style={styles.emptyGlass} effect="regular" colorScheme={glassScheme} />
              )}
              <View style={styles.emptyContent}>
                <Text style={styles.emptyTitle}>Nothing saved yet</Text>
                <Text style={styles.emptyText}>
                  Tap + on any card in the Home tab to save a devotion here.
                </Text>
              </View>
            </View>
          ) : (
            savedCards.map(card => (
              <Pressable
                key={card.id}
                accessibilityRole="button"
                onPress={() => navigation.navigate('SavedDetail', {card})}
                style={({pressed}) => [styles.cardWrapper, pressed && {opacity: 0.75}]}>
                {isLiquidGlassSupported && (
                  <LiquidGlassView style={styles.cardGlass} effect="regular" colorScheme={glassScheme} />
                )}
                <View style={styles.cardContent}>
                  <View style={styles.accentBar} />
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardExcerpt} numberOfLines={2}>
                      {card.encouragement}
                    </Text>
                    <View style={styles.referenceRow}>
                      <View style={styles.referenceDot} />
                      <VerseLink reference={card.reference} style={styles.referenceText} />
                    </View>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </>
      )}
    </ScreenShell>
  );
}

export default SavedScreen;
