import { Fonts } from '#themes';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  dash_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  shippingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  orderStatusContainer: {
    marginHorizontal: 20,
  },
  calculationContainer: {
    marginTop: 25,
  },
  orderStatusText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackText: {
    fontFamily: Fonts.family.regular,
    fontSize: 13,
    color: '#969696',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 38,
  },
});
