import { StyleSheet } from 'react-native';
import { Colors } from '#themes';

export default StyleSheet.create({
  heading: {
    marginBottom: 16,
    paddingLeft: 16,
  },
  headingVehicle: {
    paddingTop: 40,
  },
  categoryContainer: {
    paddingTop: 30,
    paddingBottom: 32,
  },
  categoryContainerNoTop: {
    paddingBottom: 32,
  },
  categoriesList: {
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 5,
    },
    elevation: 3,
    shadowOpacity: 0.06,
    backgroundColor: Colors.backgroundGrey,
  },
  categoriesScroll: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
  },
  scrollViewTiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: 10,
  },
  scrollViewTilesPaddinTop: {
    paddingTop: 24,
  },
  typeTag: {
    marginRight: 24,
    marginBottom: 24,
  },
  typeTagEven: {
    marginRight: 0,
  },
  tabs: {
    paddingLeft: 32,
  },
  tab: {
    marginRight: 28,
  },
});
