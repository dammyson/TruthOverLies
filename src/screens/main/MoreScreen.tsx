import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Switch, Text, View} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

type Category = {
  key: string;
  icon: string;
  label: string;
  description: string;
};

const CATEGORIES: Category[] = [
  {key: 'appearance', icon: '◐', label: 'Appearance', description: 'Theme & display'},
  {key: 'about', icon: '✦', label: 'About', description: 'TruthOverLies v1.0'},
  {key: 'share', icon: '↑', label: 'Share', description: 'Invite a friend'},
  {key: 'privacy', icon: '⊙', label: 'Privacy', description: 'Terms & policy'},
];

function MoreScreen() {
  const {logout} = useAppContext();
  const {colors, isDark, setThemeMode, themeMode} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: {marginBottom: spacing.lg},
        eyebrow: {
          ...typography.eyebrow,
          color: colors.primaryDark,
          marginBottom: spacing.xs,
        },
        title: {
          ...typography.largeTitle,
          fontWeight: '700',
          color: colors.text,
        },
        grid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.sm,
          marginBottom: spacing.md,
        },
        gridItem: {
          width: '47.5%',
          borderRadius: radius.xl,
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surfaceStrong,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        gridGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xl,
        },
        gridContent: {
          padding: spacing.md,
          minHeight: 100,
          justifyContent: 'space-between',
        },
        gridIcon: {
          ...typography.title1,
          color: colors.primaryDark,
          marginBottom: spacing.sm,
        },
        gridLabel: {
          ...typography.headline,
          fontWeight: '700',
          color: colors.text,
        },
        gridDesc: {
          ...typography.caption1,
          color: colors.muted,
          marginTop: 2,
        },
        settingsWrapper: {
          borderRadius: radius.xxl,
          marginBottom: spacing.md,
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surfaceStrong,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        settingsGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xxl,
        },
        settingsContent: {padding: spacing.md},
        settingsLabel: {
          ...typography.eyebrow,
          color: colors.primaryDark,
          marginBottom: spacing.sm,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 44,
          gap: spacing.sm,
        },
        rowLabel: {
          ...typography.subhead,
          color: colors.muted,
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.border,
          marginVertical: spacing.xs,
        },
        systemLink: {
          ...typography.footnote,
          fontWeight: '600',
          color: colors.primary,
          marginTop: spacing.xs,
        },
        signOutButton: {
          borderRadius: radius.xl,
          minHeight: 50,
          alignItems: 'center',
          justifyContent: 'center',
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surfaceStrong,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        signOutGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xl,
        },
        signOutText: {
          ...typography.headline,
          fontWeight: '600',
          color: colors.errorText,
        },
      }),
    [colors],
  );

  return (
    <ScreenShell>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Settings & More</Text>
      </View>

      {/* Category grid */}
      <View style={styles.grid}>
        {CATEGORIES.map(cat => (
          <Pressable
            key={cat.key}
            accessibilityRole="button"
            style={styles.gridItem}>
            {isLiquidGlassSupported && (
              <LiquidGlassView style={styles.gridGlass} effect="regular" colorScheme={glassScheme} />
            )}
            <View style={styles.gridContent}>
              <Text style={styles.gridIcon}>{cat.icon}</Text>
              <View>
                <Text style={styles.gridLabel}>{cat.label}</Text>
                <Text style={styles.gridDesc}>{cat.description}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Appearance settings */}
      <View style={styles.settingsWrapper}>
        {isLiquidGlassSupported && (
          <LiquidGlassView style={styles.settingsGlass} effect="regular" colorScheme={glassScheme} />
        )}
        <View style={styles.settingsContent}>
          <Text style={styles.settingsLabel}>Appearance</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Dark mode</Text>
            <Switch
              value={isDark}
              onValueChange={val => setThemeMode(val ? 'dark' : 'light')}
              trackColor={{false: colors.border, true: colors.primary}}
              thumbColor={colors.white}
            />
          </View>
          {themeMode !== 'system' && (
            <>
              <View style={styles.divider} />
              <Pressable accessibilityRole="button" onPress={() => setThemeMode('system')}>
                <Text style={styles.systemLink}>Use system setting</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      {/* Sign out */}
      <Pressable
        accessibilityRole="button"
        onPress={logout}
        style={styles.signOutButton}>
        {isLiquidGlassSupported && (
          <LiquidGlassView style={styles.signOutGlass} effect="clear" colorScheme={glassScheme} />
        )}
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </ScreenShell>
  );
}

export default MoreScreen;
