import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import {useAppContext} from '../context/AppContext';
import {useTheme} from '../context/ThemeContext';
import {colors} from '../theme/colors';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    primary: colors.primary,
    text: colors.text,
    border: colors.border,
  },
};

function AppNavigator() {
  const {currentUser, isInitialising} = useAppContext();
  const {colors: themeColors} = useTheme();

  return (
    <NavigationContainer theme={navigationTheme}>
      {isInitialising ? (
        <View style={[styles.loader, {backgroundColor: themeColors.background}]}>
          <ActivityIndicator color={themeColors.primaryDark} size="large" />
        </View>
      ) : currentUser ? (
        <MainTabNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default AppNavigator;
