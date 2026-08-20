import React from 'react';

import {AppProvider} from './context/AppContext';
import {ThemeProvider} from './context/ThemeContext';
import {BibleNavProvider} from './context/BibleNavContext';
import AppNavigator from './navigation/AppNavigator';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BibleNavProvider>
          <AppNavigator />
        </BibleNavProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;