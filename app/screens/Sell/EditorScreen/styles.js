import { StyleSheet } from 'react-native';
import { Colors } from '#themes';

export default StyleSheet.create({
  'main-container': {
    flex: 1,
  },
  'input-container': {
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
  },
  editorContainer: {
  	flex: 1,
  	borderColor: '#E8E8E8',
  	borderTopWidth: 1,
  },
  emptyContainer: {
  	flex: 1,
  	alignItems: 'center',
  	justifyContent: 'center',
  	marginHorizontal: 50,
  },
  addPhotosButton: {
    width: 250,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 35,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  }
});
