import { useState } from 'react';

export const useVideoCall = () => {
  const [showVideo, setShowVideo] = useState(true);
  return { showVideo, setShowVideo };
};
