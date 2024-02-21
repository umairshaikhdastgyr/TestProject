import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from '#components';
import { styles } from './styles';

export const UserPhotoView = ({ userPhoto, onTakePhoto, onSelectPhoto }) => {
  return (
    <>
      <Text style={styles.descriptionText} numberOfLines={3}>
        {'Great, now the only thing left is a photo of yourself, different from the profile picture. Must match with the ID photo.'}
      </Text>
      {userPhoto && (
        <Image style={styles.photoImg} source={{ uri: userPhoto.path }} />
      )}
      <View style={styles.mainContainer1}>
        <TouchableOpacity
          style={styles.takePhotoBtnContainer}
          onPress={onTakePhoto}
        >
          <Icon icon="camera" color="active" style={styles.cameraIcon} />
          <Text style={styles.blackText}>Take Photo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mainContainer2}>
        <TouchableOpacity onPress={onSelectPhoto}>
          <Text style={styles.activeText}>Select from my photos</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
