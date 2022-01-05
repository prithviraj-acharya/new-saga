/**
 * @format
 */
import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import store from './src/redux/store/index';
import _statusHandler from './src/utils/helpers/Status';
LogBox.ignoreAllLogs();

function MyAssurance() {
  _statusHandler.call(this);
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
AppRegistry.registerComponent(appName, () => MyAssurance);
