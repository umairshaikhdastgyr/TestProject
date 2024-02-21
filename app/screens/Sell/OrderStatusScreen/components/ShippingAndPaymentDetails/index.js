import React from 'react';
import { Fonts } from '#themes';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

const ShippingAndPaymentDetails = ({
  icon,
  title,
  onPress,
  txtType,
  titleTop,
  topBorder,
  leftLabel,
  txtLeftType,
  numberOfLines,
  textAlignRight,
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: titleTop ? 'flex-start' : 'center',
      width: '100%',
      paddingVertical: 22,
      borderColor: '#E8E8E8',
      borderBottomWidth: 1,
      borderTopWidth: topBorder,
    }}
  >
    <View style={{ flex: 0.45 }}>
      <Text style={[styles.leftText, txtLeftType && { fontWeight: '600' }]}>
        {leftLabel}
      </Text>
    </View>
    <View
      style={{ flex: 0.55, flexDirection: 'row', alignItems: 'center' }}
      onPress={onPress}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {icon && (
          <View style={styles.rightContentIcon}>
            {icon === 'visa' ||
            icon === 'mastercard' ||
            icon === 'discover' ||
            icon === 'amex' ||
            icon === 'paypal' ? (
              <FontAwesome
                style={{ top: -3 }}
                color="#3F5AA9"
                size={23}
                name={`cc-${icon}`}
              />
            ) : icon === 'googlepay' ? (
              <MaterialCommunityIcons
                style={{ top: 0 }}
                size={20}
                name="google"
              />
            ) : (
              <FontAwesome
                style={{ top: -3 }}
                color="#3F5AA9"
                size={23}
                name={'credit-card'}
              />
            )}
          </View>
        )}
        <View style={{ flexDirection: 'column' }}>
          {titleTop && (
            <Text
              style={[
                styles.rightText,
                { fontFamily: Fonts.family.semiBold },
                textAlignRight && { textAlign: 'right' },
              ]}
              numberOfLines={numberOfLines || 1}
            >
              {titleTop}
            </Text>
          )}
          <Text
            style={[
              styles.rightText,
              txtType && { fontFamily: Fonts.family.semiBold },
              textAlignRight && { textAlign: 'right' },
            ]}
            numberOfLines={numberOfLines || 1}
          >
            {title}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

ShippingAndPaymentDetails.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.string,
  onPress: PropTypes.func,
  txtType: PropTypes.any,
  titleTop: PropTypes.bool,
  topBorder: PropTypes.any,
  leftLabel: PropTypes.string,
  txtLeftType: PropTypes.any,
  numberOfLines: PropTypes.number,
  textAlignRight: PropTypes.bool,
};

export default ShippingAndPaymentDetails;
