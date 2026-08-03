import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';

import HomeStackNavigator from './HomeStackNavigator';
import ProfileScreen from '../screens/main/ProfileScreen';
import SavedScreen from '../screens/main/SavedScreen';
import {colors} from '../theme/colors';

export type MainTabParamList = {
  Home: undefined;
  Saved: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.tabIdle,
        tabBarStyle: {
          backgroundColor: colors.surfaceStrong,
          borderTopColor: colors.border,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarIcon: ({color, focused}) => (
          <Text style={{fontSize: 16, color, opacity: focused ? 1 : 0.88}}>
            {route.name === 'Home' ? '◉' : route.name === 'Saved' ? '◌' : '◎'}
          </Text>
        ),
      })}>
      <Tab.Screen component={HomeStackNavigator} name="Home" />
      <Tab.Screen component={SavedScreen} name="Saved" />
      <Tab.Screen component={ProfileScreen} name="Profile" />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;