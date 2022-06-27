/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// import messaging from '@react-native-firebase/messaging';
import { DeviceEventEmitter } from 'react-native';

AppRegistry.registerComponent(appName, () => App);
