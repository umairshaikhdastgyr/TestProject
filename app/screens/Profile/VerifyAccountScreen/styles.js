import { StyleSheet } from 'react-native';
import { Fonts, Metrics, Colors } from '#themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    height: 45,
    alignItems: 'center',
    marginBottom: 5,
  },
  personIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
  },
  itemText: {
    fontSize: Fonts.size.large,
    fontFamily: Fonts.family.semiBold,
    color: Colors.black,
    lineHeight: 18,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    bottom: 12.5,
  },
});
