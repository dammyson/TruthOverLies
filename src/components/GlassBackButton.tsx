import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';
import Svg, {Path} from 'react-native-svg';

import {useTheme} from '../context/ThemeContext';

type Props = {
  onPress: () => void;
};

function GlassBackButton({onPress}: Props) {
  const {colors, isDark} = useTheme();

  return (
    <Pressable
      accessibilityLabel="Go back"
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.button, !isLiquidGlassSupported && {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }]}>
      {isLiquidGlassSupported && (
        <LiquidGlassView
          style={StyleSheet.absoluteFill}
          effect="clear"
          colorScheme={isDark ? 'dark' : 'light'}
        />
      )}
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
          d="M15 18l-6-6 6-6"
          stroke={colors.primaryDark}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default GlassBackButton;
