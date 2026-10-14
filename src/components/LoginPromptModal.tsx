import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Easing, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle, Path} from 'react-native-svg';

import {useTheme} from '../context/ThemeContext';
import {radius, spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

type LoginPromptModalProps = {
  visible: boolean;
  onClose: () => void;
  onLogin: () => void;
  title?: string;
  message?: string;
};

function UserLockIcon({color}: {color: string}) {
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
      <Path
        d="M4 21c0-4 3.6-7 8-7s8 3 8 7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function LoginPromptModal({
  visible,
  onClose,
  onLogin,
  title = 'Log in to continue',
  message = 'Create a free account or log in to personalise your profile and keep your journey in sync across devices.',
}: LoginPromptModalProps) {
  const {colors, isDark} = useTheme();
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0.9);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(scale, {toValue: 1, friction: 7, tension: 80, useNativeDriver: true}),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scale, opacity]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          flex: 1,
          backgroundColor: 'rgba(20,14,10,0.55)',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: spacing.lg,
        },
        card: {
          width: '100%',
          maxWidth: 360,
          backgroundColor: colors.surface,
          borderRadius: radius.xxl,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.lg,
          alignItems: 'center',
          shadowColor: colors.shadow,
          shadowOpacity: 0.25,
          shadowRadius: 24,
          shadowOffset: {width: 0, height: 12},
          elevation: 12,
        },
        iconRing: {
          width: 72,
          height: 72,
          borderRadius: 36,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.md,
          backgroundColor: isDark ? colors.surfaceSoft : colors.backgroundAccentSoft,
        },
        iconInner: {
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        title: {
          fontSize: 20,
          fontWeight: '700',
          color: colors.text,
          textAlign: 'center',
          marginBottom: spacing.sm,
        },
        message: {
          fontSize: 14,
          lineHeight: 21,
          color: colors.muted,
          textAlign: 'center',
          marginBottom: spacing.lg,
        },
        primaryButton: {
          width: '100%',
          minHeight: 50,
          borderRadius: radius.lg,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        primaryText: {
          ...typography.headline,
          color: colors.white,
        },
        secondaryButton: {
          width: '100%',
          minHeight: 46,
          marginTop: spacing.sm,
          borderRadius: radius.lg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        secondaryText: {
          fontSize: 15,
          fontWeight: '600',
          color: colors.muted,
        },
      }),
    [colors, isDark],
  );

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <Pressable onPress={onClose} style={styles.backdrop}>
        <Animated.View style={{width: '100%', alignItems: 'center', opacity, transform: [{scale}]}}>
          {/* Inner Pressable stops taps on the card from closing the modal */}
          <Pressable onPress={() => {}} style={styles.card}>
            <View style={styles.iconRing}>
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                end={{x: 1, y: 1}}
                start={{x: 0, y: 0}}
                style={styles.iconInner}>
                <UserLockIcon color={colors.white} />
              </LinearGradient>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={onLogin}
              style={({pressed}) => [styles.primaryButton, pressed && {opacity: 0.85}]}>
              <Text style={styles.primaryText}>Log In or Sign Up</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({pressed}) => [styles.secondaryButton, pressed && {opacity: 0.6}]}>
              <Text style={styles.secondaryText}>Maybe later</Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export default LoginPromptModal;
