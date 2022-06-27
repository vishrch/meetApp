import { useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import axios, { AxiosRequestConfig } from 'axios';
import { isEmpty } from 'lodash';
import EncryptedStorage from 'react-native-encrypted-storage';

export const usePushNotification = () => {
  const instance = axios.create({
    baseURL: 'https://sipocloudpos.com/dev_server/public/api/insertfctoken/',
    headers: {
      'Content-Type': 'multipart/form-data;',
    },
  });

  const [deviceToken, setDeviceToken] = useState('');

  const requestNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled && !deviceToken) {
      await generateToken();
    }
  };

  const generateToken = async () => {
    const token = await messaging().getToken();
    updateDeviceToken(token)
      .then(data => console.log('********datadatadata************', data))
      .catch(err => console.log('oooerrr', err));
    setDeviceToken(token);
  };

  const updateDeviceToken = async (token: string) => {
    instance.interceptors.request.use(async function (
      config: AxiosRequestConfig,
    ) {
      config.data.append('token', token);
      console.log('**********config**********', config.data);
      try {
        if (!isEmpty(token)) {
          config.data.append('token', token);
        }
        console.log('********************', config.data);
        return config;
      } catch (err) {
        console.log('********************', err);
      }
    });
  };

  const removeDeviceToken = async () => {};

  return {
    deviceToken,
    setDeviceToken,
    requestNotificationPermission,
    removeDeviceToken,
    updateDeviceToken,
  };
};
