import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from '#components';
import { styles } from './styles';

export const IDPhotoView = ({ idPhoto, onTakePhoto, onSelectPhoto }) => {
  return (
    <>
      <Text style={styles.descriptionText} numberOfLines={3}>
        {'To confirm your identity we need you to send us a photo of an ID (driver license, passport, visa, etc)'}
      </Text>
      {idPhoto && <Image style={styles.photoImg} source={{ uri: idPhoto.path }} />}
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
