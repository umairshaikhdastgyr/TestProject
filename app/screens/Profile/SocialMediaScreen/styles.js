import { StyleSheet } from 'react-native';
import { Fonts, Colors, Metrics } from '#themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  descriptionText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    lineHeight: 22,
  },
  toggleContainer: {
    flexDirection: 'row',
    height: 55,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
  },
  switchContainer: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  activeItemText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    fontWeight: '500',
  },
});
