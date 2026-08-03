import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import {colors} from '../../theme/colors';

function ProfileScreen() {
  const {currentUser, logout, savedCards, selectedFeelings} = useAppContext();

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

        <Pressable accessibilityRole="button" onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
  },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#eed7be',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  eyebrow: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  name: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
    marginBottom: 28,
  },
  panel: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 28,
  },
  panelTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  rowLabel: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
  rowValue: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  logoutButton: {
    minHeight: 56,
    minWidth: 160,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoutText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    color: colors.white,
  },
});

export default ProfileScreen;