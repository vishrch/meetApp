import { useState } from 'react';

export const useVideoCall = () => {
  const [hideVideo, setHideVideo] = useState(false);
  return { hideVideo, setHideVideo };
};
