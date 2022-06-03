import React from 'react';
import { Modal, View, TouchableWithoutFeedback, Text } from 'react-native';
import { height as h } from 'react-native-utils-scale';
import VerticalSwipeView from 'react-native-vertical-swipe-view';
import { CModal } from './model';

const defaultProps = {
  visible: false,
  transparent: false,
  height: h / 2,
  styles: {},
  headerStyle: {},
  backgroundColor: 'white',
};

const DisabledVideo: CModal = props => {
  const {} = props;

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.4)',
        },
      ]}>
      <Text>iiiiii</Text>
    </View>
  );
};

DisabledVideo.defaultProps = defaultProps;
export default DisabledVideo;
