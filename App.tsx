import React from 'react';
import { View, LogBox, StatusBar } from 'react-native';
import AppWithNavigationState from 'navigators';
import {} from 'components';
import GlobalLoading, { globalLoadingRef } from 'components/GlobalLoading';
import GlobalMessage, { globalMessageRef } from 'components/GlobalMessage';
import { I18nextProvider } from 'react-i18next';
import i18next from 'shared/language';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import {
  globalCallRef,
  GlobalCallUI,
  globalGroupCallRef,
  GlobalGroupCallUI,
} from './src/simple-master/UIKit';
import { useEffect } from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

LogBox.ignoreAllLogs(true);
StatusBar.setBarStyle('dark-content');
const MyBase = () => {
  useEffect(() => {
    DeviceEventEmitter.addListener('accept', () => {
      console.log('***Acc***');
    });
    DeviceEventEmitter.addListener('reject', () => {
      console.log('***Rej***');
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <I18nextProvider i18n={i18next}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <AppWithNavigationState />
          <GlobalLoading ref={globalLoadingRef} />
          <GlobalMessage ref={globalMessageRef} />
          <GlobalCallUI ref={globalCallRef} />
          <GlobalGroupCallUI ref={globalGroupCallRef} />
        </ApplicationProvider>
      </I18nextProvider>
    </View>
  );
};
export default MyBase;
