import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import BibleHomeScreen from '../screens/bible/BibleHomeScreen';
import ChapterGridScreen from '../screens/bible/ChapterGridScreen';
import ReaderScreen from '../screens/bible/ReaderScreen';
import {useTheme} from '../context/ThemeContext';

export type BibleStackParamList = {
  BibleHome: undefined;
  ChapterGrid: {
    bookId: string;
    bookName: string;
    chapterCount: number;
    translation: string;
  };
  Reader: {
    bookId: string;
    bookName: string;
    chapter: number;
    chapterCount: number;
    translation: string;
  };
};

const Stack = createNativeStackNavigator<BibleStackParamList>();

function BibleStackNavigator() {
  const {colors} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen name="BibleHome" component={BibleHomeScreen} />
      <Stack.Screen
        name="ChapterGrid"
        component={ChapterGridScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackTitle: '',
          headerTintColor: colors.primaryDark,
          headerTransparent: true,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Reader"
        component={ReaderScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackTitle: '',
          headerTintColor: colors.primaryDark,
          headerShadowVisible: false,
          headerStyle: {backgroundColor: colors.background},
        }}
      />
    </Stack.Navigator>
  );
}

export default BibleStackNavigator;
