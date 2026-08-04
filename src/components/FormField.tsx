import React, {useMemo} from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';

import {useTheme} from '../context/ThemeContext';

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
        fieldGroup: {
          marginBottom: 12,
        },
        fieldLabel: {
          fontSize: 13,
          lineHeight: 18,
          color: colors.primaryDark,
          fontWeight: '700',
          marginBottom: 6,
        },
        input: {
          height: 50,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surfaceSoft,
          paddingHorizontal: 16,
          fontSize: 15,
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
