import React, {ReactNode, useMemo} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import {useTheme} from '../context/ThemeContext';

type ScreenShellProps = {
  children: ReactNode;
  scrollable?: boolean;
  keyboardAware?: boolean;
};

function ScreenShell({children, scrollable = true, keyboardAware = false}: ScreenShellProps) {
  const {colors, isDark} = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
          backgroundColor: colors.background,
        },
        flex: {
          flex: 1,
        },
        scrollContent: {
          flexGrow: 1,
        },
        canvas: {
          flexGrow: 1,
          paddingHorizontal: 18,
          paddingVertical: 18,
          backgroundColor: colors.background,
        },
      }),
    [colors],
  );

  const content = scrollable ? (
    <ScrollView
      bounces={false}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled">
      <View style={styles.canvas}>{children}</View>
    </ScrollView>
  ) : (
    <View style={[styles.canvas, styles.flex]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      {keyboardAware ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}>
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

export default ScreenShell;
