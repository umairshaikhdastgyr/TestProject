import React, { useEffect, useState, useRef, FC } from 'react';
import { ActivityIndicator, Text, ScrollView, View, Image, TouchableOpacity, TextStyle } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import { Colors } from '#themes';

import { getGalleryPhotos } from '#services';

const ImagePicker = ({ onFinishImageSelection }) => {
  const cameraRef = useRef(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  /*eslint-disable */
  const [deviceType, setDeviceType] = useState('back');
  /*eslint-enable */
  const [images, setImages] = useState([]);
  const [useFlash, setUseFlash] = useState(false);

  /** Get the Device to access camera hardware */
  const devices = useCameraDevices();
  const device = devices[deviceType];

  /** Request Camera Permission fn */
  const requestCameraPermission = () => {
    Camera.requestCameraPermission()
      .then(permissionRequest => {
        if (permissionRequest == 'authorized') {
          setPermissionStatus(true);
        }
      })
      .catch(e => {
      });
  };
  /** Check if there is Camera Permission or ask for it */
  useEffect(() => {
    Camera.getCameraPermissionStatus()
      .then(permissionStatusResp => {
        if (permissionStatusResp == 'authorized') {
          setPermissionStatus(true);
        }
      })
      .catch(e => {
      });
  }, []);

  /** Trigger camera photo capture */
  const takePhoto = async () => {
    try {
      if (cameraRef.current == null) throw new Error('Camera ref is null!');
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: 'speed',
        flash: useFlash ? 'on' : 'off',
        skipMetadata: true,
      });
      if (photo.path) {
        setImages([...images, 'file://' + photo.path]);
      }
    } catch (e) {
      console.error('Failed to take photo!', e);
    }
  };

  /** Camera loading when device is busy */
  const renderCameraLoading = () => {
    return (
      <>
        <ActivityIndicator size={'large'} color={Colors.black} />
        <Text style={styles.loadingText}>Loading Camera...</Text>
      </>
    );
  };

  /** When permission denied show information */
  const renderCameraNoPermission = () => {
    return (
      <>
        <Text style={styles.loadingText}>
          Please turn on camera access or select photo using gallery option
        </Text>
        <TouchableOpacity onPress={requestCameraPermission} style={styles.allowCameraButton}>
          <Text style={styles.allowCameraText}>ALLOW CAMERA USE</Text>
        </TouchableOpacity>
      </>
    );
  };
  /** render Camera */
  const renderCameraView = () => {
    return device ? (
      <>
        <Camera photo={true} ref={cameraRef} style={styles.cameraView} device={device} isActive={true} />
      </>
    ) : null;
  };

  /** Top strip element */
  const renderTopStrip = () => {
    return (
      <>
        <AntDesign style={styles.topLeftIcon} name='close' size={30} color={Colors.white} />
        <Ionicons
          style={styles.topRightIcon}
          onPress={() => setUseFlash(!useFlash)}
          name={useFlash ? 'flash' : 'flash-off'}
          size={30}
          color={Colors.white}
        />
      </>
    );
  };

  /** Bottom strip element/controls */
  const renderBottomStrip = () => {
    return (
      <View style={styles.bottomStripContainer}>
        <View style={styles.bottomBoxButtons}>
          <TouchableOpacity
            onPress={() => {
              getGalleryPhotos({ mediaType: 'photo' })
                .then((galleryImages) => {
                  if (galleryImages && galleryImages.path) {
                    setImages([...images, galleryImages.path]);
                  } else if (galleryImages && galleryImages.length) {
                    setImages([...images, ...galleryImages.map((r) => r.path)]);
                  }
                })
                .catch(e => {
                });
            }}
            style={styles.emptyOutlineButton}>
            <Ionicons name='image-outline' size={30} color={Colors.active} />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomBoxButtons}>
          <TouchableOpacity onPress={takePhoto} style={styles.centerButton}>
            <Ionicons name='camera-outline' size={40} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomBoxButtons}>
          {images && images.length ? (
            <TouchableOpacity
              onPress={() => {
                if (onFinishImageSelection) {
                  onFinishImageSelection(images);
                }
              }}
              style={styles.emptyOutlineButton}>
              <Ionicons name='ios-checkmark' size={30} color={Colors.active} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  /** Remove already saved image not dumping it from localstorage as of now */
  const removeImage = (index) => {
    const tempImg = [...images];
    tempImg.splice(index, 1);
    setImages(tempImg);
  };

  /** Render Camera image scroll */
  const renderImageScroll = () => {
    if (!images || !images.length) {
      return null;
    }
    return (
      <>
        <View style={styles.scrollWhiteBKG} />
        <ScrollView style={styles.scrollViewStyle} contentContainerStyle={styles.scrollViewContentStyle} horizontal>
          {images.map((img, index) => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    removeImage(index);
                  }}
                  style={styles.closeBox}>
                  <AntDesign name='close' size={13} color={Colors.red} />
                </TouchableOpacity>
                <Image key={img} source={{ uri: img }} style={styles.scrollImage} />
              </View>
            );
          })}
        </ScrollView>
      </>
    );
  };



  return (
    <View style={styles.mainContainer}>
      {renderTopStrip()}
      <View style={styles.imageContainer}>
        {permissionStatus == null
          ? renderCameraLoading()
          : permissionStatus
            ? device
              ? renderCameraView()
              : renderCameraLoading()
            : renderCameraNoPermission()}
        {renderImageScroll()}
      </View>

      {renderBottomStrip()}
    </View>
  );
};

export default ImagePicker;
