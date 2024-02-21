import { StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics } from '#themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  descriptionText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    textAlign: 'center',
    marginVertical: Metrics.height / 15,
  },
  verificationCodeContainer: {
    height: 130,
    backgroundColor: Colors.lightGrey,
  },
  codeInputContainer: {},
  codeInput: {
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inactiveShape,
    height: 50,
    marginHorizontal: 20,
  },
  smsLabel: {
    ...Fonts.style.linkText,
    color: Colors.inactiveText,
    textAlign: 'center',
    marginTop: 10,
  },
  bottomBtnContainer: {
    height: 100,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  activeText: {
    color: Colors.active,
    fontSize: Fonts.size.medium,
    lineHeight: 16,
    fontFamily: Fonts.family.semiBold,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  resendBtnContainer: {
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    bottom: 130,
    right: 0,
  },
});
