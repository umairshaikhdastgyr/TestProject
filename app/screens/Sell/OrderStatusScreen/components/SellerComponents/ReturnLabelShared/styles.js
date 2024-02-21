import { Colors, Fonts } from '#themes';
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
    paddingTop: 12,
    fontFamily: fonts.family.Regular,
    fontSize: 13,
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
    color: Colors.gray,
  },
  trackText: {
    textDecorationLine: 'underline',
    fontSize: 13,
    color: '#969696',
    width: '100%',
    textAlign: 'center',
    fontFamily: Fonts.family.Regular,
  },
});
