import React, {useState} from 'react';
import TabView, {SceneMap} from 'react-native-bottom-tabs';

import HomeStackNavigator from './HomeStackNavigator';
import BibleHomeScreen from '../screens/bible/BibleHomeScreen';
import MoreScreen from '../screens/main/MoreScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SavedScreen from '../screens/main/SavedScreen';
import {useTheme} from '../context/ThemeContext';

const renderScene = SceneMap({
  home: HomeStackNavigator,
  saved: SavedScreen,
  bible: BibleHomeScreen,
  profile: ProfileScreen,
  more: MoreScreen,
});

const routes = [
  {
    key: 'home',
    title: 'Home',
    focusedIcon: {sfSymbol: 'house.fill'},
    unfocusedIcon: {sfSymbol: 'house'},
  },
  {
    key: 'saved',
    title: 'Saved',
    focusedIcon: {sfSymbol: 'bookmark.fill'},
    unfocusedIcon: {sfSymbol: 'bookmark'},
  },
  {
    key: 'bible',
    title: 'Bible',
    focusedIcon: {sfSymbol: 'book.fill'},
    unfocusedIcon: {sfSymbol: 'book'},
  },
  {
    key: 'profile',
    title: 'You',
    focusedIcon: {sfSymbol: 'person.fill'},
    unfocusedIcon: {sfSymbol: 'person'},
  },
  {
    key: 'more',
    title: 'More',
    focusedIcon: {sfSymbol: 'line.3.horizontal'},
    unfocusedIcon: {sfSymbol: 'line.3.horizontal'},
  },
];

function MainTabNavigator() {
  const [index, setIndex] = useState(0);
  const {colors} = useTheme();

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      minimizeBehavior="onScrollDown"
      hapticFeedbackEnabled
      tabBarActiveTintColor={colors.primaryDark}
      tabBarInactiveTintColor={colors.tabIdle}
    />
  );
}

export default MainTabNavigator;
