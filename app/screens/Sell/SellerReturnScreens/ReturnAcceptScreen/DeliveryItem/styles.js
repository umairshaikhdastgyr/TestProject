import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '#themes';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 20,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
  },
  leftContainer: {
    width: 40,
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
  },
  arrowContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  titleText: {
    marginBottom: 5,
  },
  checkedView: {
    width: 20,
    height: 20,
    backgroundColor: '#00BDAA',
  },

  uncheckedView: {
    width: 20,
    height: 20,
    borderColor: '#969696',
    borderWidth: 1,
  },
  childContainer: {
    paddingVertical: 20,
    flexDirection: 'row',
  },
  freeContainer: {
    width: 100,
    justifyContent: 'center',
  },
  botomLine: {
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
  },
  childCustomContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
  },
  objContainer: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.33)',
    marginHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 7,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
  },
  objContainerSelected: {
    borderRadius: 4,
    marginHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 7,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    backgroundColor: '#ffffff',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  tintStyle: {
    tintColor: '#00BDAA',
  },
  providerContainer: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  costContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  inputContainer: {
    marginHorizontal: 20,
    marginVertical: 18,
  },

  inputLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    color: '#313334',
    fontWeight: '600',
    marginBottom: 17,
  },
  uploadLabelText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: '#313334',
    fontWeight: '500',
    marginLeft: 5,
  },
  uploadLabelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.active,
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
  },
  inputText: {
    fontSize: 15,
    color: '#000000',
    fontFamily: Fonts.family.regular,
    borderBottomWidth: 1,
    borderBottomColor: '#B9B9B9',
    paddingBottom: 12,
    paddingLeft: 0,
  },
  carrierInputText: {
    fontSize: 15,
    color: '#000000',
    fontFamily: Fonts.family.regular,
  },
  carrierInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#B9B9B9',
    paddingBottom: 0,
    paddingLeft: 0,
  },

  carrierInputSelect: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: '#313334',
    fontWeight: '600',
    textDecorationLine: 'underline',
    margin: 10,
  },
  redText: {
    ...Fonts.style.homiTagText,
    color: Colors.red,
  },
});
