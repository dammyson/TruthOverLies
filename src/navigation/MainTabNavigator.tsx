import React, {useEffect, useRef, useState} from 'react';
import {Linking, Platform, View} from 'react-native';
import TabView, {SceneMap} from 'react-native-bottom-tabs';
import {useBibleNav} from '../context/BibleNavContext';
import {useTabNav} from '../context/TabNavContext';
import {resolveReferenceToBibleTarget} from '../utils/verseNavigation';

import HomeStackNavigator from './HomeStackNavigator';
import BibleHomeScreen from '../screens/bible/BibleHomeScreen';
import MoreScreen from '../screens/main/MoreScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SavedScreen from '../screens/main/SavedScreen';
import {useTheme} from '../context/ThemeContext';
import FloatingJournalButton from '../components/FloatingJournalButton';
import JournalListModal from '../screens/journal/JournalListModal';
import JournalEntrySheet from '../screens/journal/JournalEntrySheet';
import {Journal} from '../types/app';

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
const SAVED_TAB_INDEX = 1;

const JOURNAL_TAB_THRESHOLD = 3; // hide FAB on profile (3) and more (4)

function MainTabNavigator() {
  const [index, setIndex] = useState(0);
  const [journalOpen, setJournalOpen] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Journal | null>(null);
  const pendingEntry = useRef<{entry: Journal | null} | null>(null);
  const {colors} = useTheme();
  const {pending, navigateTo} = useBibleNav();
  const {registerJump} = useTabNav();

  useEffect(() => {
    registerJump(setIndex);
  }, [registerJump]);

  useEffect(() => {
    if (pending) setIndex(BIBLE_TAB_INDEX);
  }, [pending]);

  useEffect(() => {
    // new URL() is unreliable with custom schemes in Hermes — parse manually.
    function parseWidgetUrl(raw: string): {route: string; params: Record<string, string>} | null {
      const match = raw.match(/^godsplace:\/\/([^?]*)(?:\?(.*))?$/i);
      if (!match) {
        return null;
      }
      const route = (match[1] ?? '').toLowerCase().replace(/^\/+|\/+$/g, '');
      const queryStr = match[2] ?? '';
      const params: Record<string, string> = {};
      queryStr.split('&').filter(Boolean).forEach(part => {
        const eqIdx = part.indexOf('=');
        if (eqIdx === -1) {
          return;
        }
        const key = decodeURIComponent(part.slice(0, eqIdx));
        const val = decodeURIComponent(part.slice(eqIdx + 1));
        params[key] = val;
      });
      return {route, params};
    }

    const handleWidgetLink = async (url: string) => {
      const parsed = parseWidgetUrl(url);
      if (!parsed) {
        return;
      }

      const {route, params} = parsed;

      if (route === 'home') {
        setIndex(0);
        return;
      }

      if (route === 'saved') {
        setIndex(SAVED_TAB_INDEX);
        return;
      }

      if (route === 'bible') {
        setIndex(BIBLE_TAB_INDEX);
        return;
      }

      if (route === 'journal/new') {
        setIndex(0);
        setJournalOpen(true);
        return;
      }

      if (route === 'verse') {
        const reference = params.reference;
        if (!reference) {
          return;
        }
        const target = await resolveReferenceToBibleTarget(reference);
        if (target) {
          navigateTo(target);
          setIndex(BIBLE_TAB_INDEX);
        }
      }
    };

    Linking.getInitialURL().then(initial => {
      if (initial) {
        void handleWidgetLink(initial);
      }
    });

    const sub = Linking.addEventListener('url', event => {
      void handleWidgetLink(event.url);
    });

    return () => {
      sub.remove();
    };
  }, [navigateTo]);

  const handleNewEntry = () => {
    pendingEntry.current = {entry: null};
    setJournalOpen(false);
  };

  const handleEditEntry = (entry: Journal) => {
    pendingEntry.current = {entry};
    setJournalOpen(false);
  };

  const handleListDismiss = () => {
    setJournalOpen(false);
    if (pendingEntry.current !== null) {
      const p = pendingEntry.current;
      pendingEntry.current = null;
      setEditingEntry(p.entry);
      setEntryOpen(true);
    }
  };

  const handleEntryClose = () => {
    setEntryOpen(false);
    setJournalOpen(true);
  };

  const showFab = index < JOURNAL_TAB_THRESHOLD;

  return (
    <View style={{flex: 1}}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        minimizeBehavior="onScrollDown"
        hapticFeedbackEnabled
        tabBarActiveTintColor={colors.primaryDark}
        tabBarInactiveTintColor={colors.tabIdle}
      />
      {showFab && (
        <FloatingJournalButton onPress={() => setJournalOpen(true)} />
      )}
      <JournalListModal
        visible={journalOpen}
        onClose={() => setJournalOpen(false)}
        onDismiss={handleListDismiss}
        onNewEntry={handleNewEntry}
        onEditEntry={handleEditEntry}
      />
      <JournalEntrySheet
        visible={entryOpen}
        entry={editingEntry}
        onClose={handleEntryClose}
      />
    </View>
  );
}

export default MainTabNavigator;
