import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useTheme} from '../context/ThemeContext';
import {typography} from '../theme/typography';
import {radius, spacing} from '../theme/spacing';
import {AuthMessageTone} from '../types/app';

type MessageBannerProps = {
  message: string;
  tone: AuthMessageTone;
};

function MessageBanner({message, tone}: MessageBannerProps) {
  const {colors} = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          borderRadius: radius.sm,
          paddingHorizontal: spacing.sm + 4,
          paddingVertical: spacing.sm,
          marginBottom: spacing.sm + 4,
        },
        containerError: {backgroundColor: colors.errorBg},
        containerSuccess: {backgroundColor: colors.successBg},
        text: {
          ...typography.footnote,
          fontWeight: '600',
        },
        textError: {color: colors.errorText},
        textSuccess: {color: colors.successText},
      }),
    [colors],
  );

  if (!message) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        tone === 'error' ? styles.containerError : styles.containerSuccess,
      ]}>
      <Text style={[styles.text, tone === 'error' ? styles.textError : styles.textSuccess]}>
        {message}
      </Text>
    </View>
  );
}

export default MessageBanner;
