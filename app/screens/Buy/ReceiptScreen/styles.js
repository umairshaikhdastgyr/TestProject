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
    justifyContent: 'flex-end',
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 5,
  },
  leftContainer: {
    flex: 1,
  },
  topContainer: {
    height: 120,
    width: (width - 30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    marginBottom: 0,
  },
  imgsContainer: {
    paddingRight: 15,
  },
  imgContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    elevation:1,
    overflow: 'hidden',
  },
  imgElement: {
    width: 60,
    height: 60,
  },
  textsContainer: {
    flexDirection: 'column',
    maxWidth: (width - 30 - 75),
  },
  leftText: {
    fontFamily: 'Montserrat-Regular',
    // fontWeight: '600',
    fontSize: 15,
  },
  rightText: {
    fontFamily: 'Montserrat-Regular',
    // fontWeight: '600',
    fontSize: 13,
  },
  leftBoldText: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 15,
  },
  rightBoldText: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 13,
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
  arrowContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rightContentText: { marginLeft: 11 },
  rightContentIcon: {
    // width: 40,
    // justifyContent: 'center',
  },
  titleTextProduct:{
    fontFamily: 'Montserrat-Medium',
    fontWeight: '500',
    fontSize: 12,
    color: '#696969'
  }
});
