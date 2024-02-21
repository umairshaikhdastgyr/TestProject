import ImagePicker, { Options } from 'react-native-image-crop-picker';

/** Get photos from user's gallery */
export const getGalleryPhotos = async (props) => {
  // This function needs to have some default value
  const defaultOptions = {
    ...props,
  };
  return ImagePicker.openPicker(defaultOptions);
};