import { Fonts } from '#themes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalOuterContainer: {
    backgroundColor: '#00000090',
    flex: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 15,
    padding: 10,
    paddingBottom: 20,
    paddingTop: 0,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'gray',
  },
  modalTouchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  titleText: {
    fontFamily: Fonts.family.semiBold,
    color: '#313334',
    fontWeight: '600',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  msgText: {
    fontFamily: Fonts.family.regular,
    color: '#313334',
    fontWeight: '400',
    fontSize: 13,
    marginBottom: 5,
    textAlign: 'center',
  },
  chatSellerLbl: {
    fontFamily: Fonts.family.regular,
    color: '#00BDAA',
    fontWeight: '600',
    fontSize: 13,
    // marginBottom: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
