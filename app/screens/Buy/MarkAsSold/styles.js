import { StyleSheet } from 'react-native';
import { Fonts } from '#themes';

export default StyleSheet.create({
  'main-container': {
    flex: 1,
  },
  'input-container': {
    paddingVertical: 10,
  },
  currencyContainer: {
    marginTop: 20,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  listHeader: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 15,
    fontFamily: Fonts.family.bold,
    color: '#313334',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  subListText: {
    fontSize: 13,
    fontFamily: Fonts.family.regular,
    color: '#313334',
  },
  subListTextSelected: {
    fontFamily: Fonts.family.semiBold,
    color: '#00bdaa',
  },
  subListContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    width: '100%',
  },
  checkIcon: {
    paddingRight: 20,
  },
  sectionContainerStyle: {
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingVertical: 1,
    marginHorizontal: 20,
  },
});
