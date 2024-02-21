import React from 'react';
import { useSelector } from 'react-redux';

import { StyleSheet, View, Dimensions } from 'react-native';
import { Heading, Divider } from '#components';

import { selectSellData } from '#modules/Sell/selectors';
import { removePhotoFromList, setPhotoList } from '#modules/Sell/actions';
import { useActions } from '#utils';
import HomitagDraggableFlatList from '../../PhotosScreen/components/draggable-flatlist';
import { flex } from '#styles/utilities';

const { width } = Dimensions.get('window');

const SelectedDraggblePhotos = ({ navigation }) => {
  /* Selectors */
  const { photosList } = useSelector(selectSellData());

  /* Actions */
  const actions = useActions({ removePhotoFromList, setPhotoList });
  /* Methods */
  const removeSelectedPhoto = index => {
    actions.removePhotoFromList({ index });
  };
  const setPicSelected = data => {
    actions.setPhotoList(data);
  };
  return (
    photosList.length > 0 && (
      <View style={styles.container}>
        <View style={[styles.heading, flex.directionRow]}>
          <Heading type="bodyText" bold>
            Images
          </Heading>

          <Heading type="bodyText" bold>
            *
          </Heading>
        </View>

        <HomitagDraggableFlatList
          data={photosList}
          navigation={navigation}
          removePic={removeSelectedPhoto}
          setPicSelected={setPicSelected}
          style={{ paddingLeft: 2, marginTop: 13 }}
          screen="mainscreen"
        />

        <Divider style={styles.divider} />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 16,
    height: 160,
  },
  heading: {
    // marginBottom: 16,
    paddingLeft: 16,
    //  height: 50,
  },
  photoTile: {
    height: width / 5 + 10,
    width: width / 5 + 10,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginLeft: 20,
  },
  photoContainer: {
    height: width / 5,
    width: width / 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 2, height: 2 },
    elevation: 2,
    backgroundColor: '#fff',
    marginRight: 12,
    marginTop: 12,
  },
  image: {
    width: width / 5,
    height: width / 5,
    borderRadius: 8,
  },
  closeIcon: {
    width: 10,
    height: 10,
  },
  closeBtnContainer: {
    position: 'absolute',
    height: 24,
    width: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 4, height: 5 },
    elevation: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    marginHorizontal: 16,
  },
});

export default SelectedDraggblePhotos;
