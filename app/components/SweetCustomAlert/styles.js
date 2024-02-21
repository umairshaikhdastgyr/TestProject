import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Fonts, Metrics } from '#themes';
import colors from '#themes/colors';


export const styles = StyleSheet.create({
  modalContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: (Dimensions.get('window').width - 30),
    backgroundColor: '#F6F6F6',
    borderRadius:10
  },
  modalTouchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
  	fontFamily: Fonts.family.semiBold,
  	color: '#313334',
  	fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
    paddingVertical: 20,

  },
  msgText: {
  	fontFamily: Fonts.family.Regular,
  	color: '#313334',
  	fontWeight: 'normal',
    fontSize: 13,
    textAlign: 'center',
  },
  msgTextBold: {
    fontFamily: Fonts.family.semiBold,
    fontWeight: '600',
  },

  topContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  exitBt: {
    padding: 15,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingTop: 0,
    paddingBottom: 10,
    flexDirection: 'column',
  },
  btnsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
    marginBottom: 0,
    marginTop: 10,
  },
  doneOpacity: {
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  shareOpacity: {
    paddingVertical: 15,
    marginTop:15,
    paddingHorizontal: 30,
    borderWidth:1,
    borderColor:colors.primary,
    borderRadius:10
  },
  doneText: {
    fontFamily: Fonts.family.semiBold,
    fontWeight: '600',
    color: '#969696',
    fontSize: 16,
    textAlign: 'center',
  },
  textContainer: {
    marginHorizontal: 5,
    marginBottom: 30,
  },
  btContainer: {
    minHeight: 100,
    backgroundColor: '#ffffff',
    width: (Dimensions.get('window').width - 90) / 3,
    // height: (Dimensions.get('window').width - 90)/3 + 3,
    borderRadius: 8,
    marginHorizontal: 5,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 3,
    elevation: 3,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btText: {
    fontFamily: Fonts.family.semiBold,
    fontWeight: '600',
    color: '#313334',
    fontSize: 13,
    textAlign: 'center',
  },
  btIcon: {
    tintColor: '#00BDAA',
    marginVertical: 10,
  },
  shareContainer: {
    marginTop: 12,
    minHeight: 30,
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 8,
    marginHorizontal: 5,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 3,
    elevation: 3,
    // padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
