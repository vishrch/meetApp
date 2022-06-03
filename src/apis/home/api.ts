import axios from '../chatInstants';

const getFriendsApi = () => {
  let formData = new FormData();
  formData.append('action', 'friends');
  return axios.post('getFriends.php', formData);
};

export {getFriendsApi};
