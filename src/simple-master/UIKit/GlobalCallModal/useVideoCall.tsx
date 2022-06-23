import { useState } from 'react';
import WebRTCSimple from '../../../simple-master';

export const useVideoCall = () => {
  const [hideVideo, setHideVideo] = useState(false);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const stream = WebRTCSimple.getLocalStream();
  return { hideVideo, setHideVideo, stream };
};
