import axios, { AxiosRequestConfig } from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import { isEmpty } from 'lodash';

const instance = axios.create({
  baseURL: 'https://shareslate.com/apis/',
  headers: {
    'Content-Type': 'multipart/form-data;'
  }
});

instance.interceptors.request.use(async function (config: AxiosRequestConfig) {
  try {
    console.log('here');
    const token = await EncryptedStorage.getItem('user_token');
    if (!isEmpty(token)) {
      config.data.append('token', token);
    }
    return config;
  } catch (err) {
    console.log('jibin', err);
  }
});

// instance.interceptors.response.use(function (response: AxiosResponse) {
//   // console.log('response', response.data);
//   if (get(response, 'data.status', '') !== 'success') {
//     const err = new AxiosError(
//       'API error!',
//       'ERR_BAD_RESPONSE',
//       response.config,
//       response.request,
//       response.data
//     );
//     throw err;
//   }
// });

export default instance;
