import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
import {RootStackParamList} from '../../navigation/RootNavigator';

type SettingsRow = {
  key: string;
  icon: string;
  label: string;
  description: string;
};

const ROWS: SettingsRow[] = [
  {key: 'appearance', icon: '◐', label: 'Appearance', description: 'Theme & display'},
  {key: 'about',      icon: '✦', label: 'About',      description: 'TruthOverLies v1.0'},
  {key: 'share',      icon: '↑', label: 'Share',      description: 'Invite a friend'},
  {key: 'privacy',    icon: '⊙', label: 'Privacy',    description: 'Terms & policy'},
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
        eyebrow: {
          ...typography.eyebrow,
          color: colors.primaryDark,
          marginBottom: spacing.xs,
        },
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
          minHeight: 60,
          gap: spacing.sm + 4,
        },
        iconWrapper: {
          width: 36,
          height: 36,
          borderRadius: radius.sm,
          backgroundColor: colors.backgroundAccent,
          alignItems: 'center',
          justifyContent: 'center',
        },
        iconText: {
          ...typography.body,
          color: colors.primaryDark,
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
          ...typography.body,
          color: colors.muted,
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
              <View style={styles.iconWrapper}>
                <Text style={styles.iconText}>{item.icon}</Text>
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
