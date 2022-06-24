import React, { useEffect, useImperativeHandle, useState } from 'react';
import {
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import WebrtcSimple from '../../index';
import { CallEvents } from '../../WebRtcSimple/contains';
import { Timer } from '../index';
import DisabledVideo from './DisabledVideo';
import { styles } from './styles';
import { useVideoCall } from './useVideoCall';
import VideoCallFooter from './VideoCallFooter';
import VideoCallHeader from './VideoCallHeader';

let interval: any = null;
const ringtime = 20;

export const globalCallRef = React.createRef<any>();
export const globalCall = {
  call: (sessionId: string, userData: object) => {
    globalCallRef?.current?.call(sessionId, userData);
  },
};

export interface Props {
  name?: string;
}

StatusBar.setBarStyle('dark-content');
const GlobalCallUI = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [type, setType] = useState<string>();
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const [audioEnable, setAudioEnable] = useState<boolean>(true);
  const [videoEnabled, setVideoEnable] = useState<boolean>(true);
  const [cameraType, setCameraType] = useState<'front' | 'end'>('front');
  const [remoteCameraType, setRemoteCameraType] = useState<'front' | 'end'>(
    'front',
  );
  const [name, setName] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const { hideVideo, setHideVideo, stream } = useVideoCall();
  useImperativeHandle(ref, () => {
    return { call };
  });

  useEffect(() => {
    WebrtcSimple.listenings.getRemoteStream(remoteStream => {
      setRemoteStream(remoteStream);
    });

    WebrtcSimple.listenings.callEvents((type, userData: any) => {
      console.log('type', type);
      console.log('userData', userData);
      if (
        userData &&
        userData?.message &&
        userData?.type === 'CAMERA' &&
        userData?.message?.value === 'OFF'
      ) {
        setHideVideo(true);
      } else {
        setHideVideo(false);
      }
      if (type !== CallEvents.message) {
        setType(type);
      }

      if (type === CallEvents.received || type === CallEvents.start) {
        video(true);
        audio(true);
        let time = ringtime;
        interval = setInterval(() => {
          time = time - 1;
          if (time === 0) {
            endCall();
            clearInterval(interval);
          }
        }, 1000);

        if (type === CallEvents.received) {
          WebrtcSimple.events.vibration.start(20);

          if (userData?.sender_name && userData?.sender_avatar) {
            setName(userData.sender_name);
            setAvatar(userData.sender_avatar);
          }
        } else {
          if (userData?.receiver_name && userData?.receiver_avatar) {
            setName(userData.receiver_name);
            setAvatar(userData.receiver_avatar);
          }
        }

        setVisible(true);
      }

      if (type === CallEvents.accept) {
        clearInterval(interval);
        WebrtcSimple.events.vibration.cancel();
      }

      if (type === CallEvents.end) {
        clearInterval(interval);
        WebrtcSimple.events.vibration.cancel();
        setVisible(false);
        setAudioEnable(true);
        setVideoEnable(true);
      }

      if (type === CallEvents.message) {
        if (userData?.message?.type === 'SWITCH_CAMERA') {
          setRemoteCameraType(userData?.message?.value);
        }
      }
    });
  }, []);

  const call = (sessionId: string, userData: object) => {
    WebrtcSimple.events.call(sessionId, userData);
  };

  const acceptCall = () => {
    WebrtcSimple.events.acceptCall();
  };

  const endCall = () => {
    WebrtcSimple.events.endCall();
  };

  const switchCamera = () => {
    if (cameraType === 'front') {
      setCameraType('end');
      WebrtcSimple.events.message({ type: 'SWITCH_CAMERA', value: 'end' });
    } else {
      setCameraType('front');
      WebrtcSimple.events.message({ type: 'SWITCH_CAMERA', value: 'front' });
    }
    WebrtcSimple.events.switchCamera();
  };

  const video = (enable: boolean) => {
    WebrtcSimple.events.videoEnable(enable);
    if (enable) {
      WebrtcSimple.events.message({ type: 'CAMERA', value: 'ON' });
    } else {
      WebrtcSimple.events.message({ type: 'CAMERA', value: 'OFF' });
    }
  };

  const audio = (enable: boolean) => {
    WebrtcSimple.events.audioEnable(enable);
  };
  const rejectCall = () => {
    setVisible(false);
    endCall();
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={() => {
        setVisible(false);
      }}>
      <View style={styles.modalCall}>
        {name.length > 0 && type !== CallEvents.accept && (
          <Text style={styles.name}>{name}</Text>
        )}
        {avatar.length > 0 && type !== CallEvents.accept && (
          <Image style={styles.avatar} source={{ uri: avatar }} />
        )}
        {type === CallEvents.start && CallEvents.accept && (
          <Timer style={styles.timer} textStyle={styles.textTimer} start />
        )}
        {(type === CallEvents.received ||
          type === CallEvents.accept ||
          type === CallEvents.start ||
          remoteStream) && (
          <View style={style.container}>
            {(hideVideo ||
              type === CallEvents.received ||
              type === CallEvents.start) && <DisabledVideo />}
            {!hideVideo &&
              remoteStream &&
              remoteCameraType &&
              type !== CallEvents.received &&
              type !== CallEvents.start && (
                <RTCView
                  mirror={remoteCameraType === 'front' ? true : false}
                  streamURL={remoteStream?.toURL()}
                  zOrder={99}
                  style={styles.stream}
                  objectFit="cover"
                />
              )}
          </View>
        )}

        {stream && (
          <View style={styles.boxMyStream}>
            <RTCView
              mirror={cameraType === 'front' ? true : false}
              streamURL={stream.toURL()}
              zOrder={999}
              style={styles.myStream}
              objectFit="cover"
            />
            {type === CallEvents.accept && (
              <Timer
                style={styles.timer2}
                textStyle={styles.textTimer2}
                start
              />
            )}
            <TouchableOpacity onPress={() => switchCamera()}>
              <Image
                style={styles.iconCamera}
                source={require('./icon/camera.png')}
              />
            </TouchableOpacity>
          </View>
        )}

        <VideoCallFooter
          onAccept={acceptCall}
          onEndCall={rejectCall}
          callStatus={type}
          videoDisabled={videoEnabled}
          audioDisabled={audioEnable}
          toggleAudio={() => {
            audio(!audioEnable);
            setAudioEnable(!audioEnable);
          }}
          toggleVideo={() => {
            video(!videoEnabled);
            setVideoEnable(!videoEnabled);
          }}
        />

        {type === CallEvents.accept && <VideoCallHeader />}
      </View>
    </Modal>
  );
});

export default GlobalCallUI;

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#1D1D20',
    alignContent: 'center',
    justifyContent: 'center',
  },
});
