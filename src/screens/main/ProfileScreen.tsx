import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Switch, Text, View} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';

function ProfileScreen() {
  const {currentUser, logout, savedCards, selectedFeelings} = useAppContext();
  const {colors, themeMode, setThemeMode, isDark} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        outerWrapper: {
          borderRadius: 28,
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        outerGlass: {
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: 28,
        },
        outerContent: {
          padding: 18,
          alignItems: 'center',
        },
        badge: {
          width: 70, height: 70, borderRadius: 35,
          backgroundColor: colors.badgeBg,
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 14,
        },
        badgeText: {
          fontSize: 22, lineHeight: 28,
          fontWeight: '800', color: colors.primaryDark,
        },
        eyebrow: {
          fontSize: 12, lineHeight: 16, fontWeight: '700',
          letterSpacing: 1, textTransform: 'uppercase',
          color: colors.primaryDark, marginBottom: 6,
        },
        name: {
          fontSize: 22, lineHeight: 28, fontWeight: '800',
          color: colors.text, textAlign: 'center', marginBottom: 4,
        },
        email: {
          fontSize: 14, lineHeight: 20,
          color: colors.muted, marginBottom: 16,
        },
        panelWrapper: {
          width: '100%',
          borderRadius: 20,
          marginBottom: 14,
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surfaceStrong,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        panelGlass: {
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: 20,
        },
        panelContent: {padding: 16},
        panelTitle: {
          fontSize: 15, lineHeight: 20, fontWeight: '800',
          color: colors.text, marginBottom: 12,
        },
        row: {
          flexDirection: 'row', alignItems: 'center',
          justifyContent: 'space-between', gap: 14,
        },
        rowLabel: {fontSize: 14, lineHeight: 20, color: colors.muted},
        rowValue: {
          flex: 1, fontSize: 14, lineHeight: 20,
          fontWeight: '700', color: colors.text, textAlign: 'right',
        },
        divider: {
          height: 1, backgroundColor: colors.border, marginVertical: 10,
        },
        systemLink: {
          fontSize: 12, lineHeight: 16, color: colors.primary,
          fontWeight: '600', marginTop: 6, textAlign: 'right',
        },
        logoutButton: {
          minHeight: 48, minWidth: 140, borderRadius: 16,
          backgroundColor: colors.primary,
          alignItems: 'center', justifyContent: 'center',
          paddingHorizontal: 20,
        },
        logoutText: {
          fontSize: 15, lineHeight: 20,
          fontWeight: '800', color: colors.white,
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
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{initials || 'GP'}</Text>
          </View>
          <Text style={styles.eyebrow}>Simple Profile</Text>
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

          <View style={styles.panelWrapper}>
            {isLiquidGlassSupported && (
              <LiquidGlassView style={styles.panelGlass} effect="clear" colorScheme={glassScheme} />
            )}
            <View style={styles.panelContent}>
              <Text style={styles.panelTitle}>Appearance</Text>
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

          <Pressable accessibilityRole="button" onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        </View>
      </View>
    </ScreenShell>
  );
}

export default ProfileScreen;
