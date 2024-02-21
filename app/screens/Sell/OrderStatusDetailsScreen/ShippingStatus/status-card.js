import React from 'react';

import {
  StyleSheet, Text, View, Dimensions,
} from 'react-native';

import { Colors } from '#themes';

const { width } = Dimensions.get('window');
// import styles from './styles';
const CARD_WIDTH = width / 3.7;
const styles = StyleSheet.create({
  tile: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
    marginBottom: 16,
    width: CARD_WIDTH,
    height: CARD_WIDTH - 12,
    marginTop: 10,
  },
  tile__body: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingRight: 10,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,

    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'center',
  },
  tile__container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tile__gray: {
    backgroundColor: '#969696',
  },
  tile__green: {
    backgroundColor: '#00BDAA',
  },
  tile_h_label: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
  tile_c_label: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: '#313334',
    textAlign: 'center',
  },
  tile_title: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: '#313334',
  },
});

const StatusCard = ({
  month,
  header,
  active,
  day,
}) => (

  <View>
    <Text style={styles.tile_title}>{header}</Text>
    <View style={[styles.tile]}>
      <View style={[styles.tile__body, active ? styles.tile__green : styles.tile__gray]}>
        <Text style={styles.tile_h_label}>
          {month}
        </Text>
      </View>
      <View style={styles.tile__container}>
        <Text style={styles.tile_c_label}>
          {day}
        </Text>
      </View>
    </View>
  </View>

);

StatusCard.defaultProps = {
  theme: 'primary',
  iconSize: 'medium',
};

export default StatusCard;
