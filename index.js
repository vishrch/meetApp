/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { DeviceEventEmitter } from 'react-native';
import IncomingCall from 'react-native-incoming-call';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('remoteMessage');
  if (remoteMessage?.notification?.title === 'Incoming Call') {
    IncomingCall.display(
      'a2fa879f-23a2-4c8c-9f29-6fab63751eb1', // Call UUID v4
      'Vishnu', // Username
      'https://avatars3.githubusercontent.com/u/16166195', // Avatar URL
      'Incomming Call', // Info text
      20000, // Timeout for end call after 20s
    );
  } else if (remoteMessage?.notification?.title === 'Missed Call') {
    IncomingCall.dismiss();
  }

  DeviceEventEmitter.addListener('endCall', payload => {});
  DeviceEventEmitter.addListener('answerCall', payload => {
    console.log('answerCall', payload);
    if (payload.isHeadless) {
      IncomingCall.openAppFromHeadlessMode(payload.uuid);
    } else {
      IncomingCall.backToForeground();
    }
  });
});

AppRegistry.registerComponent(appName, () => App);
