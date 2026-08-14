import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

function ResultsScreen() {
  const {devotionCards, selectedFeelings, toggleSavedCard, isSaved} = useAppContext();
  const {colors, isDark} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
          marginBottom: spacing.sm,
        },
        feelingPills: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.xs,
          marginBottom: spacing.xs,
        },
        pill: {
          paddingHorizontal: spacing.sm,
          paddingVertical: 3,
          borderRadius: radius.full,
          backgroundColor: colors.backgroundAccent,
        },
        pillText: {
          ...typography.caption1,
          fontWeight: '600',
          color: colors.primaryDark,
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
        cardTopRow: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: spacing.sm,
          gap: spacing.sm,
        },
        cardMeta: {
          flex: 1,
        },
        cardBadge: {
          ...typography.caption2,
          fontWeight: '700',
          color: colors.primaryDark,
          letterSpacing: 1,
          marginBottom: spacing.xs,
        },
        cardTitle: {
          ...typography.headline,
          fontWeight: '700',
          color: colors.text,
        },
        saveButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 2,
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
        cardBody: {
          ...typography.subhead,
          color: colors.muted,
          marginBottom: spacing.md,
          lineHeight: 22,
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.border,
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
          fontStyle: 'italic',
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
        <Text style={styles.eyebrow}>Scripture for this moment</Text>
        <Text style={styles.title}>Your Word for Today</Text>
        {selectedFeelings.length > 0 && (
          <View style={styles.feelingPills}>
            {selectedFeelings.map(f => (
              <View key={f} style={styles.pill}>
                <Text style={styles.pillText}>{f}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.cardsSection}>
        {devotionCards.map((card, index) => {
          const saved = isSaved(card.id);
          const badge = String(index + 1).padStart(2, '0');
          return (
            <View key={card.id} style={styles.cardWrapper}>
              {isLiquidGlassSupported && (
                <LiquidGlassView style={styles.cardGlass} effect="regular" colorScheme={glassScheme} />
              )}
              <View style={styles.cardContent}>
                <View style={styles.cardTopRow}>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardBadge}>{badge}</Text>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={saved ? 'Remove from saved' : 'Save'}
                    onPress={() => toggleSavedCard(card)}
                    style={[styles.saveButton, saved && styles.saveButtonActive]}>
                    <Text style={[styles.saveButtonText, saved && styles.saveButtonTextActive]}>
                      {saved ? '✓' : '+'}
                    </Text>
                  </Pressable>
                </View>

                <Text style={styles.cardBody}>{card.encouragement}</Text>

                <View style={styles.divider} />

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
