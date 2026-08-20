import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import TabView, {SceneMap} from 'react-native-bottom-tabs';
import {useBibleNav} from '../context/BibleNavContext';

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

const isIOS = Platform.OS === 'ios';

const routes = [
  {
    key: 'home',
    title: 'Home',
    focusedIcon: isIOS ? {sfSymbol: 'house.fill'} : {uri: 'ic_home_filled'},
    unfocusedIcon: isIOS ? {sfSymbol: 'house'} : {uri: 'ic_home'},
  },
  {
    key: 'saved',
    title: 'Saved',
    focusedIcon: isIOS ? {sfSymbol: 'bookmark.fill'} : {uri: 'ic_bookmark_filled'},
    unfocusedIcon: isIOS ? {sfSymbol: 'bookmark'} : {uri: 'ic_bookmark'},
  },
  {
    key: 'bible',
    title: 'Bible',
    focusedIcon: isIOS ? {sfSymbol: 'book.fill'} : {uri: 'ic_book_filled'},
    unfocusedIcon: isIOS ? {sfSymbol: 'book'} : {uri: 'ic_book'},
  },
  {
    key: 'profile',
    title: 'You',
    focusedIcon: isIOS ? {sfSymbol: 'person.fill'} : {uri: 'ic_person_filled'},
    unfocusedIcon: isIOS ? {sfSymbol: 'person'} : {uri: 'ic_person'},
  },
  {
    key: 'more',
    title: 'More',
    focusedIcon: isIOS ? {sfSymbol: 'line.3.horizontal'} : {uri: 'ic_menu'},
    unfocusedIcon: isIOS ? {sfSymbol: 'line.3.horizontal'} : {uri: 'ic_menu'},
  },
];

const BIBLE_TAB_INDEX = 2;

function MainTabNavigator() {
  const [index, setIndex] = useState(0);
  const {colors} = useTheme();
  const {pending} = useBibleNav();

  useEffect(() => {
    if (pending) setIndex(BIBLE_TAB_INDEX);
  }, [pending]);

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
