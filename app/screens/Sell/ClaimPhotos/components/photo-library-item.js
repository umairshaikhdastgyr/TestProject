import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import { Icon } from '#components';

const PhotoLibraryItem = ({ photo, onPress, picsSelected }) => {
  /* Selectors */
  const selected = picsSelected.find(
    photoInList => photoInList.uri === photo.node.image.uri,
  );

  return (
    <TouchableOpacity onPress={!selected && onPress}>
      <Image style={styles.image} source={{ uri: photo.node.image.uri }} />
      {selected && (
        <View style={styles.selected}>
          <Icon icon="check" color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  image: {
    width: width / 5,
    height: width / 5,
  },
  selected: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default PhotoLibraryItem;
