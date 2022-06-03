import axios from '@app/apis/axiosInstance';

const getFriendApi = (data: FormData) => {
  try {
    return axios.post('chat/GetUserData.php', data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

export default getFriendApi;
