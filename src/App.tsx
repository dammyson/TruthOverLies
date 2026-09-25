import React from 'react';

import {AppProvider} from './context/AppContext';
import {ThemeProvider} from './context/ThemeContext';
import {BibleNavProvider} from './context/BibleNavContext';
import {TabNavProvider} from './context/TabNavContext';
import {ScriptureProvider} from './context/ScriptureContext';
import {JournalProvider} from './context/JournalContext';
import {SermonNoteProvider} from './context/SermonNoteContext';
import AppNavigator from './navigation/AppNavigator';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BibleNavProvider>
          <TabNavProvider>
            <ScriptureProvider>
              <JournalProvider>
                <SermonNoteProvider>
                  <AppNavigator />
                </SermonNoteProvider>
              </JournalProvider>
            </ScriptureProvider>
          </TabNavProvider>
        </BibleNavProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;