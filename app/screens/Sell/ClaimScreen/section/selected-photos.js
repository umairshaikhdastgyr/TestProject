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

import { removeClaimPhotoFromList, removeReturnPhotoFromList } from '#modules/User/actions';
import { selectUserData } from '#modules/User/selectors';
import { useActions } from '#utils';
import { removeClaimImage } from '#services/apiUsers';

const { width } = Dimensions.get('window');

const SelectedPhotos = () => {
  const dispatch = useDispatch();
  /* Selectors */
  const { claimPhotosList } = useSelector(selectUserData());

  /* Actions */
  const actions = useActions({ removeClaimPhotoFromList });

  /* Methods */
  const removeSelectedPhoto = async (key,ind) => {
    const getKey = claimPhotosList[ind].Key
    try {
      const res = await removeClaimImage(getKey);
      if (res.data) {
        actions.removeClaimPhotoFromList(getKey);
        dispatch(
          removeReturnPhotoFromList(getKey),
        );
      }
    } catch (e) {}
  };

  return (
    <>
   {claimPhotosList.length > 0 && (
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentInset={{ right: 24 }}
          contentContainerStyle={{ paddingBottom: 24 }}>
          {claimPhotosList.map((photo, index) => (
            <View key={photo.Key} style={styles.photoTile}>
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
