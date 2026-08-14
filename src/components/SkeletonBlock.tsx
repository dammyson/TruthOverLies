import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View, ViewStyle} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import {useTheme} from '../context/ThemeContext';
import {radius as defaultRadius} from '../theme/spacing';

type Props = {
  height: number;
  width?: number | `${number}%`;
  borderRadius?: number;
  style?: ViewStyle;
};

function SkeletonBlock({height, width = '100%', borderRadius = defaultRadius.sm, style}: Props) {
  const {colors, isDark} = useTheme();
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    if (isLiquidGlassSupported) {
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {toValue: 1, duration: 750, useNativeDriver: true}),
        Animated.timing(pulse, {toValue: 0.35, duration: 750, useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const containerStyle: ViewStyle = {
    width: width as ViewStyle['width'],
    height,
    borderRadius,
    overflow: 'hidden',
  };

  if (isLiquidGlassSupported) {
    return (
      <View style={[containerStyle, style]}>
        <LiquidGlassView
          style={StyleSheet.absoluteFill}
          effect="clear"
          colorScheme={isDark ? 'dark' : 'light'}
        />
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        containerStyle,
        {
          backgroundColor: isDark ? colors.surfaceStrong : colors.border,
          opacity: pulse,
        },
        style,
      ]}
    />
  );
}

export default SkeletonBlock;
