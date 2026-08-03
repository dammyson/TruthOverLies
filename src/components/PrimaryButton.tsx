import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text} from 'react-native';

import {colors} from '../theme/colors';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

function PrimaryButton({label, onPress, disabled = false, loading = false}: PrimaryButtonProps) {
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

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    marginBottom: 22,
    minHeight: 62,
    borderRadius: 18,
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
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: colors.white,
  },
});

export default PrimaryButton;