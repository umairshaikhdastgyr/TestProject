import { StyleSheet } from 'react-native';
import { Fonts, Colors } from '#themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    backgroundColor: Colors.white,
  },
  headerRightContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  activeText: {
    color: Colors.active,
    fontFamily: Fonts.family.regular,
    fontWeight: '600',
    fontSize: Fonts.size.medium,
  },
  headerIcon: {
    width: 8,
    height: 8,
    marginLeft: 3,
    resizeMode: 'contain',
  },
  bottomButtonContainer: {
    height: 100,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 3,
    shadowOpacity: 0.05,
  },
  activeBtn: {
    backgroundColor: Colors.primary,
  },
  inactiveBtn: {
    backgroundColor: Colors.inactiveShape,
  },
});
