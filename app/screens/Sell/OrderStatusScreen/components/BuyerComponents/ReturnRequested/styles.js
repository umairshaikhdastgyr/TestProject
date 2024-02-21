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
    marginTop: 40,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#E8E8E8',
    borderBottomColor: '#E8E8E8',
    marginHorizontal: 20,
  },
  calculationContainer: {
    marginTop: 25,
    marginBottom: 12,
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
  shippingInfoContainer: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    marginTop: 50,
  },
  shippingInfoHeader: {
    fontFamily: Fonts.family.semiBold,
    fontSize: 15,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  shippingInfoDetail: {
    fontFamily: Fonts.family.Regular,
    fontSize: 15,
    lineHeight: 18,
    textAlign: 'left',
  },
  shippingDetailContainer: {
    marginVertical: 37,
    marginHorizontal: 20,
  },
  shippingDetailText: {
    fontFamily: Fonts.family.regular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#313334',
  },
});
