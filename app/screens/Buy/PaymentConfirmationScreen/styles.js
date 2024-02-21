import { StyleSheet, Dimensions } from 'react-native';
import { Fonts } from '#themes';

const { width } = Dimensions.get('window');
export default StyleSheet.create({
  'main-container': {
    flex: 1,
  },
  'input-container': {
    paddingVertical: 10,
  },
  currencyContainer: {
    marginTop: 20,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  bottomContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    // backgroundColor: 'red',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems:'flex-start',
    justifyContent:'flex-start'
  },
  leftContainer: {
    flex: 1,
  },
  topContainer: {
    height: 120,
    width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -20,
    marginBottom: 25,
    // backgroundColor: 'green',
  },
  imgsContainer: {
    paddingRight: 15,
  },
  imgContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    elevation:1
  },
  imgElement: {
    width: 60,
    height: 60,
  },
  textsContainer: {
    flexDirection: 'column',
    maxWidth: width - 30 - 95,
    // flex: 1,
  },
  leftText: {
    fontFamily: 'Montserrat-Regular',
    // fontWeight: '600',
    fontSize: 15,
  },
  rightText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
  },
  leftBoldText: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 15,
  },
  rightBoldTextAnother: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 14,
  },
  rightBoldText: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 14,
   
  },
  appleIcon: {
    width: 15.31,
    height: 19,
    marginLeft: 5,
  },
  titleText: {
    marginBottom: 5,
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 15,
  },
  titleTextProduct: {
    marginTop: 5,
    fontFamily: 'Montserrat-Medium',
    fontWeight: '500',
    fontSize: 12,
    color:'#696969'
  },
  arrowContainer: {
    width: 30,
    justifyContent: 'flex-end',
    marginRight:-5,
    alignItems: 'flex-end',
  },
  rightContentText: { marginLeft: 11 },
  rightContentIcon: {
    // width: 40,
    // justifyContent: 'center',
  },
});
