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
  trackText: {
    fontFamily: Fonts.family.Regular,
    fontSize: 13,
    textDecorationLine: 'underline',
    color: '#969696',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 20,
  },
  prepaidBox: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    paddingVertical: 20,
    marginBottom: 30,
    width: '100%',
  },
  prepaidReturnAddressWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shipFromText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    alignSelf: 'flex-start',
  },
  returnAddressBox: { flex: 1, paddingLeft: 20 },
  enterAddressTxt: {
    fontFamily: Fonts.family.mediumItalic,
    fontSize: 15,
    color: '#999999',
  },
  returnAddressName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 15,
  },
  returnAddressTxt: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
  },
  returnAddressRightIcon: {
    flexDirection: 'row',
  },
});
