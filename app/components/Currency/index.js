import React from 'react';

import { StyleSheet, Text } from 'react-native';
import { Fonts, Colors } from '#themes';

const Currency = ({ value, style, size, bold }) => (
  <>
    {value !== null && (
      <Text style={[styles.currency, styles[size], style, bold && styles.bold]}>
        ${value ? parseFloat(value).toFixed(2) : ' -'}
        {/* {Number(value)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} */}
      </Text>
    )}
    {value === null && (
      <Text style={[styles.currency, styles[size], style, bold && styles.bold]}>
        $ -
      </Text>
    )}
  </>
);

Currency.defaultProps = {
  size: 'medium',
};

const styles = StyleSheet.create({
  currency: {
    ...Fonts.style.homiTagText,
    color: Colors.active,
    lineHeight: 16,
  },
  medium: {
    fontSize: 13,
    fontFamily: Fonts.family.medium,
    fontWeight: '500',
  },
  large: {
    fontSize: 18,
    fontFamily: Fonts.family.semiBold,
    fontWeight: '600',
    lineHeight: 22,
  },
  'x-large': {
    fontSize: 24,
    fontFamily: Fonts.family.semiBold,
    fontWeight: '600',
    lineHeight: 29,
  },
  bold: {
    fontFamily: Fonts.family.semiBold,
    fontWeight: '500',
  },
});

export default Currency;
