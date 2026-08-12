import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
import {HomeStackParamList} from '../../navigation/HomeStackNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, 'Results'>;

function ResultsScreen() {
  const {devotionCards, selectedFeelings, toggleSavedCard, isSaved} = useAppContext();
  const {colors, isDark} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        selectedText: {
          ...typography.caption1,
          color: colors.muted,
          marginBottom: spacing.sm,
        },
        header: {marginBottom: spacing.md},
        eyebrow: {
          ...typography.eyebrow,
          color: colors.primaryDark,
          marginBottom: spacing.xs,
        },
        title: {
          ...typography.title2,
          fontWeight: '700',
          color: colors.text,
          marginBottom: spacing.xs,
        },
        subtitle: {
          ...typography.subhead,
          color: colors.muted,
        },
        cardsSection: {gap: spacing.sm},
        cardWrapper: {
          borderRadius: radius.xl,
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
        cardContent: {padding: spacing.md},
        devotionTopRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.sm,
          gap: spacing.sm,
        },
        devotionTitle: {
          flex: 1,
          ...typography.headline,
          fontWeight: '700',
          color: colors.text,
        },
        saveButton: {
          borderRadius: radius.full,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: spacing.sm + 2,
          paddingVertical: spacing.xs + 2,
          backgroundColor: colors.surface,
        },
        saveButtonActive: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        saveButtonText: {
          ...typography.caption1,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        saveButtonTextActive: {color: colors.white},
        devotionBody: {
          ...typography.subhead,
          color: colors.muted,
          marginBottom: spacing.sm,
        },
        verseWrapper: {
          borderRadius: radius.md,
          ...(!isLiquidGlassSupported && {backgroundColor: colors.surface}),
        },
        verseGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.md,
        },
        verseContent: {padding: spacing.sm + 4},
        verseText: {
          ...typography.subhead,
          color: colors.text,
          marginBottom: spacing.xs,
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
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Your result</Text>
        <Text style={styles.title}>Scripture for this moment</Text>
        <Text style={styles.subtitle}>
          Receive these verses and words of encouragement for what you are carrying today.
        </Text>
      </View>

      {selectedFeelings.length > 0 && (
        <Text style={styles.selectedText}>{selectedFeelings.join(' · ')}</Text>
      )}

      <View style={styles.cardsSection}>
        {devotionCards.map(card => {
          const saved = isSaved(card.id);
          return (
            <View key={card.id} style={styles.cardWrapper}>
              {isLiquidGlassSupported && (
                <LiquidGlassView style={styles.cardGlass} effect="regular" colorScheme={glassScheme} />
              )}
              <View style={styles.cardContent}>
                <View style={styles.devotionTopRow}>
                  <Text style={styles.devotionTitle}>{card.title}</Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => toggleSavedCard(card)}
                    style={[styles.saveButton, saved && styles.saveButtonActive]}>
                    <Text style={[styles.saveButtonText, saved && styles.saveButtonTextActive]}>
                      {saved ? 'Saved' : 'Save'}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.devotionBody}>{card.encouragement}</Text>
                <View style={styles.verseWrapper}>
                  {isLiquidGlassSupported && (
                    <LiquidGlassView style={styles.verseGlass} effect="clear" colorScheme={glassScheme} />
                  )}
                  <View style={styles.verseContent}>
                    <Text style={styles.verseText}>{card.verse}</Text>
                    <Text style={styles.referenceText}>{card.reference}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScreenShell>
  );
}

export default ResultsScreen;
