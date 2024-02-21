import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Text,
} from 'react-native';
import { Icon } from '#components';

import { removeClaimPhotoFromList, removeReturnPhotoFromList, setClaimPhotoList, setReturnPhotoList } from '#modules/User/actions';
import { selectUserData } from '#modules/User/selectors';
import { removeClaimImage } from '#services/apiUsers';
import { setPhotoList } from '#modules/Sell/actions';

const { width } = Dimensions.get('window');

const SelectedPhotos = () => {
  const dispatch = useDispatch();
  /* Selectors */
  const { photosList, claimPhotosList } = useSelector(selectUserData());
  /* Actions */

  /* Methods */
  /* Methods */
  const removeSelectedPhoto = async (key,ind) => {
    const getKey = claimPhotosList[ind].Key
    try {
      dispatch(
        removeReturnPhotoFromList(getKey),
      );
      dispatch(
        removeClaimPhotoFromList(getKey),
      );
      await removeClaimImage(getKey);
      if (claimPhotosList?.length == 1) {
        dispatch(setPhotoList([]));
        dispatch(setClaimPhotoList([]));
        dispatch(setReturnPhotoList([]));
      }
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <>
    {photosList.length > 0 && (
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentInset={{ right: 24 }}
          contentContainerStyle={{ paddingBottom: 24 }}>
          {photosList.map((photo, index) => (
            <View key={photo.key} style={styles.photoTile}>
              <View style={styles.photoContainer}>
                <Image source={{ uri: photo.url }} style={styles.image} />
                {index === 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      width: width / 5,
                      borderBottomLeftRadius: 8,
                      borderBottomRightRadius: 8,
                      paddingVertical: 2,
                      bottom: 0,
                      backgroundColor: 'rgba(255,255,255, 0.7 )',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#000',
                        textAlign: 'center',
                        fontSize: 13,
                        fontFamily: 'Montserrat-Regular',
                      }}>
                      Cover
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.closeBtnContainer}
                onPress={() => removeSelectedPhoto(photo.Key,index)}>
                <View style={styles.closeIconBtn}>
                  <Icon icon="close_red" style={styles.closeIcon} />
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 16,
  },
  heading: {
    marginBottom: 16,
    paddingLeft: 16,
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

export default SelectedPhotos;
