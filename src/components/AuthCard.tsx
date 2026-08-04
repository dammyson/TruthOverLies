import React, { ReactNode, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

function AuthCard({ title, subtitle, children }: AuthCardProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        heroBlock: {
          marginBottom: 12,
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
        heroTitle: {
          fontSize: 34,
          lineHeight: 40,
          fontWeight: '800',
          color: colors.text,
          maxWidth: 300,
          marginBottom: 8,
        },
        card: {
          width: '100%',
          maxWidth: 420,
          alignSelf: 'center',
          backgroundColor: colors.surface,
          borderRadius: 28,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 20,
          paddingVertical: 16,
          shadowColor: colors.shadow,
          shadowOpacity: 0.16,
          shadowRadius: 30,
          shadowOffset: { width: 0, height: 18 },
          elevation: 10,
        },
        title: {
          fontSize: 24,
          lineHeight: 30,
          fontWeight: '800',
          color: colors.text,
          marginBottom: 4,
        },
        subtitle: {
          fontSize: 14,
          lineHeight: 20,
          color: colors.muted,
          marginBottom: 14,
        },
      }),
    [colors],
  );

  return (
    <>
      <View style={styles.heroBlock}>
        <Text style={styles.eyebrow}>God's Place</Text>
        <Text style={styles.heroTitle}>
          Encouraging words for your daily walk.
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

export default AuthCard;
