import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';
import Svg, {Circle, Line, Path, Rect} from 'react-native-svg';

import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
import {RootStackParamList} from '../../navigation/RootNavigator';

// ── SF Symbol–style SVG icons ──────────────────────────────────────────────

function IconAppearance() {
  // moon.fill — crescent moon
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="#fff"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function IconAbout() {
  // info.circle — circle with i
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" />
      <Line x1="12" y1="16" x2="12" y2="11" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx="12" cy="7.5" r="1.2" fill="#fff" />
    </Svg>
  );
}

function IconShare() {
  // square.and.arrow.up — iOS share sheet icon
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 6l-4-4-4 4"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="12" y1="2" x2="12" y2="15" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function IconPrivacy() {
  // lock.fill — padlock
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="11" width="14" height="10" rx="2" fill="#fff" />
      <Path
        d="M8 11V7a4 4 0 0 1 8 0v4"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

type SettingsRow = {
  key: string;
  IconComponent: React.ComponentType;
  iconBg: string;
  label: string;
  description: string;
};

const ROWS: SettingsRow[] = [
  {
    key: 'appearance',
    IconComponent: IconAppearance,
    iconBg: '#6B5FA6',
    label: 'Appearance',
    description: 'Theme & display',
  },
  {
    key: 'about',
    iconBg: '#4A7FC1',
    IconComponent: IconAbout,
    label: 'About',
    description: 'TruthOverLies v1.0',
  },
  {
    key: 'share',
    iconBg: '#3D9A6A',
    IconComponent: IconShare,
    label: 'Share',
    description: 'Invite a friend',
  },
  {
    key: 'privacy',
    iconBg: '#B07040',
    IconComponent: IconPrivacy,
    label: 'Privacy',
    description: 'Terms & policy',
  },
];

function MoreScreen() {
  const {logout} = useAppContext();
  const {colors, isDark} = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const glassScheme = isDark ? 'dark' : 'light';

  const onRowPress = (key: string) => {
    if (key === 'appearance') {
      navigation.navigate('Appearance');
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: {marginBottom: spacing.md},
        title: {
          ...typography.largeTitle,
          fontWeight: '700',
          color: colors.text,
        },
        listWrapper: {
          borderRadius: radius.xxl,
          marginBottom: spacing.md,
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        listGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xxl,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 4,
          minHeight: 62,
          gap: spacing.sm + 4,
        },
        iconWrapper: {
          width: 36,
          height: 36,
          borderRadius: 9,
          alignItems: 'center',
          justifyContent: 'center',
        },
        rowText: {flex: 1},
        rowLabel: {
          ...typography.subhead,
          fontWeight: '600',
          color: colors.text,
        },
        rowDesc: {
          ...typography.caption1,
          color: colors.muted,
          marginTop: 1,
        },
        chevron: {
          fontSize: 18,
          color: colors.muted,
          lineHeight: 22,
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.border,
          marginLeft: spacing.md + 36 + spacing.sm + 4,
        },
        signOutWrapper: {
          borderRadius: radius.xxl,
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        signOutGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xxl,
        },
        signOutRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 54,
        },
        signOutText: {
          ...typography.headline,
          fontWeight: '600',
          color: colors.errorText,
        },
      }),
    [colors],
  );

  return (
    <ScreenShell>
      <View style={styles.header}>
        <Text style={styles.title}>More</Text>
      </View>

      {/* Settings list */}
      <View style={styles.listWrapper}>
        {isLiquidGlassSupported && (
          <LiquidGlassView style={styles.listGlass} effect="regular" colorScheme={glassScheme} />
        )}
        {ROWS.map((item, index) => (
          <View key={item.key}>
            <Pressable
              accessibilityRole="button"
              onPress={() => onRowPress(item.key)}
              style={({pressed}) => [styles.row, pressed && {opacity: 0.6}]}>
              <View style={[styles.iconWrapper, {backgroundColor: item.iconBg}]}>
                <item.IconComponent />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowDesc}>{item.description}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
            {index < ROWS.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Sign out */}
      <Pressable
        accessibilityRole="button"
        onPress={logout}
        style={({pressed}) => [styles.signOutWrapper, pressed && {opacity: 0.7}]}>
        {isLiquidGlassSupported && (
          <LiquidGlassView style={styles.signOutGlass} effect="regular" colorScheme={glassScheme} />
        )}
        <View style={styles.signOutRow}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </View>
      </Pressable>
    </ScreenShell>
  );
}

export default MoreScreen;
