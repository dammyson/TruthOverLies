import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Keyboard, Platform, Pressable, StyleSheet, Text} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';

import {useTheme} from '../context/ThemeContext';
import {radius, spacing} from '../theme/spacing';

type KeyboardDismissButtonProps = {
  /** Distance from the bottom of the parent container (which sits on top of the keyboard). */
  bottom?: number;
  /** Extra work to run on dismiss, e.g. blurring a WebView-based rich text editor. */
  onDismiss?: () => void;
};

function KeyboardDownIcon({color}: {color: string}) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="3" width="20" height="12" rx="2" stroke={color} strokeWidth="1.8" />
      <Path
        d="M6 7h.01M10 7h.01M14 7h.01M18 7h.01M8 11h8"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Path
        d="M9 18l3 3 3-3"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function KeyboardDismissButton({bottom = spacing.sm, onDismiss}: KeyboardDismissButtonProps) {
  const {colors, isDark} = useTheme();
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          position: 'absolute',
          right: spacing.md,
          zIndex: 10,
        },
        pill: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: spacing.md - 2,
          paddingVertical: spacing.sm,
          borderRadius: radius.full,
          backgroundColor: isDark ? colors.surfaceStrong : colors.surface,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          shadowOpacity: 0.18,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 4},
          elevation: 6,
        },
        label: {
          fontSize: 13,
          fontWeight: '600',
          color: colors.primaryDark,
        },
      }),
    [colors, isDark],
  );

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.wrap, {bottom, opacity}]}>
      <Pressable
        accessibilityLabel="Hide keyboard"
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => {
          onDismiss?.();
          Keyboard.dismiss();
        }}
        style={({pressed}) => [styles.pill, pressed && {opacity: 0.7}]}>
        <KeyboardDownIcon color={colors.primaryDark} />
        <Text style={styles.label}>Done</Text>
      </Pressable>
    </Animated.View>
  );
}

export default KeyboardDismissButton;
