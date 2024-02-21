import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts } from '#themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBackground,
  },
  headerContainer: {
    height: 80,
    marginTop: 30,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    justifyContent: 'space-around',
  },
  headerContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headerText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
  },
  methodItemContainer: {
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.grey,
  },
  mainItemContainer: {
    justifyContent: 'space-around',
  },
  blackBoldText: {
    ...Fonts.style.headerText,
    color: Colors.black,
    marginBottom: 5,
  },
  listContainer: {
    paddingHorizontal: 20,
    flex: 1,
    marginTop: 40,
  },
});
