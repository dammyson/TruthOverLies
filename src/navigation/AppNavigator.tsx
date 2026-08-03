import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import {useAppContext} from '../context/AppContext';
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
  const {currentUser} = useAppContext();

  return (
    <NavigationContainer theme={navigationTheme}>
      {currentUser ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default AppNavigator;