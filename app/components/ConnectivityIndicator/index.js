import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Fonts } from '#themes';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  activity_container: {
    height: getStatusBarHeight() + 30,
    position: 'absolute',
    top: 0,
    width,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 7,
    paddingLeft: 20,
  },
  connected_view: {
    backgroundColor: Colors.active,
  },
  no_connection_view: {
    backgroundColor: Colors.red,
  },
  message_txt: {
    ...Fonts.style.homiBodyText,
    color: Colors.white,
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 5,
  },
});

const CONNECTION_TYPES = ['connected', 'no-connection'];
const ConnectivityIndicator = ({ message, conType, setConnToDefault }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (CONNECTION_TYPES.includes(conType)) {
      setVisible(true);
    } else {
      setVisible(false);
    }
    let hideTimer = null;
    if (conType === 'connected') {
      hideTimer = setTimeout(() => setConnToDefault(), 3000);
    }
    return () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  }, [conType]);
  return (
    visible && (
      <View
        style={[
          styles.activity_container,
          conType === 'connected'
            ? styles.connected_view
            : styles.no_connection_view,
        ]}
      >
        <Ionicons
          name={
            conType === 'connected' ? 'ios-checkmark-circle' : 'ios-warning'
          }
          color="#fff"
          size={16}
          style={{ top: 0 }}
        />
        <Text style={styles.message_txt}>{message}</Text>
      </View>
    )
  );
};

export default ConnectivityIndicator;
