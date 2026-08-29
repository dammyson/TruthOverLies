import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../context/ThemeContext';

function CloseButton({onPress, hitSlop = 8}: {onPress: () => void; hitSlop?: number}) {
  const {colors, isDark} = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Close"
      hitSlop={hitSlop}
      style={({pressed}) => [
        styles.btn,
        !isLiquidGlassSupported && {
          backgroundColor: colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        pressed && {opacity: 0.6},
      ]}>
      {isLiquidGlassSupported && (
        <LiquidGlassView
          style={StyleSheet.absoluteFill}
          effect="regular"
          colorScheme={isDark ? 'dark' : 'light'}
        />
      )}
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path
          d="M18 6L6 18M6 6l12 12"
          stroke={colors.text}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default CloseButton;
