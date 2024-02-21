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
  contentItemConainer: {
    flex: 1,
    height: 220,
    borderRadius: 8,
    flexDirection: 'column',
    margin: 7.5,
    backgroundColor: 'white',
    elevation: 6,
  },
  itemHeaderText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  contentItemHeader: {
    paddingVertical: 12,
    backgroundColor: '#00BDAA',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  contentIconContainer: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  itemDetailText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    color: '#969696',
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
  },
  itemDetailContainer: {
    paddingHorizontal: 10,
  },
  addressDetailContainer:{
  },
  shipping_info_container: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  shipping_info_header: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 15,
  },

  shipping_info_detail: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    marginBottom: 25,
    lineHeight: 18,
    textAlign:'center'
  },

  shipping_detail_text: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    //  marginBottom: 28,
    lineHeight: 18,
    textAlign:'center'
  },

  payment_detail: {
    paddingTop: 24,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#E8E8E8',
    borderBottomColor: '#E8E8E8',
    marginTop: 14,
  },

  shipping_detail_container: {
    marginVertical: 37,
  },

  info_header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom:15,
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
    justifyContent: 'center',
    alignItems: 'flex-end',
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
    // marginBottom: 38,
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
    maxWidth: (width - 30 - 75),
  },
  titleText: {
    marginBottom: 5,
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    fontSize: 13,
    color: '#696969',
  },
  leftText: {
    fontFamily: 'Montserrat-Regular',
    // fontWeight: '600',
    fontSize: 14,
  },
  rightText: {
    fontFamily: 'Montserrat-Regular',
    // fontWeight: '600',
    fontSize: 13,
  },
  leftBoldText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
  },
  rightBoldText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
  },
  appleIcon: {
    width: 15.31,
    height: 19,
    marginLeft: 5,
  },

  arrowContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rightContentText: { marginLeft: 11 },
  rightContentIcon: {
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  moreIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  rightIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconContainer1: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  proposMapButton: {
    paddingHorizontal: 10,
    paddingVertical: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
    backgroundColor: '#FFF',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 10,
    elevation: 4,
    marginVertical: 35,
  },

  titleTextProduct:{
    fontFamily: 'Montserrat-Medium',
    fontWeight: '500',
    fontSize: 12,
    color: '#696969'
  }
});