import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Fonts, Metrics } from '#themes';
import { flex, margins, paddings } from '#styles/utilities';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBackground,
  },
  scrollContainer: {
    marginBottom: 100,
  },
  mainContentContainer: {
    
    marginBottom: 20,
  },
  bankTypeContainer: {
    marginVertical: 30,
    justifyContent: 'space-between',
  }, imgStripe: {
    width: 100,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  blackText: {
    color: Colors.black,
    fontFamily:Fonts.family.regular,
    fontSize:12
  },
  redText: {
    ...Fonts.style.homiTagText,
    color: Colors.red,
  },
  input: {
    ...Fonts.style.homiTagText,
    color: Colors.black,
    height: 35,
    borderBottomWidth: 1,
    borderBottomColor: Colors.blacktoolight,
    paddingLeft:0,
    fontSize:15
  },
  input1: {
    ...Fonts.style.homiTagText,
    color: Colors.black,
    height: 35,
    borderBottomWidth: 1,
    borderBottomColor: Colors.blacktoolight,
    paddingLeft:0,
    fontSize:15,
    flex: 1,
  },
  
  inputsContainer: {
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  bankTempImg: {
    height: 230,
    width: Metrics.width - 40,
    resizeMode: 'contain',
  },
  grayText: {
    ...Fonts.style.homiBodyText,
    color: Colors.inactiveText,
    marginVertical: 20,
  },
  bottomBtnContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  btnContainer: {
    backgroundColor: Colors.primary,
  },
  btnContainer1: {
    backgroundColor: Colors.inactiveShape,
  },
  buttonContainer: {
    ...flex.directionRow,
    ...paddings['p-3'],
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 54,
    elevation: 10,
  },
  blackBoldText: {
    ...Fonts.style.headerText,
    color: Colors.black,
  },
  checkContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  check: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.black,
    marginRight: 10,
  },
  check1: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.active,
    marginRight: 10,
    backgroundColor: Colors.active,
  },
  lockIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 5,
    right: 0,
    position:'absolute',
    bottom: 4,
  },
  lockIconn: {
    width: 20,
    height: 25,
    resizeMode: 'contain',
    marginRight: 5,
    right: 0,
    position:'absolute',
    bottom: 6,
  },
  lockIcon2: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 5,
    right: 0,
  },
  imgStripe: {
    width: 100,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  bottomDescriptionContainer:{
    flexDirection:'row',
    alignItems:'flex-end',
    flex:1,
    justifyContent:'center'
  },
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
    fontFamily: 'Montserrat-Regular',
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
  },
});
