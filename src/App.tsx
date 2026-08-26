import React from 'react';

import {AppProvider} from './context/AppContext';
import {ThemeProvider} from './context/ThemeContext';
import {BibleNavProvider} from './context/BibleNavContext';
import {TabNavProvider} from './context/TabNavContext';
import AppNavigator from './navigation/AppNavigator';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BibleNavProvider>
          <TabNavProvider>
            <AppNavigator />
          </TabNavProvider>
        </BibleNavProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;