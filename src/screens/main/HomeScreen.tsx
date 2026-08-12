import React, {useMemo} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import MessageBanner from '../../components/MessageBanner';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenShell from '../../components/ScreenShell';
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
    authMessage,
    authMessageTone,
    clearAuthMessage,
    selectedFeelings,
    toggleFeeling,
    generateDevotions,
  } = useAppContext();
  const {colors, isDark} = useTheme();
  const {isTransitioning, runWithTransition} = useTransitionAction();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: {marginBottom: spacing.md},
        eyebrow: {
          ...typography.eyebrow,
          color: colors.primaryDark,
          marginBottom: spacing.sm,
        },
        title: {
          ...typography.largeTitle,
          fontWeight: '700',
          color: colors.text,
          marginBottom: spacing.sm,
        },
        subtitle: {
          ...typography.callout,
          color: colors.muted,
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
      }),
    [colors],
  );

  return (
    <ScreenShell>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Today's encouragement</Text>
        <Text style={styles.title}>How are you feeling today?</Text>
        <Text style={styles.subtitle}>
          Choose up to 4 feelings and receive a short encouragement with one or two verses.
        </Text>
      </View>

      <MessageBanner message={authMessage} tone={authMessageTone} />

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
            <Text style={styles.panelTitle}>Select feelings</Text>
            <Text style={styles.counter}>{selectedFeelings.length}/4</Text>
          </View>
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
          <PrimaryButton
            label="Continue"
            loading={isTransitioning}
            onPress={() => {
              runWithTransition(() => {
                const generated = generateDevotions();
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
