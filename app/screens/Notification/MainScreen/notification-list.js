import React, { useRef, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import NotificationItem from './notification-item';

const NotificationList = ({ title, notificationList, navigation, onPressNotification }) => (
  <>
    {notificationList.length > 0 && (
      <>
        <Text style={styles.notification_title}>{title}</Text>
        {notificationList.map((item) => (
          <NotificationItem
            {...item}
            onPressNotification={()=>onPressNotification(item)}
          />
        ))}
      </>
    )}
  </>
);
export default NotificationList;
const styles = StyleSheet.create({
  notification_title: {
    fontFamily: 'Montserrat-Regular',
    fontStyle: 'normal',
    fontSize: 10,
    lineHeight: 18,
    fontWeight: '600',
    marginHorizontal: 17,
    color: '#969696',
    marginTop: 32,
    marginBottom: 9,
  },
});
