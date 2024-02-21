import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Fonts, Metrics } from '#themes';


export const styles = StyleSheet.create({
  modalContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: Dimensions.get('window').width - 70,
    backgroundColor: '#F6F6F6',
    borderRadius:10,
    overflow: 'hidden'
  },

  titleText: {
    fontFamily: Fonts.family.semiBold,
    color: '#313334',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
    width: 250,
  },

  topContainer: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  btContainer: {
    backgroundColor: '#ffffff',
    width: 115,
    height: 135,
    // height: (Dimensions.get('window').width - 90)/3 + 3,
    borderRadius: 8,
    marginHorizontal: 10,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 3,
    elevation: 3,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  btIcon: {
    tintColor: '#313334',
    marginVertical: 10,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    fontSize: 15,
    color: '#313334',
    textAlign: 'center',
  },
  btnContainer: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  contentContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contentHeaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#969696',
    width: 115,
    height: 40,
    marginTop: -20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  contentHeaderTxt: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  contentAreaContainer: {
    width: 105,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentAreaText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 10,
    color: '#969696',
    textAlign: 'center',
  },
});
