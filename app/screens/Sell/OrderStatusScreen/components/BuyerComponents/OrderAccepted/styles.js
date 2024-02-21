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
    fontFamily: Fonts.family.Regular,
    fontSize: 13,
    textDecorationLine: 'underline',
    color: '#969696',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
});
