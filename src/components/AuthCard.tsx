import React, {ReactNode, useMemo} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import {useTheme} from '../context/ThemeContext';
import {typography} from '../theme/typography';
import {radius, spacing} from '../theme/spacing';

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
        heroBlock: {marginBottom: spacing.lg},
        logo: {
          width: 52,
          height: 52,
          borderRadius: 12,
          marginBottom: spacing.xs,
        },
        brandName: {
          ...typography.eyebrow,
          color: colors.primaryDark,
          letterSpacing: 1.5,
          marginBottom: spacing.sm,
        },
        heroTitle: {
          fontSize: 30,
          fontWeight: '800',
          color: colors.text,
          maxWidth: 300,
          lineHeight: 36,
        },
        cardWrapper: {
          width: '100%',
          maxWidth: 420,
          alignSelf: 'center',
          borderRadius: radius.xxl,
        },
        glassBackground: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xxl,
        },
        cardFallback: {
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
        cardContent: {
          paddingHorizontal: spacing.md + 4,
          paddingVertical: spacing.md,
        },
        title: {
          ...typography.title2,
          fontWeight: '700',
          color: colors.text,
          marginBottom: spacing.xs,
        },
        subtitle: {
          ...typography.subhead,
          color: colors.muted,
          marginBottom: spacing.md,
        },
      }),
    [colors],
  );

  return (
    <>
      <View style={styles.heroBlock}>
        <Image
          source={require('../assets/tol.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.brandName}>TRUTHOVERLIES</Text>
        <Text style={styles.heroTitle}>Begin Your Journey</Text>
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
