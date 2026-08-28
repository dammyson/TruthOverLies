import React from 'react';
import {Pressable, StyleSheet, ViewStyle} from 'react-native';
import Svg, {Line, Path} from 'react-native-svg';

type Props = {
  onPress: () => void;
  size?: number;
  color?: string;
  style?: ViewStyle;
  hitSlop?: number;
};

function ShareIconButton({
  onPress,
  size = 18,
  color = '#4A2F24',
  style,
  hitSlop = 8,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Share"
      onPress={onPress}
      hitSlop={hitSlop}
      style={({pressed}) => [styles.btn, style, pressed && {opacity: 0.55}]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16 6l-4-4-4 4"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Line
          x1="12"
          y1="2"
          x2="12"
          y2="15"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ShareIconButton;
