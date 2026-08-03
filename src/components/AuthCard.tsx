import React, {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {colors} from '../theme/colors';

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

function AuthCard({title, subtitle, children}: AuthCardProps) {
  return (
    <>
      <View style={styles.heroBlock}>
        <Text style={styles.eyebrow}>God's Place</Text>
        <Text style={styles.heroTitle}>Encouraging words for your daily walk.</Text>
        <Text style={styles.heroText}>
          A calm place to return to prayer, scripture, and reflection.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {children}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  heroBlock: {
    marginBottom: 28,
  },
  eyebrow: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.primaryDark,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    maxWidth: 280,
  },
  heroText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
    maxWidth: 300,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#d7cab8',
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 30,
    shadowOffset: {width: 0, height: 18},
    elevation: 10,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
    marginBottom: 28,
  },
});

export default AuthCard;