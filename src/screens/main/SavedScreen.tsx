import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';

function SavedScreen() {
  const {savedCards} = useAppContext();
  const {colors, isDark} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: {marginBottom: 16},
        eyebrow: {
          fontSize: 12, lineHeight: 16, fontWeight: '700',
          letterSpacing: 1, textTransform: 'uppercase',
          color: colors.primaryDark, marginBottom: 6,
        },
        title: {
          fontSize: 24, lineHeight: 30, fontWeight: '800',
          color: colors.text, marginBottom: 6,
        },
        subtitle: {fontSize: 14, lineHeight: 20, color: colors.muted},
        cardWrapper: {
          borderRadius: 20,
          marginBottom: 12,
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surfaceStrong,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        cardGlass: {
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: 20,
        },
        cardContent: {padding: 14},
        cardTitle: {
          fontSize: 16, lineHeight: 22, fontWeight: '800',
          color: colors.text, marginBottom: 8,
        },
        cardBody: {
          fontSize: 14, lineHeight: 22,
          color: colors.muted, marginBottom: 12,
        },
        cardVerse: {
          fontSize: 14, lineHeight: 22,
          color: colors.text, marginBottom: 6,
        },
        cardReference: {
          fontSize: 12, lineHeight: 16,
          fontWeight: '700', color: colors.primaryDark,
        },
        emptyWrapper: {
          borderRadius: 24,
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        emptyGlass: {
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: 24,
        },
        emptyContent: {padding: 18},
        emptyTitle: {
          fontSize: 18, lineHeight: 24, fontWeight: '800',
          color: colors.text, marginBottom: 6,
        },
        emptyText: {fontSize: 14, lineHeight: 20, color: colors.muted},
      }),
    [colors],
  );

  return (
    <ScreenShell>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Saved</Text>
        <Text style={styles.title}>Your favorite encouragements</Text>
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
