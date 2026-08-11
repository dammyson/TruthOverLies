import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import ScreenShell from '../../components/ScreenShell';
import {useTheme} from '../../context/ThemeContext';

function MoreScreen() {
  const {colors} = useTheme();

  return (
    <ScreenShell>
      <View style={styles.center}>
        <Text style={[styles.title, {color: colors.text}]}>More</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
});

export default MoreScreen;
