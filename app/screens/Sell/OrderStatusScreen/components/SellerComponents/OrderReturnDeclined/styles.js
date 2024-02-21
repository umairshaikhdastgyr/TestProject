import { Fonts } from '#themes';
import fonts from '#themes/fonts';
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
  orderStatusText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowItemsContainer: {
    paddingHorizontal: 20,
  },
  footerInfo: {
    fontFamily: fonts.family.Regular,
    fontSize: 15,
    marginBottom: 20,
    marginTop: 10,
  },
  orderStatusContainer: {
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculationContainer: {
    marginTop: 25,
  },
  trackContatiner: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 35,
    paddingHorizontal: 50,
  },
  trackText: {
    fontFamily: Fonts.family.Regular,
    fontSize: 13,
    color: '#969696',
    textDecorationLine: 'underline',
  },
});
