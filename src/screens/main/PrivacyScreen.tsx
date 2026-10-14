import React, {useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import ScreenShell from '../../components/ScreenShell';
import {PRIVACY_SECTIONS, TERMS_SECTIONS} from '../../constants/legal';
import {useTheme} from '../../context/ThemeContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

type Tab = 'privacy' | 'terms';

const TABS: {key: Tab; label: string}[] = [
  {key: 'privacy', label: 'Privacy Policy'},
  {key: 'terms', label: 'Terms of Use'},
];

function PrivacyScreen() {
  const {colors, isDark} = useTheme();
  const [tab, setTab] = useState<Tab>('privacy');
  const glassScheme = isDark ? 'dark' : 'light';
  const sections = tab === 'privacy' ? PRIVACY_SECTIONS : TERMS_SECTIONS;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        intro: {
          ...typography.subhead,
          color: colors.muted,
          marginBottom: spacing.md,
        },
        segment: {
          flexDirection: 'row',
          padding: 4,
          borderRadius: radius.full,
          marginBottom: spacing.lg,
          backgroundColor: isDark ? colors.surface : colors.backgroundAccentSoft,
        },
        segmentItem: {
          flex: 1,
          minHeight: 38,
          borderRadius: radius.full,
          alignItems: 'center',
          justifyContent: 'center',
        },
        segmentItemActive: {
          backgroundColor: colors.primary,
        },
        segmentText: {
          ...typography.footnote,
          fontWeight: '600',
          color: colors.muted,
        },
        segmentTextActive: {
          color: colors.white,
        },
        card: {
          borderRadius: radius.xxl,
          overflow: 'hidden',
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        cardGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xxl,
        },
        section: {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
        },
        heading: {
          ...typography.body,
          fontWeight: '600',
          color: colors.text,
          marginBottom: spacing.xs,
        },
        body: {
          ...typography.subhead,
          lineHeight: 22,
          color: colors.muted,
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.border,
          marginLeft: spacing.lg,
        },
      }),
    [colors, isDark],
  );

  return (
    <ScreenShell>
      <Text style={styles.intro}>
        Your journey with God is personal. Here's how we look after your information.
      </Text>

      <View accessibilityRole="tablist" style={styles.segment}>
        {TABS.map(item => {
          const active = item.key === tab;
          return (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{selected: active}}
              key={item.key}
              onPress={() => setTab(item.key)}
              style={[styles.segmentItem, active && styles.segmentItemActive]}>
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.card}>
        {isLiquidGlassSupported && (
          <LiquidGlassView style={styles.cardGlass} effect="regular" colorScheme={glassScheme} />
        )}
        {sections.map((section, index) => (
          <View key={section.heading}>
            <View style={styles.section}>
              <Text style={styles.heading}>{section.heading}</Text>
              <Text style={styles.body}>{section.body}</Text>
            </View>
            {index < sections.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

export default PrivacyScreen;
