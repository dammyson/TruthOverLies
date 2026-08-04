import React, {useMemo} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text} from 'react-native';

import {useTheme} from '../context/ThemeContext';

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
          marginTop: 14,
          marginBottom: 12,
          minHeight: 52,
          borderRadius: 16,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#b06f3c',
          shadowOpacity: 0.18,
          shadowRadius: 12,
          shadowOffset: {width: 0, height: 8},
          elevation: 4,
        },
        buttonDisabled: {
          opacity: 0.82,
        },
        label: {
          fontSize: 16,
          lineHeight: 22,
          fontWeight: '800',
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
      style={[styles.button, disabled || loading ? styles.buttonDisabled : null]}>
      {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

export default PrimaryButton;
