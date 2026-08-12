import React, {useMemo} from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';

import {useTheme} from '../context/ThemeContext';
import {typography} from '../theme/typography';
import {radius, spacing} from '../theme/spacing';

type FormFieldProps = {
  label: string;
} & Pick<
  TextInputProps,
  | 'autoCapitalize'
  | 'keyboardType'
  | 'onChangeText'
  | 'placeholder'
  | 'secureTextEntry'
  | 'value'
>;

function FormField({label, ...inputProps}: FormFieldProps) {
  const {colors} = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        fieldGroup: {marginBottom: spacing.sm + 4},
        fieldLabel: {
          ...typography.footnote,
          fontWeight: '700',
          color: colors.primaryDark,
          marginBottom: spacing.xs,
        },
        input: {
          height: 44,
          borderRadius: radius.sm,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surfaceSoft,
          paddingHorizontal: spacing.md,
          ...typography.body,
          color: colors.text,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.placeholder}
        style={styles.input}
        {...inputProps}
      />
    </View>
  );
}

export default FormField;
