import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '#themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  itemSubContainer: {
    height: 40,
    justifyContent: 'space-between',
  },
  imgContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
    overflow: 'hidden',
  },
  followerImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  blackText: {
    fontSize: Fonts.size.large,
    fontFamily: Fonts.family.medium,
    color: Colors.black,
    lineHeight: 18,
  },
  greyText: {
    ...Fonts.style.homiTagText,
    color: Colors.inactiveText,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    top: 20,
  },
  emptyState: {
    marginBottom: 24,
  },
  iconStyle: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  emptyContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    marginBottom: 80,
    marginTop: 20,
  },
});
