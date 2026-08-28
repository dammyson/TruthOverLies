import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {ShareTheme} from '../../theme/feelingThemes';
import {ShareCardPayload} from '../../types/share';
import {ShareContent} from './shareDesignTypes';

type ScaleProps = {s: number};

const LIGHT_TEXT_SHADOW = {
  textShadowColor: 'rgba(0,0,0,0.35)',
  textShadowOffset: {width: 0, height: 2},
  textShadowRadius: 6,
};

function lightText(extra?: object) {
  return {...LIGHT_TEXT_SHADOW, ...extra};
}

export function ShareFeelingsRow({
  feelings,
  theme,
  s,
  variant = 'light',
  compact = false,
  centered = false,
}: ScaleProps & {
  feelings: string[];
  theme?: ShareTheme;
  variant?: 'light' | 'dark';
  compact?: boolean;
  centered?: boolean;
}) {
  if (feelings.length === 0) return null;

  const light = variant === 'light';
  const accent = theme?.gradient[1] ?? (light ? '#FFFDF5' : '#4A2F24');
  const styles = StyleSheet.create({
    section: {marginTop: compact ? 12 * s : 24 * s},
    label: {
      fontSize: compact ? 18 * s : 21 * s,
      fontWeight: '800',
      letterSpacing: 2.4,
      color: light ? 'rgba(255,253,245,0.72)' : 'rgba(74,47,36,0.55)',
      marginBottom: 12 * s,
      textAlign: centered ? 'center' : 'left',
      ...(light ? LIGHT_TEXT_SHADOW : {}),
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10 * s,
      justifyContent: centered ? 'center' : 'flex-start',
    },
    pill: {
      paddingHorizontal: 20 * s,
      paddingVertical: 10 * s,
      borderRadius: 999,
      backgroundColor: light ? 'rgba(255,255,255,0.28)' : `${accent}22`,
      borderWidth: 1.5 * s,
      borderColor: light ? 'rgba(255,255,255,0.38)' : accent,
    },
    text: {
      fontSize: compact ? 22 * s : 24 * s,
      fontWeight: '800',
      color: light ? '#FFFDF5' : '#4A2F24',
      ...(light ? LIGHT_TEXT_SHADOW : {}),
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.label}>HOW I{"'"}M FEELING</Text>
      <View style={styles.row}>
        {feelings.map(feeling => (
          <View key={feeling} style={styles.pill}>
            <Text style={styles.text}>{feeling}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function ShareFooter({
  s,
  variant = 'light',
}: ScaleProps & {variant?: 'light' | 'dark'}) {
  const light = variant === 'light';
  const styles = StyleSheet.create({
    footer: {
      borderTopWidth: 1 * s,
      borderTopColor: light ? 'rgba(255,255,255,0.2)' : 'rgba(74,47,36,0.12)',
      paddingTop: 28 * s,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    label: {
      fontSize: 25 * s,
      fontWeight: '700',
      color: light ? 'rgba(255,253,245,0.65)' : 'rgba(74,47,36,0.5)',
      ...(light ? LIGHT_TEXT_SHADOW : {}),
    },
    brand: {
      fontSize: 28 * s,
      fontWeight: '900',
      color: light ? '#FFFDF5' : '#4A2F24',
      ...(light ? LIGHT_TEXT_SHADOW : {}),
    },
  });

  return (
    <View style={styles.footer}>
      <Text style={styles.label}>Shared from</Text>
      <Text style={styles.brand}>TruthOverLies</Text>
    </View>
  );
}

export function ShareDevotionBody({
  payload,
  s,
  variant = 'light',
}: ScaleProps & {payload: ShareCardPayload; variant?: 'light' | 'dark'}) {
  if (payload.kind !== 'devotion') return null;
  const light = variant === 'light';

  const styles = StyleSheet.create({
    title: {
      fontSize: 60 * s,
      fontWeight: '900',
      color: light ? '#FFFDF5' : '#1E1C18',
      lineHeight: 72 * s,
      marginBottom: 28 * s,
      ...(light ? lightText() : {}),
    },
    encouragement: {
      fontSize: 34 * s,
      fontWeight: '700',
      color: light ? 'rgba(255,253,245,0.95)' : 'rgba(30,28,24,0.82)',
      lineHeight: 50 * s,
      marginBottom: 40 * s,
      ...(light ? lightText({textShadowRadius: 4}) : {}),
    },
  });

  return (
    <>
      <Text style={styles.title}>{payload.title}</Text>
      <Text style={styles.encouragement} numberOfLines={4}>
        {payload.encouragement}
      </Text>
    </>
  );
}

export function ShareVerseBlock({
  payload,
  content,
  s,
  variant = 'light',
  centered = false,
  large = false,
}: ScaleProps & {
  payload: ShareCardPayload;
  content: ShareContent;
  variant?: 'light' | 'dark';
  centered?: boolean;
  large?: boolean;
}) {
  const light = variant === 'light';
  const verseSize = large ? 54 * s : payload.kind === 'scripture' ? 48 * s : 42 * s;
  const verseLineHeight = large ? 72 * s : payload.kind === 'scripture' ? 64 * s : 58 * s;

  const styles = StyleSheet.create({
    quote: {
      fontSize: 80 * s,
      lineHeight: 68 * s,
      color: light ? 'rgba(255,253,245,0.45)' : 'rgba(74,47,36,0.22)',
      fontWeight: '900',
      marginBottom: 8 * s,
      textAlign: centered ? 'center' : 'left',
    },
    verse: {
      fontSize: verseSize,
      fontWeight: '700',
      fontStyle: 'italic',
      color: light ? '#FFFDF5' : '#1E1C18',
      lineHeight: verseLineHeight,
      textAlign: centered ? 'center' : 'left',
      ...(light ? lightText() : {}),
    },
    reference: {
      marginTop: 32 * s,
      fontSize: 32 * s,
      fontWeight: '900',
      color: light ? 'rgba(255,253,245,0.92)' : '#4A2F24',
      letterSpacing: 1.4,
      textAlign: centered ? 'center' : 'left',
      ...(light ? lightText({textShadowRadius: 4}) : {}),
    },
    moment: {
      marginTop: 28 * s,
      paddingLeft: 20 * s,
      borderLeftWidth: 4 * s,
      borderLeftColor: light ? 'rgba(255,253,245,0.45)' : 'rgba(74,47,36,0.3)',
    },
    momentLabel: {
      fontSize: 21 * s,
      fontWeight: '900',
      letterSpacing: 2,
      color: light ? 'rgba(255,253,245,0.7)' : 'rgba(74,47,36,0.5)',
      marginBottom: 8 * s,
    },
    momentText: {
      fontSize: 28 * s,
      fontWeight: '600',
      fontStyle: 'italic',
      color: light ? 'rgba(255,253,245,0.85)' : 'rgba(30,28,24,0.72)',
      lineHeight: 40 * s,
    },
  });

  return (
    <>
      <Text style={styles.quote}>❝</Text>
      <Text style={styles.verse}>{payload.verse}</Text>
      <Text style={styles.reference}>{content.referenceLine}</Text>
      {content.hasMoment && payload.kind === 'scripture' && payload.moment ? (
        <View style={styles.moment}>
          <Text style={styles.momentLabel}>REFLECTION</Text>
          <Text style={styles.momentText} numberOfLines={3}>
            {payload.moment}
          </Text>
        </View>
      ) : null}
    </>
  );
}

export function ShareTopBadge({
  content,
  themeLabel: _themeLabel,
  s,
  variant = 'light',
}: ScaleProps & {
  content: ShareContent;
  themeLabel: string;
  variant?: 'light' | 'dark';
}) {
  if (content.hasDevotion) {
    return null;
  }

  const light = variant === 'light';
  const styles = StyleSheet.create({
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 26 * s,
      paddingVertical: 12 * s,
      borderRadius: 999,
      backgroundColor: light ? 'rgba(255,255,255,0.24)' : 'rgba(74,47,36,0.1)',
      borderWidth: 1.5 * s,
      borderColor: light ? 'rgba(255,255,255,0.32)' : 'rgba(74,47,36,0.15)',
    },
    badgeText: {
      fontSize: 26 * s,
      fontWeight: '900',
      letterSpacing: 2.2,
      color: light ? '#FFFDF5' : '#4A2F24',
      ...(light ? LIGHT_TEXT_SHADOW : {}),
    },
  });

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{content.badgeLabel}</Text>
    </View>
  );
}
