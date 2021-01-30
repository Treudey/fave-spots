import React, { useState } from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import AppNavigator from './navigation/AppNavigator';
import placesReducer from './store/placesReducer';
import { init } from './helpers/db';

init().then(() => {
  console.log('Initialized database.');
}).catch(err => {
  console.log('Initialization failed.')
  console.log(err);
});

const rootReducer = combineReducers({
  places: placesReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={Font.loadAsync.bind(this, {
          'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
          'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
        })}
        onError={err => console.log(err)}
        onFinish={() => setFontLoaded(true)}
      />
    );
  }
  
  return <Provider store={store}>
    <AppNavigator />
  </Provider>;
}