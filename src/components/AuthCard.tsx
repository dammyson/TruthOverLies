import React, {ReactNode, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import {useTheme} from '../context/ThemeContext';

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

function AuthCard({title, subtitle, children}: AuthCardProps) {
  const {colors, isDark} = useTheme();

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
        cardWrapper: {
          width: '100%',
          maxWidth: 420,
          alignSelf: 'center',
          borderRadius: 28,
        },
        glassBackground: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 28,
        },
        cardFallback: {
          borderRadius: 28,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
        cardContent: {
          paddingHorizontal: 20,
          paddingVertical: 16,
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
        <Text style={styles.heroTitle}>Encouraging words for your daily walk.</Text>
      </View>

      <View style={[styles.cardWrapper, !isLiquidGlassSupported && styles.cardFallback]}>
        {isLiquidGlassSupported && (
          <LiquidGlassView
            style={styles.glassBackground}
            effect="regular"
            colorScheme={isDark ? 'dark' : 'light'}
          />
        )}
        <View style={styles.cardContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {children}
        </View>
      </View>
    </>
  );
}

export default AuthCard;
