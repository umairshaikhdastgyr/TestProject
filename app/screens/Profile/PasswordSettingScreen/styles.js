import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '#themes';
import { flex, paddings } from '#styles/utilities';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  mainContentContainer: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    ...paddings['p-3'],
    paddingBottom: 0,
  },
  label: {
    fontFamily: Fonts.family.regular,
    fontSize: 15,
    color: '#313334',
    marginBottom: 15,
  },
  input: {
    fontFamily: Fonts.family.regular,
    fontSize: 13,
  },
  hintText: {
    ...Fonts.style.detailText,
    color: Colors.active,
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 15,
    width: '100%',
  },
  footerContainer: {
    ...flex.directionRow,
    ...paddings['px-3'],
    ...paddings['py-4'],
    ...flex.justifyContentCenter,
    ...flex.alignItemsCenter,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 54,
    elevation: 24,
  },
});
