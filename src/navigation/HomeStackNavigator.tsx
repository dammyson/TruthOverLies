import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/main/HomeScreen';
import ResultsScreen from '../screens/main/ResultsScreen';
import {useTheme} from '../context/ThemeContext';

export type HomeStackParamList = {
  HomeMain: undefined;
  Results: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  const {colors} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen component={HomeScreen} name="HomeMain" />
      <Stack.Screen
        component={ResultsScreen}
        name="Results"
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackTitle: '',
          headerTintColor: colors.primaryDark,
          headerTransparent: true,
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;
