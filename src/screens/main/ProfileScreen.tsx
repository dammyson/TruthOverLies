import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Switch, Text, View} from 'react-native';

import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';

function ProfileScreen() {
  const {currentUser, logout, savedCards, selectedFeelings} = useAppContext();
  const {colors, themeMode, setThemeMode, isDark} = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        profileCard: {
          backgroundColor: colors.surface,
          borderRadius: 28,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 18,
          alignItems: 'center',
        },
        badge: {
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: colors.badgeBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
        },
        badgeText: {
          fontSize: 22,
          lineHeight: 28,
          fontWeight: '800',
          color: colors.primaryDark,
        },
        eyebrow: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '700',
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: colors.primaryDark,
          marginBottom: 6,
        },
        name: {
          fontSize: 22,
          lineHeight: 28,
          fontWeight: '800',
          color: colors.text,
          textAlign: 'center',
          marginBottom: 4,
        },
        email: {
          fontSize: 14,
          lineHeight: 20,
          color: colors.muted,
          marginBottom: 16,
        },
        panel: {
          width: '100%',
          borderRadius: 20,
          backgroundColor: colors.surfaceStrong,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 16,
          marginBottom: 14,
        },
        panelTitle: {
          fontSize: 15,
          lineHeight: 20,
          fontWeight: '800',
          color: colors.text,
          marginBottom: 12,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
        },
        rowLabel: {
          fontSize: 14,
          lineHeight: 20,
          color: colors.muted,
        },
        rowValue: {
          flex: 1,
          fontSize: 14,
          lineHeight: 20,
          fontWeight: '700',
          color: colors.text,
          textAlign: 'right',
        },
        divider: {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: 10,
        },
        systemLink: {
          fontSize: 12,
          lineHeight: 16,
          color: colors.primary,
          fontWeight: '600',
          marginTop: 6,
          textAlign: 'right',
        },
        logoutButton: {
          minHeight: 48,
          minWidth: 140,
          borderRadius: 16,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
        },
        logoutText: {
          fontSize: 15,
          lineHeight: 20,
          fontWeight: '800',
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
      <View style={styles.profileCard}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{initials || 'GP'}</Text>
        </View>
        <Text style={styles.eyebrow}>Simple Profile</Text>
        <Text style={styles.name}>{currentUser.fullName}</Text>
        <Text style={styles.email}>{currentUser.email}</Text>

        <View style={styles.panel}>
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

        <View style={styles.panel}>
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

        <Pressable accessibilityRole="button" onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

export default ProfileScreen;
