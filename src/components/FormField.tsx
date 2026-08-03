import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';

import {colors} from '../theme/colors';

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

const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.primaryDark,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    height: 62,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.text,
  },
});

export default FormField;