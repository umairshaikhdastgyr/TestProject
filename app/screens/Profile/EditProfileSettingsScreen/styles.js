import { StyleSheet, Platform } from 'react-native';
import { Colors, Metrics, Fonts } from '#themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
  },
  userPhotoContainer: {
    alignSelf: 'center',
    marginTop: Metrics.height / 20,
  },
  userPhotoTempImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  mainButtonStyle: { backgroundColor: Colors.active },
  userPhotoImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  addImg: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  redText: {
    ...Fonts.style.homiTagText,
    color: Colors.red,
  },
  subPhotoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginHorizontal: 20,
    marginTop: Metrics.height / 30,
  },
  marginPhoneInput: {
    marginHorizontal: 20,
  },
  inputLabel: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    marginBottom: 5,
  },
  inputText: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: Fonts.family.regular,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    paddingVertical: 5,
    paddingLeft: 0,
  },
  phoneInputContainer: {
    paddingVertical: Platform.OS === 'ios' ? 5 : 0,
    paddingLeft: 0,
  },
  phoneInputText: {
    fontSize: Fonts.size.large,
    color: Colors.black,
    fontFamily: Fonts.family.regular,
    paddingLeft: 5,
  },
  rightIcon: {
    width: 25,
    height: 25,
    position: 'absolute',
    right: 0,
    bottom: 10,
  },
  markerIcon: {
    width: 25,
    height: 25,
  },
  rightDateIcon: {
    width: 18,
    height: 15,
    position: 'absolute',
    right: 0,
    bottom: 10,
  },
  activeText: {
    textDecorationLine: 'underline',
    lineHeight: 16,
    ...Fonts.style.linkText,
    color: Colors.active,
  },
  activeBtnContainer: {
    position: 'absolute',
    right: 0,
    bottom: 10,
  },
  bottomBtnContainer: {
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 4,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
});
