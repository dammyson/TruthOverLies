import React, {useMemo} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';
import LinearGradient from 'react-native-linear-gradient';

import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

function ProfileScreen() {
  const {currentUser, savedCards, selectedFeelings} = useAppContext();
  const {colors, isDark} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        outerWrapper: {
          borderRadius: radius.xxl,
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        outerGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xxl,
        },
        outerContent: {
          padding: spacing.md + 2,
          alignItems: 'center',
        },
        badgeWrapper: {
          width: 72,
          height: 72,
          borderRadius: 36,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.md,
          ...(!isLiquidGlassSupported && {backgroundColor: colors.badgeBg}),
        },
        badgeGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: 36,
        },
        badgeText: {
          ...typography.title3,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        name: {
          ...typography.title2,
          fontWeight: '700',
          color: colors.text,
          textAlign: 'center',
          marginBottom: spacing.xs,
        },
        email: {
          ...typography.subhead,
          color: colors.muted,
          marginBottom: spacing.md,
        },
        panelWrapper: {
          width: '100%',
          borderRadius: radius.xl,
          marginBottom: spacing.sm + 4,
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surfaceStrong,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        panelGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xl,
        },
        panelContent: {padding: spacing.md},
        panelTitle: {
          ...typography.headline,
          color: colors.text,
          marginBottom: spacing.sm + 4,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
          minHeight: 44,
        },
        rowLabel: {
          ...typography.subhead,
          color: colors.muted,
        },
        rowValue: {
          flex: 1,
          ...typography.subhead,
          fontWeight: '600',
          color: colors.text,
          textAlign: 'right',
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
          textAlign: 'right',
        },
        logoutButton: {
          minHeight: 50,
          minWidth: 160,
          borderRadius: radius.lg,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: spacing.lg,
          marginTop: spacing.xs,
        },
        logoutText: {
          ...typography.headline,
          color: colors.white,
        },
      }),
    [colors],
  );

  if (!currentUser) {
    return null;
  }

  const initials = currentUser.fullName
    .split(' ')
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);

  return (
    <ScreenShell>
      <View style={styles.outerWrapper}>
        {isLiquidGlassSupported && (
          <LiquidGlassView style={styles.outerGlass} effect="regular" colorScheme={glassScheme} />
        )}
        <View style={styles.outerContent}>
          <View style={styles.badgeWrapper}>
            {isLiquidGlassSupported && (
              <LiquidGlassView
                style={styles.badgeGlass}
                effect="regular"
                colorScheme={glassScheme}
              />
            )}
            {!isDark && (
              <LinearGradient
                colors={['rgba(255,255,255,0.88)', 'rgba(74,47,36,0.28)']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={styles.badgeGlass}
              />
            )}
            <Text style={styles.badgeText}>{initials || 'GP'}</Text>
          </View>

          <Text style={styles.name}>{currentUser.fullName}</Text>
          <Text style={styles.email}>{currentUser.email}</Text>

          <View style={styles.panelWrapper}>
            {isLiquidGlassSupported && (
              <LiquidGlassView style={styles.panelGlass} effect="clear" colorScheme={glassScheme} />
            )}
            <View style={styles.panelContent}>
              <Text style={styles.panelTitle}>Account</Text>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Status</Text>
                <Text style={styles.rowValue}>Active</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Saved verses</Text>
                <Text style={styles.rowValue}>{savedCards.length}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Last feelings</Text>
                <Text style={styles.rowValue}>{selectedFeelings.join(', ')}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScreenShell>
  );
}

export default ProfileScreen;
