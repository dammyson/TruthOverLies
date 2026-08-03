import React from 'react';

import {AppProvider} from './context/AppContext';
import AppNavigator from './navigation/AppNavigator';

function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}

export default App;