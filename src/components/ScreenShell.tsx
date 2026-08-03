import React, {ReactNode} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import {colors} from '../theme/colors';

type ScreenShellProps = {
  children: ReactNode;
  scrollable?: boolean;
  keyboardAware?: boolean;
};

function ScreenShell({children, scrollable = true, keyboardAware = false}: ScreenShellProps) {
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
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
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

const styles = StyleSheet.create({
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
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: colors.background,
  },
});

export default ScreenShell;