import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';

import { styles } from './styles';

interface ICallIcons {
  icon: ImageSourcePropType;
  color?: string;
  onPress: () => void;
}

export const CallIcons: React.FC<ICallIcons> = ({ icon, color, onPress }) => {
  return (
    <View>
      <TouchableOpacity
        style={[styles.btnCall, !!color && { backgroundColor: color }]}
        onPress={() => {
          onPress();
        }}>
        <Image
          style={[
            styles.icon,
            { tintColor: color === 'white' ? 'black' : 'white' },
          ]}
          source={icon}
        />
      </TouchableOpacity>
    </View>
  );
};
