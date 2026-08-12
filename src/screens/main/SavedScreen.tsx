import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

function SavedScreen() {
  const {savedCards} = useAppContext();
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
          marginBottom: spacing.xs,
        },
        subtitle: {
          ...typography.subhead,
          color: colors.muted,
        },
        cardWrapper: {
          borderRadius: radius.xl,
          marginBottom: spacing.sm,
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
        cardTitle: {
          ...typography.headline,
          fontWeight: '700',
          color: colors.text,
          marginBottom: spacing.sm,
        },
        cardBody: {
          ...typography.subhead,
          color: colors.muted,
          marginBottom: spacing.sm,
        },
        cardVerse: {
          ...typography.subhead,
          color: colors.text,
          marginBottom: spacing.xs,
        },
        cardReference: {
          ...typography.caption1,
          fontWeight: '700',
          color: colors.primaryDark,
        },
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
        emptyContent: {padding: spacing.md + 2},
        emptyTitle: {
          ...typography.headline,
          fontWeight: '700',
          color: colors.text,
          marginBottom: spacing.xs,
        },
        emptyText: {
          ...typography.subhead,
          color: colors.muted,
        },
      }),
    [colors],
  );

  return (
    <ScreenShell>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Saved</Text>
        <Text style={styles.title}>Your favourite encouragements</Text>
        <Text style={styles.subtitle}>
          Keep the verses and reflections you want to return to during the week.
        </Text>
      </View>

      {savedCards.length === 0 ? (
        <View style={styles.emptyWrapper}>
          {isLiquidGlassSupported && (
            <LiquidGlassView style={styles.emptyGlass} effect="regular" colorScheme={glassScheme} />
          )}
          <View style={styles.emptyContent}>
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptyText}>
              Save a verse from the Home tab and it will appear here.
            </Text>
          </View>
        </View>
      ) : (
        savedCards.map(card => (
          <View key={card.id} style={styles.cardWrapper}>
            {isLiquidGlassSupported && (
              <LiquidGlassView style={styles.cardGlass} effect="regular" colorScheme={glassScheme} />
            )}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardBody}>{card.encouragement}</Text>
              <Text style={styles.cardVerse}>{card.verse}</Text>
              <Text style={styles.cardReference}>{card.reference}</Text>
            </View>
          </View>
        ))
      )}
    </ScreenShell>
  );
}

export default SavedScreen;
