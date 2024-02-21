import { StyleSheet } from 'react-native';
import { Fonts } from '#themes';

const styles = StyleSheet.create({
  leftText: {
    fontSize: 15,
    color: '#313334',
    fontFamily: Fonts.family.semiBold,
  },
  rightText: {
    fontFamily: Fonts.family.regular,
    fontSize: 13,
    color: '#313334',
  },
  appleIcon: {
    width: 19,
    height: 22,
    marginLeft: 5,
  },
  rightContentIcon: {
    marginRight: 5,
  },
});

export default styles;
