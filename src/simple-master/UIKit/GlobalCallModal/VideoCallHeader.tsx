import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';
import { CallEvents, TypeProps } from '../../WebRtcSimple/contains';
import { CallIcons } from './CallIcons';

import { styles } from './styles';
interface IVideoCallHeader {
  callStatus?: string;
  name?: string;
  muted?: boolean;
}
const VideoCallHeader: React.FC<IVideoCallHeader> = ({
  callStatus,
  name,
  muted,
}) => {
  return (
    <View style={headerStyle.container}>
      <View style={{ flexDirection: 'row' }}>
        <CallIcons
          icon={require('./icon/messenger_white.png')}
          onPress={() => {}}
        />
        <View>
          <Text style={headerStyle.name}>Vishnu</Text>
          <Text style={headerStyle.connectionStatus}>CONNECTING</Text>
        </View>
      </View>
      <CallIcons icon={require('./icon/volume_white.png')} onPress={() => {}} />
    </View>
  );
};
const headerStyle = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    top: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  name: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  connectionStatus: {
    color: 'grey',
    fontSize: 17,
  },
});
export default VideoCallHeader;
