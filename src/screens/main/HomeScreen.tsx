import React, {useEffect, useMemo, useRef, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import HeroAnimation from '../../components/HeroAnimation';
import MessageBanner from '../../components/MessageBanner';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenShell from '../../components/ScreenShell';
import SkeletonBlock from '../../components/SkeletonBlock';
import ShareCardSheet from '../../components/share/ShareCardSheet';
import ShareIconButton from '../../components/share/ShareIconButton';
import {ShareCardPayload} from '../../types/share';
import VerseLink from '../../components/VerseLink';
import {getVerseOfTheDay} from '../../api/verseOfTheDay';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';
import useTransitionAction from '../../hooks/useTransitionAction';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
import {FeelingOption} from '../../types/app';
import {HomeStackParamList} from '../../navigation/HomeStackNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

type FeelingTab = 'feelings' | 'struggles';

const HERO_HEIGHT = 180;
const SEG_PAD = 4;
const SEG_GAP = 4;

function HomeScreen({navigation}: Props) {
  const {
    currentUser,
    authMessage,
    authMessageTone,
    clearAuthMessage,
    clearSelectedFeelings,
    selectedFeelings,
    feelingsCatalog,
    isCatalogLoading,
    toggleFeeling,
    generateDevotions,
  } = useAppContext();
  const {colors, isDark} = useTheme();
  const {isTransitioning, runWithTransition} = useTransitionAction();
  const glassScheme = isDark ? 'dark' : 'light';
  const [activeTab, setActiveTab] = useState<FeelingTab>('feelings');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [segWidth, setSegWidth] = useState(0);
  const [sharePayload, setSharePayload] = useState<ShareCardPayload | null>(null);
  const [verseOfTheDay, setVerseOfTheDay] = useState<{text: string; reference: string} | null>(null);

  const eyebrowAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(350),
      Animated.timing(eyebrowAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();
  }, [eyebrowAnim, titleAnim]);

  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const firstName = currentUser?.fullName.split(' ')[0] ?? 'Friend';
  const panelTitle = activeTab === 'feelings' ? 'How are you feeling?' : 'What are you struggling with?';
  const pillWidth = segWidth > 0 ? (segWidth - SEG_PAD * 2 - SEG_GAP) / 2 : 0;

  useEffect(() => {
    let mounted = true;

    const loadVerseOfTheDay = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const data = await getVerseOfTheDay(today);
        if (!mounted || !data?.length) return;
        const verse = data[0];
        setVerseOfTheDay({
          text: verse.text,
          reference: `${verse.book} ${verse.chapter}:${verse.verse}`,
        });
      } catch {
        if (mounted) {
          setVerseOfTheDay({
            text: 'But they that wait upon the Lord shall renew their strength.',
            reference: 'Isaiah 40:31',
          });
        }
      }
    };

    loadVerseOfTheDay();

    return () => {
      mounted = false;
    };
  }, []);

  const featuredVerse = verseOfTheDay ?? {
    text: 'But they that wait upon the Lord shall renew their strength.',
    reference: 'Isaiah 40:31',
  };

  const handleShareFeaturedVerse = () => {
    setSharePayload({
      kind: 'scripture',
      verse: featuredVerse.text,
      reference: featuredVerse.reference,
      translation: verseOfTheDay ? 'KJV' : 'KJV',
      moment: 'Daily verse',
      categoryName: 'Daily Verse',
      accentColor: null,
    });
  };

  useEffect(() => {
    if (pillWidth > 0) {
      slideAnim.setValue(activeTab === 'feelings' ? 0 : pillWidth + SEG_GAP);
    }
  }, [pillWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (tab: FeelingTab) => {
    if (tab !== activeTab) {
      clearAuthMessage();
      clearSelectedFeelings();
      setSearchQuery('');
      setIsSearchVisible(false);
      const toValue = tab === 'feelings' ? 0 : pillWidth + SEG_GAP;
      Animated.spring(slideAnim, {
        toValue,
        useNativeDriver: true,
        bounciness: 0,
        speed: 20,
      }).start();
      setActiveTab(tab);
    }
  };

  const filteredFeelings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return feelingsCatalog.filter(item => {
      const kind = (item.kind ?? item.category ?? '').toLowerCase();
      const matchesQuery =
        query.length === 0 ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.subcategory.toLowerCase().includes(query);

      if (activeTab === 'feelings') {
        return matchesQuery && (kind === 'feeling' || kind === 'feelings');
      }

      return (
        matchesQuery &&
        (kind === 'struggle' || kind === 'struggles' || kind.startsWith('strug'))
      );
    });
  }, [activeTab, feelingsCatalog, searchQuery]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        greetingRow: {
          marginBottom: spacing.md,
        },
        greetingLabel: {
          ...typography.eyebrow,
          color: colors.primaryDark,
          marginBottom: spacing.xs,
        },
        greetingTitle: {
          ...typography.largeTitle,
          fontWeight: '700',
          fontSize: 20,
          color: colors.text,
        },
        heroCard: {
          borderRadius: radius.xxl,
          overflow: 'hidden',
          height: HERO_HEIGHT,
          marginBottom: spacing.md,
          justifyContent: 'flex-end',
          backgroundColor: '#0A0504',
        },
        heroContent: {
          padding: spacing.md + 4,
        },
        heroEyebrow: {
          ...typography.eyebrow,
          color: 'rgba(255,245,230,0.65)',
          marginBottom: spacing.xs,
        },
        heroTitle: {
          ...typography.title3,
          fontWeight: '700',
          color: '#FFFDF5',
          maxWidth: '90%',
          overflow: 'hidden',
        },
        heroVerseWrap: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: 'rgba(255,255,255,0.18)',
          maxWidth: '82%',
          paddingTop: spacing.xs,
        },
        heroVerseText: {
          ...typography.subhead,
          color: '#FFFDF5',
          fontStyle: 'italic',
          lineHeight: 22,
          marginBottom: spacing.xs,
        },
        heroReferenceText: {
          ...typography.caption1,
          fontWeight: '700',
          color: '#F8E9D9',
          textDecorationLine: 'underline',
        },
        heroShareButton: {
          padding: 6,
          borderRadius: 999,
          backgroundColor: 'rgba(255,255,255,0.12)',
        },
        // ── Feeling panel ─────────────────────────────────────────
        panelWrapper: {
          borderRadius: radius.xxl,
          marginBottom: spacing.md,
        },
        panelFallback: {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
        glassBackground: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xxl,
        },
        panelContent: {
          padding: spacing.md + 2,
        },
        panelHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.md,
        },
        headerActions: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
        },
        panelTitle: {
          ...typography.headline,
          fontWeight: '600',
          color: colors.text,
        },
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
        searchIconButton: {
          width: 30,
          height: 30,
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.backgroundAccent,
        },
        searchIconText: {
          fontSize: 26,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        searchBox: {
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          paddingHorizontal: spacing.md,
          paddingVertical: 10,
          color: colors.text,
          marginBottom: spacing.sm,
          ...typography.subhead,
        },
        // ── Feeling chips ─────────────────────────────────────────
        feelingsWrap: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 6,
        },
        chip: {
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: radius.lg,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        },
        chipInactiveFallback: {
          backgroundColor: colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        chipActive: {
          backgroundColor: colors.primary,
        },
        chipGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.lg,
        },
        chipText: {
          ...typography.footnote,
          fontWeight: '600',
          color: colors.text,
        },
        chipTextActive: {
          color: colors.white,
        },
        chipsScroll: {
          maxHeight: 230,
          marginBottom: spacing.sm,
        },
        chipsScrollContent: {
          paddingBottom: 4,
        },
        emptyState: {
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.sm,
          alignItems: 'center',
        },
        emptyStateText: {
          ...typography.body,
          color: colors.muted,
          textAlign: 'center',
        },
        skeletonRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 6,
        },
      }),
    [colors],
  );

  return (
    <ScreenShell>
      {/* Greeting */}
      <View style={styles.greetingRow}>
        <Text style={styles.greetingTitle}>
          {timeGreeting}{currentUser ? `, ${firstName}!` : ''}
        </Text>
      </View>

      {/* Hero card */}
      <View style={styles.heroCard}>
        <HeroAnimation height={HERO_HEIGHT} />
        <View style={styles.heroContent}>
          <Animated.Text
            style={[
              styles.heroEyebrow,
              {
                opacity: eyebrowAnim,
                transform: [
                  {
                    translateY: eyebrowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [8, 0],
                    }),
                  },
                ],
              },
            ]}>
            VERSE OF THE DAY
          </Animated.Text>
          <Animated.Text
            numberOfLines={3}
            ellipsizeMode="tail"
            style={[
              styles.heroTitle,
              {
                opacity: titleAnim,
                transform: [
                  {
                    translateY: titleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [14, 0],
                    }),
                  },
                ],
              },
            ]}>
            {featuredVerse.text}
          </Animated.Text>
          <View style={styles.heroVerseWrap}>
            <VerseLink reference={featuredVerse.reference} style={styles.heroReferenceText} />
            <ShareIconButton
              onPress={handleShareFeaturedVerse}
              color="#F8E9D9"
              size={16}
              style={styles.heroShareButton}
            />
          </View>
        </View>
      </View>

      <ShareCardSheet
        visible={sharePayload != null}
        payload={sharePayload}
        onClose={() => setSharePayload(null)}
      />

      <MessageBanner message={authMessage} tone={authMessageTone} />

      {/* Feeling panel */}
      <View style={[styles.panelWrapper, !isLiquidGlassSupported && styles.panelFallback]}>
        {isLiquidGlassSupported && (
          <LiquidGlassView
            style={styles.glassBackground}
            effect="regular"
            colorScheme={glassScheme}
          />
        )}
        <View style={styles.panelContent}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>{panelTitle}</Text>
            <View style={styles.headerActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={isSearchVisible ? 'Hide search' : 'Show search'}
                onPress={() => setIsSearchVisible(current => !current)}
                style={({pressed}) => [styles.searchIconButton, pressed && {opacity: 0.8}]}> 
                <Text style={styles.searchIconText}>⌕</Text>
              </Pressable>
            </View>
          </View>

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
              {(['feelings', 'struggles'] as FeelingTab[]).map(tab => (
                <Pressable
                  key={tab}
                  accessibilityRole="button"
                  style={styles.segmentBtn}
                  onPress={() => handleTabChange(tab)}>
                  <Text style={[styles.segmentText, activeTab === tab && styles.segmentTextActive]}>
                    {tab === 'feelings' ? 'Feelings' : 'Struggles'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {isSearchVisible && (
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={`Search ${activeTab === 'feelings' ? 'feelings' : 'struggles'}...`}
              placeholderTextColor={colors.placeholder}
              style={styles.searchBox}
            />
          )}

          <ScrollView
            style={styles.chipsScroll}
            contentContainerStyle={styles.chipsScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {isCatalogLoading ? (
              <View style={styles.skeletonRow}>
                {[60, 72, 50, 66, 54, 78, 48, 62, 56, 70, 44, 58].map((w, i) => (
                  <SkeletonBlock key={i} height={30} width={w} borderRadius={radius.lg} />
                ))}
              </View>
            ) : (
              <View style={styles.feelingsWrap}>
                {filteredFeelings.map(item => {
                  const feeling = item.name as FeelingOption;
                  const active = selectedFeelings.includes(feeling);
                  return (
                    <Pressable
                      accessibilityRole="button"
                      key={feeling}
                      onPress={() => {
                        clearAuthMessage();
                        toggleFeeling(feeling);
                      }}
                      style={({pressed}) => [
                        styles.chip,
                        active
                          ? styles.chipActive
                          : !isLiquidGlassSupported && styles.chipInactiveFallback,
                        pressed && {opacity: 0.65},
                      ]}>
                      {!active && isLiquidGlassSupported && (
                        <LiquidGlassView
                          style={styles.chipGlass}
                          effect="clear"
                          colorScheme={glassScheme}
                        />
                      )}
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {feeling}
                      </Text>
                    </Pressable>
                  );
                })}

                {filteredFeelings.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                      No {activeTab} available yet.
                    </Text>
                  </View>
                ) : null}
              </View>
            )}
          </ScrollView>

          <PrimaryButton
            label="Continue"
            loading={isTransitioning}
            onPress={() => {
              runWithTransition(async () => {
                const generated = await generateDevotions();
                if (generated) {
                  navigation.navigate('Results');
                }
              });
            }}
          />
        </View>
      </View>
    </ScreenShell>
  );
}

export default HomeScreen;
