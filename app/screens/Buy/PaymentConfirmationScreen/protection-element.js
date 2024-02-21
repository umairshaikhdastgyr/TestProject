import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';

import styles from './styles';

const ProtectionElement = ({ prModalVisibleAction }) => (
  <View
    style={{
      flexDirection: 'row',
      width: '100%',
      marginTop: 0,
      paddingVertical: 26,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F5F5F5',


    }}
  >
    <View style={styles2.iconStyle}>
      <Text style={styles2.iconText}>H</Text>
    </View>
    <TouchableOpacity onPress={() => { prModalVisibleAction(true); }}>

      <Text style={styles2.contentStyle}>Shipping buyer protection</Text>
    </TouchableOpacity>
  </View>
);

const styles2 = StyleSheet.create({
  iconStyle: {
    width: 30,
    height: 30,
    backgroundColor: '#00BDAA',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  contentStyle: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 13,
    color: '#00BDAA',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginLeft: 7,
  },
});


export default ProtectionElement;
