import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainTabNavigator from './MainTabNavigator';
import SavedDetailScreen from '../screens/main/SavedDetailScreen';
import AppearanceScreen from '../screens/main/AppearanceScreen';
import ChapterGridScreen from '../screens/bible/ChapterGridScreen';
import ReaderScreen from '../screens/bible/ReaderScreen';
import SermonNoteDetailScreen from '../screens/sermon/SermonNoteDetailScreen';
import SermonNoteListScreen from '../screens/sermon/SermonNoteListScreen';
import GlassBackButton from '../components/GlassBackButton';
import {DevotionCard} from '../types/app';
import {useTheme} from '../context/ThemeContext';

export type RootStackParamList = {
  MainTabs: undefined;
  SavedDetail: {card: DevotionCard};
  Appearance: undefined;
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
  SermonNoteList: undefined;
  SermonNoteDetail: {
    noteId?: number;
  };
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
        options={({navigation}) => ({
          headerShown: true,
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => <GlassBackButton onPress={() => navigation.goBack()} />,
          headerTransparent: true,
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="Appearance"
        component={AppearanceScreen}
        options={({navigation}) => ({
          headerShown: true,
          headerTitle: 'Appearance',
          headerBackVisible: false,
          headerLeft: () => <GlassBackButton onPress={() => navigation.goBack()} />,
          headerShadowVisible: false,
          headerStyle: {backgroundColor: colors.background},
        })}
      />
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
      <Stack.Screen
        name="SermonNoteList"
        component={SermonNoteListScreen}
        options={({navigation}) => ({
          headerShown: true,
          headerTitle: 'Sermon Notes',
          headerBackVisible: false,
          headerLeft: () => <GlassBackButton onPress={() => navigation.goBack()} />,
          headerShadowVisible: false,
          headerStyle: {backgroundColor: colors.background},
        })}
      />
      <Stack.Screen
        name="SermonNoteDetail"
        component={SermonNoteDetailScreen}
        options={({navigation}) => ({
          headerShown: true,
          headerTitle: 'Sermon Note',
          headerBackVisible: false,
          headerLeft: () => <GlassBackButton onPress={() => navigation.goBack()} />,
          headerShadowVisible: false,
          headerStyle: {backgroundColor: colors.background},
        })}
      />
    </Stack.Navigator>
  );
}

export default RootNavigator;
