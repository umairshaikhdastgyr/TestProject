import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import NotificationList from './notification-list';
import { notificationSelector } from '../../../modules/Notifications/selectors';
import { getNotificationList } from '../../../modules/Notifications/actions';
import EmptyView from './empty-view';
import { selectUserData } from '#modules/User/selectors';
import { readNotification } from '#services/apiNotification'
import { Icon, Loader } from '#components';

import { getConversations } from '#services/apiChat';
import {
  getUserInfo,
} from '#modules/User/actions';
const MainScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();

  const {
    notifications: { notificationList },
  } = useSelector(notificationSelector);

  const { information: userInfo } = useSelector(selectUserData());

  useEffect(() => {
    if (!userInfo.id) {
      navigation.navigate('MainAuth', { isGuest: true });
      return;
    }
  }, [navigation, userInfo.id]);

  useEffect(() => {
    dispatch(getNotificationList({ userId: userInfo.id }));
  }, []);

  useEffect(() => { }, [notificationList]);

  const onPressNotification = async (props) => {
     switch (props?.data?.type) {
      case "order": {
        const orderId = props?.data?.orderId;
        const postId = props?.data?.postId;
        if(props?.data?.conversationId == null){
          setLoading(false);
        } else {
          const data = getConversations(props?.data?.conversationId)
          data.then((item) => {
            const { messagesData } = item
            let members = messagesData.members
            setLoading(false)
            navigation.navigate("ChatScreen", {
              item: {
                "post": {
                  "id": messagesData.postId,
                  "title": messagesData.post.title,
                  "urlImage": messagesData.post.urlImage
                },
                "sellerId": members[0].isSeller ? members[0].userId : members[1].userId,
                "receiver": {
                  "userId": !members[0].isSeller ? members[0].userId : members[1].userId,
                  "pictureUrl": props?.data?.pictureUrl
                },
              },
              conversationId: props?.data?.conversationId
            });
          })
        }

        break;
      };
      case "profile": {
        dispatch(getUserInfo({ userId: userInfo.id }));
        navigation.navigate("ProfileMain");
        break;
      };
      case "payment": {
        navigation.navigate('PaymentManagement');
        break;
      };
      case "catalog": {
        navigation.navigate('Dashboard', {
          fromScreen: 'explore',
          showSellSection: true,
        });
        break;
      };
      default: {
        break;
      }
    }
    await readNotification({ messageId: props.id, params: {} });
    dispatch(getNotificationList({ userId: userInfo.id }));
  }

  return (
    <View style={{ flex: 1 }}>
      {notificationList.newNotification.length == 0 &&
        notificationList.oldNotification.length == 0 && <EmptyView />}
      {loading && <Loader />}

      <ScrollView>
        <NotificationList
          navigation={navigation}
          title="NEW NOTIFICATION"
          notificationList={notificationList.newNotification}
          onPressNotification={(props) => { onPressNotification(props) }}
        />
        <NotificationList
          navigation={navigation}
          title="PAST NOTIFICATION"
          notificationList={notificationList.oldNotification}
          onPressNotification={(props) => { onPressNotification(props) }}
        />

      </ScrollView>
    </View>
  );
};

export default MainScreen;
