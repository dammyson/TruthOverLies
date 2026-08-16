import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Switch, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import ScreenShell from '../../components/ScreenShell';
import {ThemeMode, useTheme} from '../../context/ThemeContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

// ── Mini phone preview ────────────────────────────────────────────────────────

function PhonePreview({mode}: {mode: 'light' | 'dark'}) {
  const light = mode === 'light';
  const bg = light ? '#FAF8EE' : '#1A1510';
  const accent = light ? '#EBD0CF' : '#3A2216';
  const card = light ? '#FFFFFF' : '#2A2218';
  const line = light ? '#282421' : '#F5F0E8';

  return (
    <View style={previewStyles.frame}>
      <LinearGradient
        colors={[bg, accent]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={StyleSheet.absoluteFill}
      />
      {/* Dynamic island */}
      <View style={previewStyles.island} />
      {/* Hero text lines */}
      <View style={previewStyles.heroArea}>
        <View style={[previewStyles.lineWide, {backgroundColor: line, opacity: 0.75}]} />
        <View style={[previewStyles.lineNarrow, {backgroundColor: line, opacity: 0.4}]} />
      </View>
      {/* Card block */}
      <View style={[previewStyles.cardBlock, {backgroundColor: card}]}>
        <View style={[previewStyles.lineMed, {backgroundColor: line, opacity: 0.6}]} />
        <View style={[previewStyles.lineMed, {backgroundColor: line, opacity: 0.35, width: '70%'}]} />
        <View style={[previewStyles.lineMed, {backgroundColor: line, opacity: 0.25, width: '50%'}]} />
      </View>
      {/* Bottom chips */}
      <View style={previewStyles.chipRow}>
        {[1, 2, 3].map(i => (
          <View
            key={i}
            style={[previewStyles.chip, {backgroundColor: line, opacity: light ? 0.12 : 0.2}]}
          />
        ))}
      </View>
    </View>
  );
}

const previewStyles = StyleSheet.create({
  frame: {
    width: 88,
    height: 136,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(128,100,70,0.2)',
  },
  island: {
    width: 22,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#000',
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  heroArea: {
    paddingHorizontal: 7,
    gap: 4,
    marginBottom: 6,
  },
  lineWide: {height: 5, borderRadius: 3},
  lineNarrow: {height: 4, borderRadius: 3, width: '60%'},
  cardBlock: {
    marginHorizontal: 7,
    borderRadius: 7,
    padding: 6,
    gap: 3,
    marginBottom: 5,
  },
  lineMed: {height: 4, borderRadius: 2},
  chipRow: {
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: 7,
  },
  chip: {
    height: 12,
    flex: 1,
    borderRadius: 6,
  },
});

// ── Radio button ──────────────────────────────────────────────────────────────

function RadioDot({selected, color}: {selected: boolean; color: string}) {
  return (
    <View
      style={[
        radioStyles.outer,
        {borderColor: selected ? color : 'rgba(128,100,70,0.3)'},
        selected && {backgroundColor: color},
      ]}>
      {selected && <View style={radioStyles.check} />}
    </View>
  );
}

const radioStyles = StyleSheet.create({
  outer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFDF5',
  },
});

// ── Main screen ───────────────────────────────────────────────────────────────

function AppearanceScreen() {
  const {colors, isDark, themeMode, setThemeMode} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';

  const explicitMode: 'light' | 'dark' = isDark ? 'dark' : 'light';

  const handleModePress = (mode: 'light' | 'dark') => {
    setThemeMode(mode as ThemeMode);
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        sectionLabel: {
          ...typography.footnote,
          fontWeight: '600',
          color: colors.muted,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: spacing.xs,
          marginLeft: spacing.xs,
        },
        card: {
          borderRadius: radius.xxl,
          marginBottom: spacing.md,
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        cardGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xxl,
        },
        cardContent: {padding: spacing.md + 2},
        previewRow: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          paddingBottom: spacing.md,
        },
        previewItem: {
          alignItems: 'center',
          gap: spacing.sm,
        },
        modeLabel: {
          ...typography.subhead,
          color: colors.text,
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.border,
          marginBottom: spacing.sm,
        },
        automaticRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 44,
        },
        automaticLabel: {
          ...typography.body,
          color: colors.text,
        },
        automaticCaption: {
          ...typography.caption1,
          color: colors.muted,
          marginLeft: spacing.xs,
          marginTop: 2,
        },
      }),
    [colors],
  );

  return (
    <ScreenShell>
      <Text style={styles.sectionLabel}>Appearance</Text>

      <View style={styles.card}>
        {isLiquidGlassSupported && (
          <LiquidGlassView style={styles.cardGlass} effect="regular" colorScheme={glassScheme} />
        )}
        <View style={styles.cardContent}>
          {/* Light / Dark previews */}
          <View style={styles.previewRow}>
            {(['light', 'dark'] as const).map(mode => (
              <Pressable
                key={mode}
                accessibilityRole="radio"
                accessibilityState={{checked: explicitMode === mode}}
                onPress={() => handleModePress(mode)}
                style={styles.previewItem}>
                <PhonePreview mode={mode} />
                <Text style={styles.modeLabel}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
                <RadioDot
                  selected={explicitMode === mode && themeMode !== 'system'}
                  color={colors.primaryDark}
                />
              </Pressable>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Automatic toggle */}
          <View style={styles.automaticRow}>
            <View>
              <Text style={styles.automaticLabel}>Automatic</Text>
              <Text style={styles.automaticCaption}>Follows system appearance</Text>
            </View>
            <Switch
              value={themeMode === 'system'}
              onValueChange={val =>
                setThemeMode(val ? 'system' : explicitMode)
              }
              trackColor={{false: colors.border, true: colors.primary}}
              thumbColor={colors.white}
            />
          </View>
        </View>
      </View>
    </ScreenShell>
  );
}

export default AppearanceScreen;
