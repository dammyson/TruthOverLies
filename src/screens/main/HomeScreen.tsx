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
        header: {
          marginBottom: 14,
        },
        eyebrow: {
          fontSize: 14,
          lineHeight: 18,
          fontWeight: '700',
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: colors.primaryDark,
          marginBottom: 8,
        },
        title: {
          fontSize: 34,
          lineHeight: 40,
          fontWeight: '800',
          color: colors.text,
          marginBottom: 8,
        },
        subtitle: {
          fontSize: 16,
          lineHeight: 24,
          color: colors.muted,
        },
        panelWrapper: {
          borderRadius: 24,
          marginBottom: 16,
        },
        panelFallback: {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
        glassBackground: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 24,
        },
        panelContent: {
          padding: 16,
        },
        panelHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        },
        panelTitle: {
          fontSize: 16,
          lineHeight: 22,
          fontWeight: '800',
          color: colors.text,
        },
        counter: {
          fontSize: 13,
          lineHeight: 18,
          color: colors.primaryDark,
          fontWeight: '700',
        },
        feelingsWrap: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
        },
        feelingChip: {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 14,
          backgroundColor: colors.surfaceStrong,
          borderWidth: 1,
          borderColor: colors.border,
        },
        feelingChipActive: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        feelingText: {
          color: colors.text,
          fontSize: 14,
          lineHeight: 18,
          fontWeight: '600',
        },
        feelingTextActive: {
          color: colors.white,
        },
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
                  style={[styles.feelingChip, active ? styles.feelingChipActive : null]}>
                  <Text style={[styles.feelingText, active ? styles.feelingTextActive : null]}>
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
