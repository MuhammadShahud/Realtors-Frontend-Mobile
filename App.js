/* eslint-disable prettier/prettier */
import React from 'react';
import {NativeBaseProvider} from 'native-base';
import {connect, Provider} from 'react-redux';
import {store} from './src/Redux/store';
import AppNavigation from './src/Navigation/AppNavigation';
import SplashScreen from 'react-native-splash-screen';
import {Settings} from 'react-native-fbsdk-next';
import {LogBox} from 'react-native';
import Messaging from '@react-native-firebase/messaging';

Messaging().registerDeviceForRemoteMessages();

Settings.initializeSDK();

// LogBox.ignoreAllLogs(true);

SplashScreen.hide();
const App = () => {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <AppNavigation />
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;
