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
    borderBottomWidth: 0.5,
    borderBottomColor: '#969696',
    flex:1 ,
    justifyContent:'flex-end',
    width:'90%'
  },
  footerInfo: {
    fontFamily: fonts.family.Regular,
    fontSize: 15,
    marginBottom: 20,
    marginTop: 10,
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
    fontFamily: Fonts.family.Regular,
    fontSize: 13,
    color: '#969696',
    fontWeight: '600',
  },
});
