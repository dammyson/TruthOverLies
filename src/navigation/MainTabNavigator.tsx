import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeStackNavigator from './HomeStackNavigator';
import ProfileScreen from '../screens/main/ProfileScreen';
import SavedScreen from '../screens/main/SavedScreen';
import {useTheme} from '../context/ThemeContext';
import {HomeIcon, SavedIcon, ProfileIcon} from '../components/TabIcons';

export type MainTabParamList = {
  Home: undefined;
  Saved: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  const {colors} = useTheme();

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
        tabBarIcon: ({color}) => {
          if (route.name === 'Home') return <HomeIcon color={color} size={22} />;
          if (route.name === 'Saved') return <SavedIcon color={color} size={22} />;
          return <ProfileIcon color={color} size={22} />;
        },
      })}>
      <Tab.Screen component={HomeStackNavigator} name="Home" />
      <Tab.Screen component={SavedScreen} name="Saved" />
      <Tab.Screen component={ProfileScreen} name="Profile" />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
