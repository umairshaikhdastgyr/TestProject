import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from '#components';
import { flex, paddings } from '#styles/utilities';
import { Colors, Fonts } from '#themes';
import { isIphoneX } from 'react-native-iphone-x-helper';

const FooterAction = ({ mainButtonProperties, secondaryButtonProperties, navigation, isVerify }) => (
  <View style={[styles.container,{paddingBottom: secondaryButtonProperties ? isIphoneX() ? 30 : 16 : 31}]}>
    {secondaryButtonProperties && (
      <Button
        label={secondaryButtonProperties.label}
        subLabel={secondaryButtonProperties.sublabel}
        size="large"
        theme="secondary"
        showLoading={secondaryButtonProperties.showLoading}
        disabled={secondaryButtonProperties.disabled}
        onPress={secondaryButtonProperties.onPress}
        style={[{ flex: 1 }, { marginRight: 5 }]}
      />
    )}
    <Button
      label={mainButtonProperties.label}
      subLabel={mainButtonProperties.subLabel}
      size="large"
      showLoading={mainButtonProperties.showLoading}
      fullWidth={!secondaryButtonProperties}
      disabled={mainButtonProperties.disabled}
      onPress={mainButtonProperties.onPress}
      style={[
        { flex: mainButtonProperties.label == 'Confirm Shipment' ? 0 : 1 },
        mainButtonProperties.mainButtonStyle,
        secondaryButtonProperties !== null ? { marginLeft: 5 } : '',
      ]}
    />
   {isVerify && <Text onPress={() => navigation.navigate("VerifyUserId")} style={styles.verify_text}>VERIFY YOUR ACCOUNT</Text>}
  </View>
);

FooterAction.defaultProps = {
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
    flexWrap: 'wrap',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 54,
    elevation: 10,
    borderBottomWidth: 0,
  },
  verify_text: {
    fontSize: Fonts.size.large,
    fontFamily: Fonts.family.regular,
    fontWeight: "500",
    backgroundColor: "white",
    textAlign: "center",
    width: "100%",
    textDecorationLine: "underline",
    color: Colors.primary,
    paddingTop: 10,
  },
});

export default FooterAction;
