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
  trackContatiner: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 35,
  },
  trackText: {
    fontFamily: Fonts.family.Regular,
    fontSize: 13,
    textDecorationLine: 'underline',
    color: '#969696',
    fontWeight: '600',
  },
  statusText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    fontWeight: '600',
  },
  statusText2: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: '#00BDAA',
  },
});
