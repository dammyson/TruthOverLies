import React, {useMemo} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import ScreenShell from '../../components/ScreenShell';
import {APP_INFO} from '../../constants/appInfo';
import {useTheme} from '../../context/ThemeContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

const FEATURES: {title: string; description: string}[] = [
  {
    title: 'Devotions for how you feel',
    description: 'Pick your feelings and receive scripture-based devotions that speak to them.',
  },
  {
    title: 'Read the Bible',
    description: 'Browse books and chapters, and save the verses that matter to you.',
  },
  {
    title: 'Journal & sermon notes',
    description: "Write what's on your heart and keep notes from every sermon in one place.",
  },
  {
    title: 'Verse of the Day widget',
    description: 'Keep a daily verse on your Home Screen.',
  },
];

function AboutScreen() {
  const {colors, isDark} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';
  const year = new Date().getFullYear();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        hero: {
          alignItems: 'center',
          marginTop: spacing.md,
          marginBottom: spacing.lg,
        },
        logoRing: {
          width: 104,
          height: 104,
          borderRadius: 30,
          padding: 3,
          marginBottom: spacing.md,
          shadowColor: colors.shadow,
          shadowOpacity: 0.2,
          shadowRadius: 16,
          shadowOffset: {width: 0, height: 8},
          elevation: 6,
        },
        logoInner: {
          flex: 1,
          borderRadius: 27,
          backgroundColor: colors.surfaceStrong,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        logo: {width: 72, height: 72},
        appName: {
          ...typography.largeTitle,
          fontWeight: '700',
          color: colors.text,
          textAlign: 'center',
        },
        versionPill: {
          marginTop: spacing.sm,
          paddingHorizontal: spacing.md - 4,
          paddingVertical: spacing.xs,
          borderRadius: radius.full,
          backgroundColor: isDark ? colors.surface : colors.backgroundAccentSoft,
        },
        versionText: {
          ...typography.footnote,
          fontWeight: '600',
          color: colors.primaryDark,
        },
        tagline: {
          ...typography.subhead,
          color: colors.muted,
          textAlign: 'center',
          marginTop: spacing.md,
          paddingHorizontal: spacing.md,
        },
        sectionLabel: {
          ...typography.eyebrow,
          color: colors.primaryDark,
          marginBottom: spacing.sm,
          marginLeft: spacing.xs,
        },
        card: {
          borderRadius: radius.xxl,
          marginBottom: spacing.lg,
          overflow: 'hidden',
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        cardGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xxl,
        },
        featureRow: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          gap: spacing.md,
        },
        featureDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          marginTop: 7,
          backgroundColor: colors.primary,
        },
        featureText: {flex: 1},
        featureTitle: {
          ...typography.body,
          fontWeight: '600',
          color: colors.text,
        },
        featureDesc: {
          ...typography.footnote,
          color: colors.muted,
          marginTop: 2,
        },
        infoRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: spacing.lg,
          minHeight: 52,
        },
        infoLabel: {
          ...typography.body,
          color: colors.text,
        },
        infoValue: {
          ...typography.body,
          color: colors.muted,
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.border,
          marginLeft: spacing.lg,
        },
        footer: {
          ...typography.footnote,
          color: colors.muted,
          textAlign: 'center',
          marginTop: spacing.sm,
        },
      }),
    [colors, isDark],
  );

  const renderGlass = () =>
    isLiquidGlassSupported ? (
      <LiquidGlassView style={styles.cardGlass} effect="regular" colorScheme={glassScheme} />
    ) : null;

  return (
    <ScreenShell>
      <View style={styles.hero}>
        <LinearGradient
          colors={[colors.primary, colors.backgroundAccent]}
          end={{x: 1, y: 1}}
          start={{x: 0, y: 0}}
          style={styles.logoRing}>
          <View style={styles.logoInner}>
            <Image resizeMode="contain" source={require('../../assets/tol.png')} style={styles.logo} />
          </View>
        </LinearGradient>
        <Text style={styles.appName}>{APP_INFO.name}</Text>
        <View style={styles.versionPill}>
          <Text style={styles.versionText}>Version {APP_INFO.version}</Text>
        </View>
        <Text style={styles.tagline}>
          A quiet place to meet God daily — through His Word, prayerful reflection, and devotions
          for whatever you're feeling.
        </Text>
      </View>

      <Text style={styles.sectionLabel}>What's inside</Text>
      <View style={styles.card}>
        {renderGlass()}
        {FEATURES.map((feature, index) => (
          <View key={feature.title}>
            <View style={styles.featureRow}>
              <View style={styles.featureDot} />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.description}</Text>
              </View>
            </View>
            {index < FEATURES.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      <Text style={styles.sectionLabel}>App info</Text>
      <View style={styles.card}>
        {renderGlass()}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>{APP_INFO.version}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Build</Text>
          <Text style={styles.infoValue}>{APP_INFO.build}</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        © {year} {APP_INFO.name}. Made with love and prayer.
      </Text>
    </ScreenShell>
  );
}

export default AboutScreen;
