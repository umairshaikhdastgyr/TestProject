import { Fonts } from '#themes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 13,
  },
  leftContainer: {
    flex: 1,
  },
  leftText: {
    fontFamily: Fonts.family.regular,
    fontSize: 14,
  },
  leftBoldText: {
    fontFamily: Fonts.family.semiBold,
    fontSize: 14,
  },
  rightBoldText: {
    fontFamily: Fonts.family.semiBold,
    fontSize: 13,
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rightText: {
    fontFamily: Fonts.family.regular,
    fontSize: 13,
  },
});

export default styles;
