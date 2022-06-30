import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/core';
import { Text, List, ListItem, Avatar } from '@ui-kitten/components';
import { get } from 'lodash';
import { Alert, StyleSheet, View, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FullScreenLoader from '../../screens/dashboard/FullScreenLoader';
import HomeHeader from '../../screens/dashboard/HomeHeader';
import { getFriendsApi } from '../../apis/home/api';
import EncryptedStorage from 'react-native-encrypted-storage';
import WebrtcSimple from '../../simple-master';
import { globalCall } from '../../simple-master/UIKit';
import {
  PUSH_CALL_TYPE,
  usePushNotification,
} from 'screens/login/usePushNotification';

function Dashboard() {
  const navigation = useNavigation();
  const { params } = useRoute();

  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fullName = (useRoute().params as any)?.fullName;
  const [receverName, setReceverName] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const { sendFCMPush } = usePushNotification();

  useEffect(() => {
    console.log('*****', params.user.lname);
    getFriendsList();
    startConnection();
  }, []);

  async function getFriends() {
    const response = await getFriendsApi();
    return response?.data;
  }

  const callToUser = (callId: string, userId: number) => {
    if (callId.length > 0) {
      if (callId !== sessionId) {
        const useData = {
          sender_name: fullName,
          sender_avatar:
            'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png',
          receiver_name: receverName,
          receiver_avatar:
            'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png',
          user_id: userId,
        };
        globalCall.call(callId, useData);
        sendFCMPush(PUSH_CALL_TYPE.INCOMING, params?.user?.lname ?? '', userId);
      } else {
        Alert.alert("You can't call yourself");
      }
    } else {
      Alert.alert('Please enter call Id');
    }
  };

  const startConnection = async () => {
    const name = await EncryptedStorage.getItem('user_name');
    console.log('startConnection');
    const configuration: any = {
      optional: null,
      key: name,
    };

    WebrtcSimple.start(configuration, { frameRate: 120 })
      .then(status => {
        if (status) {
          console.log('sessionId');
          WebrtcSimple.getSessionId((sessionId: string) => {
            console.log(sessionId);
            setSessionId(sessionId);
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  async function getFriendsList() {
    setLoading(true);
    getFriends().then(data => {
      if (get(data, 'status', '') !== 'success') {
        setError(get(data, 'data.message', 'Something went wrong'));
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }
      setFriends(data.data);
      setLoading(false);
    });
  }

  const header = () => {
    return <HomeHeader title="Home" />;
  };

  const renderText = item => {
    return (
      <Text style={styles.heading} category="s1">
        {item.name}
      </Text>
    );
  };

  const renderItemIcon = item => {
    return (
      <View style={styles.avatarContainer}>
        <Avatar shape="medium" source={{ uri: item.url }} />
      </View>
    );
  };

  const renderItem = ({ item }: any) => (
    <ListItem
      key={item.id}
      title={() => renderText(item)}
      description={`${item.room_id ? item.room_id : ''}`}
      accessoryLeft={() => renderItemIcon(item)}
      style={styles.listItem}
      onPress={async () => {
        console.log(item);
        callToUser(item.username, item.id);
        // const name = await EncryptedStorage.getItem('user_name');
        // navigation.navigate('Main',{
        //   fullName:name
        // });
      }}
    />
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={'#729429'} />
      {loading ? (
        <FullScreenLoader />
      ) : (
        <List
          style={styles.listContainer}
          data={friends}
          renderItem={renderItem}
          // ListHeaderComponent={header}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    height: 40,
    width: 40,
    backgroundColor: '#232055',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  heading: {
    color: '#0A082580',
    marginLeft: 6,
  },
  listItem: {
    height: 80,
    backgroundColor: '#E1DFE7',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  },
});

export default Dashboard;
