import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageItem = ({ item }) => (
  <View style={styles.message_container}>
    <Text style={styles.message_item}>
      Leave a Review fro dsfdf asa as as as
      {' '}
      <Text style={styles.message_item_name}>Emma Thompson</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  message_container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 90,
  },

  message_item: {
    fontFamily: 'Montserrat-Regular',
    fontStyle: 'normal',
    fontSize: 13,
    lineHeight: 18,
    marginHorizontal: 17,
  },
  message_item_name: {
    fontFamily: 'Montserrat-Regular',
    fontStyle: 'normal',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 'bold',
  },
});
