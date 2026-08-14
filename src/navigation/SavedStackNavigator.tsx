import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SavedScreen from '../screens/main/SavedScreen';
import SavedDetailScreen from '../screens/main/SavedDetailScreen';
import {DevotionCard} from '../types/app';
import {useTheme} from '../context/ThemeContext';

export type SavedStackParamList = {
  SavedList: undefined;
  SavedDetail: {card: DevotionCard};
};

const Stack = createNativeStackNavigator<SavedStackParamList>();

function SavedStackNavigator() {
  const {colors} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen name="SavedList" component={SavedScreen} />
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

export default SavedStackNavigator;
