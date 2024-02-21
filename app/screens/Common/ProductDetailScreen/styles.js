import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  headerButton: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width,
    top: 50,
    left: 0,
    zIndex: 99999,
    backgroundColor: 'transparent',
  },
});

export default styles;
