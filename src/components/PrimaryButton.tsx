import React, {useMemo} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text} from 'react-native';

import {useTheme} from '../context/ThemeContext';
import {typography} from '../theme/typography';
import {radius, spacing} from '../theme/spacing';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

function PrimaryButton({label, onPress, disabled = false, loading = false}: PrimaryButtonProps) {
  const {colors} = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        button: {
          marginTop: spacing.md,
          marginBottom: spacing.sm,
          minHeight: 50,
          borderRadius: radius.lg,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.shadow,
          shadowOpacity: 0.18,
          shadowRadius: 12,
          shadowOffset: {width: 0, height: 6},
          elevation: 4,
        },
        buttonDisabled: {opacity: 0.75},
        label: {
          ...typography.headline,
          color: colors.white,
        },
      }),
    [colors],
  );

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.button, (disabled || loading) && styles.buttonDisabled]}>
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

export default PrimaryButton;
