import 'react-native-gesture-handler';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { LogBox } from 'react-native';
import { Provider as StoreProvider } from 'react-redux';

import { AppNavigator } from './src/routes';

import store from './src/services/store';

LogBox.ignoreLogs([
  'AsyncStorage'
])

function App() {
  return (
    <StoreProvider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </StoreProvider>
  );
}

export default App;