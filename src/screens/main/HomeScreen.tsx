import React, {useEffect, useMemo, useRef} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Animated, Easing, Pressable, StyleSheet, Text, View} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import HeroAnimation from '../../components/HeroAnimation';
import MessageBanner from '../../components/MessageBanner';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenShell from '../../components/ScreenShell';
import SkeletonBlock from '../../components/SkeletonBlock';
import {feelingOptions} from '../../data/devotions';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';
import useTransitionAction from '../../hooks/useTransitionAction';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
import {HomeStackParamList} from '../../navigation/HomeStackNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

const HERO_HEIGHT = 280;

function HomeScreen({navigation}: Props) {
  const {
    currentUser,
    authMessage,
    authMessageTone,
    clearAuthMessage,
    selectedFeelings,
    isCatalogLoading,
    toggleFeeling,
    generateDevotions,
  } = useAppContext();
  const {colors, isDark} = useTheme();
  const {isTransitioning, runWithTransition} = useTransitionAction();
  const glassScheme = isDark ? 'dark' : 'light';

  const eyebrowAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

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
          maxWidth: '78%',
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
        panelTitle: {
          ...typography.headline,
          fontWeight: '600',
          color: colors.text,
        },
        counterBadge: {
          paddingHorizontal: 10,
          paddingVertical: 3,
          borderRadius: 20,
          backgroundColor: colors.backgroundAccent,
        },
        counterText: {
          ...typography.caption1,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        // ── Feeling chips ─────────────────────────────────────────
        feelingsWrap: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.sm,
          marginBottom: spacing.sm,
        },
        chip: {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 2,
          borderRadius: radius.xl,
          overflow: 'hidden',
          minHeight: 44,
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
          borderRadius: radius.xl,
        },
        chipText: {
          ...typography.subhead,
          fontWeight: '600',
          color: colors.text,
        },
        chipTextActive: {
          color: colors.white,
        },
        skeletonRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.sm,
          marginBottom: spacing.sm,
        },
      }),
    [colors],
  );

  return (
    <ScreenShell>
      {/* Greeting */}
      <View style={styles.greetingRow}>
        <Text style={styles.greetingLabel}>Today's Encouragement</Text>
        <Text style={styles.greetingTitle}>
          {timeGreeting}{currentUser ? `, ${firstName}` : ''}
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
            WORD FOR TODAY
          </Animated.Text>
          <Animated.Text
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
            Tell me how you{"'"}re feeling and receive a word for this moment.
          </Animated.Text>
        </View>
      </View>

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
            <Text style={styles.panelTitle}>How are you feeling?</Text>
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>{selectedFeelings.length}/4</Text>
            </View>
          </View>

          {isCatalogLoading ? (
            <View style={styles.skeletonRow}>
              {[72, 88, 64, 80, 68, 92, 60, 76].map((w, i) => (
                <SkeletonBlock key={i} height={44} width={w} borderRadius={radius.xl} />
              ))}
            </View>
          ) : (
            <View style={styles.feelingsWrap}>
              {feelingOptions.map(feeling => {
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
            </View>
          )}

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
