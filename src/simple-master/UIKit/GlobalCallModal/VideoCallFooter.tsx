import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CallEvents } from '../../WebRtcSimple/contains';
import { CallIcons } from './CallIcons';

import { styles } from './styles';
interface IVideoCallFooter {
  onAccept: () => void;
  onEndCall: () => void;
  callStatus?: string;
  videoDisabled?: boolean;
  audioDisabled?: boolean;
  toggleVideo: () => void;
  toggleAudio: () => void;
}
const VideoCallFooter: React.FC<IVideoCallFooter> = ({
  onAccept,
  onEndCall,
  callStatus,
  toggleVideo,
  toggleAudio,
  videoDisabled,
  audioDisabled,
}) => {
  return (
    <View style={footerStyle.container}>
      {callStatus === CallEvents.received && (
        <View
          style={[
            footerStyle.flexRow,
            {
              width: '75%',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 40,
            },
          ]}>
          <CallIcons
            icon={require('./icon/call_white.png')}
            color="red"
            onPress={onEndCall}
          />
          <CallIcons
            icon={require('./icon/call.png')}
            color="green"
            onPress={onAccept}
          />
        </View>
      )}
      {callStatus === CallEvents.start && (
        <CallIcons
          icon={require('./icon/call_white.png')}
          color="red"
          onPress={onEndCall}
        />
      )}

      {callStatus === CallEvents.accept && (
        <View
          style={[
            footerStyle.flexRow,
            {
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: 15,
            },
          ]}>
          <CallIcons
            icon={require('./icon/heart_white.png')}
            onPress={() => {}}
          />
          <View
            style={[
              footerStyle.flexRow,
              {
                width: '55%',
                alignItems: 'center',
                justifyContent: 'space-around',
              },
            ]}>
            <CallIcons
              icon={require('./icon/mic_black.png')}
              color={audioDisabled ? undefined : 'white'}
              onPress={toggleAudio}
            />
            <CallIcons
              icon={require('./icon/no-video_white.png')}
              color={videoDisabled ? undefined : 'white'}
              onPress={toggleVideo}
            />
            <CallIcons
              icon={require('./icon/call_white.png')}
              color="red"
              onPress={onEndCall}
            />
          </View>
          <CallIcons
            icon={require('./icon/option_white.png')}
            onPress={() => {}}
          />
        </View>
      )}
    </View>
  );
};
const footerStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
});

export default VideoCallFooter;
