import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {colors} from '../theme/colors';
import {AuthMessageTone} from '../types/app';

type MessageBannerProps = {
  message: string;
  tone: AuthMessageTone;
};

function MessageBanner({message, tone}: MessageBannerProps) {
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

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
  },
  containerError: {
    backgroundColor: colors.errorBg,
  },
  containerSuccess: {
    backgroundColor: colors.successBg,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  textError: {
    color: colors.errorText,
  },
  textSuccess: {
    color: colors.successText,
  },
});

export default MessageBanner;