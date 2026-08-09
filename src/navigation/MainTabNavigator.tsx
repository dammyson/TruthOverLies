import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

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
  const {colors, isDark} = useTheme();

  const activeTint = isLiquidGlassSupported ? colors.primaryDark : colors.white;
  const inactiveTint = isLiquidGlassSupported ? colors.tabIdle : 'rgba(255,255,255,0.45)';

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: {
          backgroundColor: isLiquidGlassSupported ? 'transparent' : colors.primaryDark,
          borderTopWidth: 0,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarBackground: isLiquidGlassSupported
          ? () => (
              <LiquidGlassView
                style={StyleSheet.absoluteFill}
                effect="regular"
                colorScheme={isDark ? 'dark' : 'light'}
              />
            )
          : undefined,
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
