import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

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
      <Text style={[styles.arrow, {color: colors.primaryDark}]}>‹</Text>
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
  arrow: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '300',
  },
});

export default GlassBackButton;
