import { StyleSheet } from 'react-native';

import { Fonts, Colors } from '#themes';

export default StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button__text: {
    ...Fonts.style.buttonText,
    fontFamily: Fonts.family.semiBold,
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  button__icon: {
    marginRight: 4,
    marginTop: -1,
  },
  large: {
    height: 52,
    borderRadius: 10,
  },
  'button__text-large': {
    fontSize: 16,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  'button__text-secondary': {
    color: Colors.primary,
  },
  'secondary-active': {
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.active,
  },
  'button__text-secondary-active': {
    color: Colors.active,
  },
  fullWidth: {
    width: '100%',
  },
  'secondary-rounded': {
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.active,
    borderRadius: 20,
  },
  'button__text-secondary-rounded': {
    color: Colors.black,
  },
  'button__icon-secondary-rounded': {
    marginRight: 8,
    marginTop: -2,
  },
  subLabel: {
    height: 52,
  },
  subLabelText: {
    textAlign: 'center',
    fontFamily: Fonts.family.semiBold,
    fontWeight: '600',
    fontSize: 10,
    color: 'white',
    marginTop: 4,
  },
});
