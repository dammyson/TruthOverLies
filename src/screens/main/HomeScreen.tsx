import React, {useMemo} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';
import LinearGradient from 'react-native-linear-gradient';

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
          height: 200,
          marginBottom: spacing.md,
          justifyContent: 'flex-end',
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
        panelContent: {padding: spacing.md},
        panelHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.sm + 4,
        },
        panelTitle: {
          ...typography.headline,
          color: colors.text,
        },
        counter: {
          ...typography.footnote,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        feelingsWrap: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.sm,
        },
        feelingChip: {
          paddingHorizontal: spacing.sm + 4,
          paddingVertical: spacing.sm,
          borderRadius: radius.md,
          backgroundColor: colors.surfaceStrong,
          borderWidth: 1,
          borderColor: colors.border,
          minHeight: 44,
          justifyContent: 'center',
        },
        feelingChipActive: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        feelingText: {
          ...typography.subhead,
          fontWeight: '600',
          color: colors.text,
        },
        feelingTextActive: {color: colors.white},
        skeletonRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.sm,
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
        <LinearGradient
          colors={['#2D1810', '#5C3020', '#8B5E3C', '#C4A06B']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroEyebrow}>WORD FOR TODAY</Text>
          <Text style={styles.heroTitle}>
            Tell me how you{"'"}re feeling and receive a word for this moment.
          </Text>
        </View>
      </View>

      <MessageBanner message={authMessage} tone={authMessageTone} />

      {/* Feeling panel */}
      <View style={[styles.panelWrapper, !isLiquidGlassSupported && styles.panelFallback]}>
        {isLiquidGlassSupported && (
          <LiquidGlassView
            style={styles.glassBackground}
            effect="regular"
            colorScheme={isDark ? 'dark' : 'light'}
          />
        )}
        <View style={styles.panelContent}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>How are you feeling?</Text>
            <Text style={styles.counter}>{selectedFeelings.length}/4</Text>
          </View>
          {isCatalogLoading ? (
            <View style={styles.skeletonRow}>
              {[72, 88, 64, 80, 68, 92, 60, 76].map((w, i) => (
                <SkeletonBlock key={i} height={44} width={w} borderRadius={radius.md} />
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
                    style={[styles.feelingChip, active && styles.feelingChipActive]}>
                    <Text style={[styles.feelingText, active && styles.feelingTextActive]}>
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
