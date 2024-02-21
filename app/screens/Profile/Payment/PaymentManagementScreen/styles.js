import { StyleSheet, PixelRatio } from 'react-native';
import { Metrics, Colors, Fonts } from '#themes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBackground,
  },
  headerContainer: {
    minHeight: Metrics.height / 5.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyText: {
    fontSize: Fonts.size.h3,
    fontFamily: Fonts.family.semiBold,
    color: Colors.active,
    textAlign: 'center',
    marginTop:30
  },
  pendingText: {
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.family.medium,
    color: Colors.red,
    textAlign: 'center',
    marginTop:30
  },
  listHeader: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  noDataContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft:20,
    marginTop:10
  },
  headerText: {
    ...Fonts.style.headerText,
    color: Colors.black,
  },
  subContentText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    marginLeft:10
  },
  editIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  editIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  sectionContainerStyle: {
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: Colors.lightGrey,
  },
  subListText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
  },
  subListText1: {
    ...Fonts.style.homiTagText,
    color: Colors.black,
    marginHorizontal: 20,
  },
  subListText2: {
    ...Fonts.style.homiTagText,
    color: Colors.black,
    marginHorizontal: 20,
    marginTop: 20,
  },
  subListContainer: {
    height: 40,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  paymentMethodItemContainer: {
    height: 100,
    backgroundColor: Colors.white,
    elevation: 3,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentListSubContainer: {
    marginLeft: 20,
    height: 50,
    justifyContent: 'space-between',
    alignItems:'center',
    flexDirection:'row'
  },
  separator: {
    height: 10,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  btnContainer: {
    backgroundColor: Colors.primary,
  },
  mainContentContainer: {
    //marginBottom: 100
  },
  warningText: {
    paddingHorizontal: 20,
    color: 'red',
    fontFamily: Fonts.family.regular,
    textAlign: 'center',
  },
});
