import React from 'react';
import { View, StyleSheet, Dimensions, Image, Text } from 'react-native';
import moment from 'moment';
import StatusCard from '../ShippingStatus/status-card';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 40,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dash: {
    paddingLeft: 10,
    height: 300,
    marginBottom: 10,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderWidth: 1,
    borderColor: 'white',
    borderTopColor: 'red',
  },
  dash_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  trackContatiner: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 35,
  },
  trackText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: '#969696',
    fontWeight: '600',
  },
  status_detail_container: {
    paddingHorizontal: 30,
    marginTop: 20,
  },
  status_detail_text: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: '#313334',
    lineHeight: 20,
  },
});

const ShippingReturnStatus = ({ returnObj }) => {
  const { shippedAt, shipBy, deliverBy, deliveredAt } = returnObj || {};

  const getShippedDetail = () => {
    let shippedDay = '?';
    let shippedMonth = '';
    let deliveryDay = '?';
    let deliveryMonth = '';
    let shippedActive = false;
    let deliveryActive = false;

    if (shippedAt) {
      shippedMonth = moment(new Date(shippedAt)).format('MMM');
      shippedDay = moment(new Date(shippedAt)).format('DD');
      shippedActive = true;
    } else if (shipBy) {
      shippedMonth = moment(new Date(shipBy)).format('MMM');
      shippedDay = moment(new Date(shipBy)).format('DD');
      shippedActive = false;
    }

    if (deliveredAt) {
      deliveryMonth = moment(new Date(deliveredAt)).format('MMM');
      deliveryDay = moment(new Date(deliveredAt)).format('DD');
      deliveryActive = true;
    } else if (deliverBy) {
      deliveryMonth = moment(new Date(deliverBy)).format('MMM');
      deliveryDay = moment(new Date(deliverBy)).format('DD');
      deliveryActive = false;
    }

    return {
      shippedMonth,
      shippedDay,
      deliveryDay,
      deliveryMonth,
      deliveryActive,
      shippedActive,
    };
  };

  const {
    shippedMonth,
    shippedDay,
    deliveryDay,
    deliveryMonth,
    deliveryActive,
    shippedActive,
  } = getShippedDetail();

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <StatusCard
          month={shippedMonth}
          day={shippedDay}
          active={shippedActive}
          header="Buyer Ship By"
        />
        <View style={styles.dash_container}>
          <Image
            source={require('../../../../assets/images/dash_line.png')}
            style={{ width: width / 4, height: 2.5 }}
          />
        </View>

        <StatusCard
          month={deliveryMonth}
          day={deliveryDay}
          header={deliveredAt ? 'Delivered on' : 'Deliver By'}
          active={deliveryActive}
        />
      </View>
      <View style={styles.status_detail_container}>
        <Text style={styles.status_detail_text}>
          This screen will update once the buyer sends the item. Once you
          receive it, please confirm below. with in 24 hours.
        </Text>
      </View>
    </View>
  );
};

export default ShippingReturnStatus;
