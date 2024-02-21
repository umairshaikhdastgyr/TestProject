import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Linking,
  TouchableOpacity
} from 'react-native';
import moment from 'moment';
import StatusCard from './status-card';
import BorderElement from './border-element';
import { Fonts } from '#themes';
import colors from '#themes/colors';

const TRACKING_URL = {
  FedEx: 'https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=',
  DHL: 'https://www.logistics.dhl/us-en/home/tracking/tracking-freight.html?submit=1&tracking-id=',
  UPS: 'https://www.ups.com/track?loc=en_US&tracknum=',
  USPS: 'https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=',
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 40,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
  trackClaimContatiner: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 35,
  },
  trackContatiner: {
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
});
const TRACKING_CARRIERS = ['usps', 'fedex', 'ups', 'dhl'];

const ShippingStatus = ({
  order,
  cardTitle,
  cardDetail,
  type,
  side,
  orderstatus,
}) => {
  const {
    deliveryStatus,
    paymentMethod,
    deliveryMethod,
    shippedAt,
    shipBy,
    deliverBy,
    deliveredAt,
    ReturnRequests,
  } = order || {};

  const trackingCarrier =
    !type &&
    order?.labels &&
    order?.labels.length &&
    order?.labels[order?.labels.length - 1].carrier;
  const trackingId =
    !type &&
    order?.labels &&
    order?.labels.length &&
    order?.labels[order?.labels.length - 1].trackingId;
  const carrierName =
    !type &&
    order?.labels &&
    order?.labels.length &&
    order?.labels[order?.labels.length - 1].carrier;

  const getReturnTime = () => {
    const returnRequestObj = ReturnRequests?.[0];
    let shippedMonth = '';
    let shippedDay = '';
    let shippedActive = false;
    let deliveryActive = false;
    let deliveryDay = '';
    let deliveryMonth = '';

    if (returnRequestObj) {
      const deliverBy = returnRequestObj.deliverBy;
      const shippedAt = returnRequestObj.shippedAt;
      const deliveredAtRet = returnRequestObj.deliveredAt;

      if (deliverBy) {
        shippedMonth = deliverBy
          ? moment(new Date(deliverBy)).format('MMM')
          : '';
        shippedDay = deliverBy ? moment(new Date(deliverBy)).format('DD') : '?';
        shippedActive = false;
      }
      if (shippedAt) {
        shippedMonth = shippedAt
          ? moment(new Date(shippedAt)).format('MMM')
          : '';
        shippedDay = shippedAt ? moment(new Date(shippedAt)).format('DD') : '?';
        shippedActive = true;
        deliveryMonth = deliverBy
          ? moment(new Date(deliverBy)).format('MMM')
          : '';
        deliveryDay = deliverBy
          ? moment(new Date(deliverBy)).format('DD')
          : '?';
        deliveryActive = false;
      }
      if (deliveredAtRet) {
        deliveryMonth = deliveredAtRet
          ? moment(new Date(deliveredAtRet)).format('MMM')
          : '';
        deliveryDay = deliveredAt
          ? moment(new Date(deliveredAtRet)).format('DD')
          : '?';
        deliveryActive = true;
      }
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

  const getShippedDetail = () => {
    let shippedDay = '?';
    let shippedMonth = '';
    let deliveryDay = '?';
    let deliveryMonth = '';
    let shippedActive = false;
    let deliveryActive = false;
    if (shippedAt) {
      shippedMonth = shippedAt ? moment(new Date(shippedAt)).format('MMM') : '';
      shippedDay = shippedAt ? moment(new Date(shippedAt)).format('DD') : '?';
      shippedActive = true;
    } else {
      shippedMonth = shipBy ? moment(new Date(shipBy)).format('MMM') : '';
      shippedDay = shipBy ? moment(new Date(shipBy)).format('DD') : '?';
      shippedActive = false;
    }
    if (deliveredAt) {
      deliveryMonth = deliveredAt
        ? moment(new Date(deliveredAt)).format('MMM')
        : '';
      deliveryDay = deliveredAt
        ? moment(new Date(deliveredAt)).format('DD')
        : '?';
      deliveryActive = true;
    } else {
      deliveryMonth = deliverBy
        ? moment(new Date(deliverBy)).format('MMM')
        : '';
      deliveryDay = deliverBy ? moment(new Date(deliverBy)).format('DD') : '?';
      deliveryActive = false;
    }
    return {
      shippedMonth,
      shippedDay,
      deliveryDay,
      deliveryMonth,
      shippedActive,
      deliveryActive,
    };
  };

  const {
    shippedMonth,
    shippedDay,
    deliveryDay,
    deliveryMonth,
    shippedActive,
    deliveryActive,
  } = type == 'return' ? getReturnTime() : getShippedDetail();

  const getPaymentProps = () => {
    switch (paymentMethod?.type) {
      case 'googlePay':
        return {
          paymentMethodText: 'GOOGLE PAY',
          icon: 'google_pay',
        };

      case 'applePay':
        return {
          paymentMethodText: 'APPLE PAY',
          icon: 'apple_pay',
        };
      case 'googlepay':
        return {
          paymentMethodText: 'GOOGLE PAY',
          icon: 'google_pay',
        };

      case 'applepay':
        return {
          paymentMethodText: 'APPLE PAY',
          icon: 'apple_pay',
        };

      case 'creditcard':
        return {
          paymentMethodText: cardTitle,
          icon: 'credit-card',
        };

      default:
        return {
          paymentMethodText: null,
          icon: null,
        };
    }
  };
  const claimTrackingId = order?.ClaimRequests?.[0]?.id;
  const { paymentMethodText, icon } = getPaymentProps();

  const trackOrderById = () => {
    switch (deliveryMethod.carrier) {
      case 'ups':
        Linking.openURL(TRACKING_URL.UPS + trackingId);
        break;
      case 'fedex':
        Linking.openURL(TRACKING_URL.FedEx + trackingId);
        break;
      case 'usps':
        Linking.openURL(TRACKING_URL.USPS + trackingId);
        break;
      case 'dhl':
        Linking.openURL(TRACKING_URL.DHL + trackingId);
        break;
      default:
        break;
    }
  };
  const getShippingAddress = () => {
    const address = `${deliveryMethod?.addressline1}${
      deliveryMethod?.addressline2 && ', ' + deliveryMethod?.addressline2
    }\n${deliveryMethod?.city && '' + deliveryMethod?.city}${
      deliveryMethod?.state && ', ' + deliveryMethod?.state
    }${deliveryMethod?.zipcode && ' ' + deliveryMethod?.zipcode} `;

    return address;
  };
  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <StatusCard
          month={shippedMonth}
          day={shippedDay}
          active={shippedActive}
          header={
            type == 'return'
              ? !shippedActive
                ? side == 'BUYER'
                  ? 'Return by'
                  : 'Buyer Ship By'
                : 'Shipped on'
              : shippedAt
              ? 'Shipped on'
              : 'Ship By'
          }
        />
        <View style={styles.dash_container}>
          <Image
            source={require('../../../../assets/images/dash_line.png')}
            style={{ width: width / 4, height: 2.5 }}
          />
        </View>

        <StatusCard
          month={deliveryMonth}
          day={deliveryDay || '?'}
          header={
            type == 'return'
              ? ReturnRequests?.[0]?.deliveredAt
                ? 'Delivered on'
                : 'Est. Delivery'
              : deliveredAt
              ? 'Delivered on'
              : 'Deliver By'
          }
          active={deliveryActive}
        />
      </View>
      {claimTrackingId && type == 'claim' && (
        <View style={styles.trackClaimContatiner}>
          <Text
            style={[
              styles.trackText,
              {
                textDecorationLine: 'underline',
                color: colors.active,
                fontFamily: Fonts.family.semiBold,
              },
            ]}
            numberOfLines={1}
          >{`Tracking number : ${claimTrackingId?.split('-')[0]}`}</Text>
        </View>
      )}
      {trackingId &&
        (TRACKING_CARRIERS.includes(deliveryMethod.carrier) ? (
          <TouchableOpacity
            style={styles.trackContatiner}
            onPress={trackOrderById}
          >
            <Text
              numberOfLines={1}
              style={[styles.trackText, { textDecorationLine: 'underline' }]}
            >{`${carrierName.toUpperCase()}  ${trackingId}`}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.trackContatiner}>
            <Text
              style={styles.trackText}
              numberOfLines={1}
            >{`Tracking number : ${trackingCarrier + ' ' + trackingId}`}</Text>
          </View>
        ))}

      {(ReturnRequests?.[0]?.returnStatus?.toLowerCase() == 'labelshared' ||
        ReturnRequests?.[0]?.returnStatus?.toLowerCase() == 'labelsharedind') &&
        side == 'BUYER' && (
          <Text
            style={[
              styles.trackText,
              { textAlign: 'center', color: '#313334', marginTop: 30 },
            ]}
          >{`Please return the item by ${moment(
            new Date(ReturnRequests?.[0]?.deliverBy),
          ).format(
            'DD/MM',
          )}. Once you’ve shipped it off, please confirm so below.`}</Text>
        )}

      {(ReturnRequests?.[0]?.returnStatus == 'returnshipped' ||
        ReturnRequests?.[0]?.returnStatus == 'returned') &&
        side == 'BUYER' && (
          <>
            <Text
              style={[
                styles.trackText,
                {
                  textAlign: 'center',
                  color: '#969696',
                  fontFamily: Fonts.family.semiBold,
                  marginTop: 20,
                  textDecorationLine: 'underline',
                },
              ]}
            >{`${
              ReturnRequests?.[0]?.labelData?.data?.carrier?.toUpperCase() ||
              ReturnRequests?.[0]?.labelData?.carrier?.toUpperCase()
            } ${
              ReturnRequests?.[0]?.labelData?.data?.trackingId ||
              ReturnRequests?.[0]?.labelData?.trackingId?.toUpperCase()
            }`}</Text>
          </>
        )}
      {side === 'BUYER' &&
        type != 'return' &&
        type != 'claim' &&
        deliveryMethod?.type !== 'pickup' && (
          <BorderElement
            title={getShippingAddress()}
            titleTop={deliveryMethod?.buyerName}
            leftLabel="Ship to"
            topBorder={1}
            numberOfLines={2}
            textAlignRight={true}
          />
        )}

      {side === 'BUYER' &&
        type != 'return' &&
        type != 'claim' &&
        paymentMethodText && (
          <BorderElement
            txtType="bold"
            title={paymentMethodText}
            leftLabel="Payment Method"
            topBorder={0}
            icon={
              cardDetail?.data?.brand
                ? cardDetail?.data?.brand.toLowerCase()
                : icon
            }
          />
        )}
    </View>
  );
};

export default ShippingStatus;
