import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainTabNavigator from './MainTabNavigator';
import SavedDetailScreen from '../screens/main/SavedDetailScreen';
import {DevotionCard} from '../types/app';
import {useTheme} from '../context/ThemeContext';

export type RootStackParamList = {
  MainTabs: undefined;
  SavedDetail: {card: DevotionCard};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const {colors} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{title: ''}} />
      <Stack.Screen
        name="SavedDetail"
        component={SavedDetailScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackTitle: '',
          headerTintColor: '#FFFDF5',
          headerTransparent: true,
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default RootNavigator;
