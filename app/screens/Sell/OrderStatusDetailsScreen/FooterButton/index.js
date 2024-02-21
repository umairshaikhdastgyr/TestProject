import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from './Button';
import { flex, paddings } from '#styles/utilities';

const FooterButton = ({
  mainButtonProperties,
  secondaryButtonProperties,
  mainButtonStyle,
  type,
}) => (
  <View style={styles.container}>

    <Button
      label={mainButtonProperties.label}
      subLabel={mainButtonProperties.subLabel}
      size="large"
      theme={type === 'shipment' ? 'secondary' : 'primary'}
      fullWidth={!secondaryButtonProperties}
      disabled={mainButtonProperties.disabled}
      onPress={mainButtonProperties.onPress}
      numberOfLine={2}
      style={[
        { flex: 1 },

        secondaryButtonProperties !== null ? { marginRight: 5 } : '',
      ]}
    />

    {secondaryButtonProperties && (
    <Button
      label={secondaryButtonProperties.label}
      subLabel={secondaryButtonProperties.sublabel}
      size="large"
      theme={type === 'shipment' ? 'primary' : 'secondary'}
      disabled={secondaryButtonProperties.disabled}
      onPress={secondaryButtonProperties.onPress}
      numberOfLine={2}
      style={[
        { flex: 1 },
        { marginLeft: 5 }]}
    />
    )}
  </View>
);

FooterButton.defaultProps = {
  mainButtonProperties: {
    label: '',
    subLabel: '',
    disabled: false,
    onPress: () => {},
  },
};

const styles = StyleSheet.create({
  container: {
    ...flex.directionRow,
    ...paddings['p-3'],
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 54,
    elevation: 10,
    borderBottomWidth: 0,
  },
});

export default FooterButton;
