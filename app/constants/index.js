import React from 'react';
import {isPostImageUploaded, postImageUpload} from '#modules/Sell/actions';
import {
  deleteImageFromPost,
  updatePostImage,
  uploadMultiPhoto,
} from '#services/apiPosts';

export const InvalidAlerts = {
  emptyFirstName: 'Please input the first name.',
  emptyLastName: 'Please input the last name.',
  emptyPassword: 'Please input the password.',
  emptyConfirmPassword: 'Please input the confirm password.',
  emptyEmail: 'Please input the email.',
  password:
    'Password must contain capital letter, at least 7 characters, a number and a symbol',
  networkOffline: 'Please make sure the network is connected',
  matchPassword: "New Passwords doesn't match.",
  email: 'Email is not valid, please verify and try again.',
  matchAccountNumber: `Account Numbers doesn't match.`,
  matchRoutingNumber: `Routing Numbers doesn't match.`,
  passwordLogin:
    'You have entered an invalid email or password. Please verify and try again',
};

export const SuccessAlert = {
  sentEmail: 'The code has been sent to your email.',
  sentPhone: 'The code has been sent to your phone.',
};

export const AccountSettings = {
  title: 'Privacy Settings',
  items: [
    {
      subTitle: 'Social Activity'.toUpperCase(),
      type: 'social',
      subItem: [
        {text: 'Connect to Facebook', property: 'connectFacebook'},
        {text: 'Share my activity', property: 'shareActivity'},
      ],
    },
    {
      subTitle: 'Search Engine'.toUpperCase(),
      type: 'search',
      subItem: [
        {
          text: 'Include profile in search engine',
          property: 'searchIncludeProfile',
        },
        {text: 'Save in search', property: 'searchSave'},
      ],
    },
  ],
};

export const NotificationSettings = {
  title: 'NOTIFICATION SETTINGS',
  items: [
    {
      subTitle: 'Messages'.toUpperCase(),
      type: 'inappmessage',
      subItem: [
        {text: 'Email', property: 'email'},
        {text: 'Push Notifications', property: 'push'},
        {text: 'Text Notifications', property: 'sms'},
      ],
    },
    {
      subTitle: 'Reminders'.toUpperCase(),
      type: 'reminder',
      subItem: [
        {text: 'Email', property: 'email'},
        {text: 'Push Notifications', property: 'push'},
        {text: 'Text Notifications', property: 'sms'},
      ],
    },
    {
      subTitle: 'Recommendations'.toUpperCase(),
      type: 'recomendation',
      subItem: [
        {text: 'Email', property: 'email'},
        {text: 'Push Notifications', property: 'push'},
        {text: 'Text Notifications', property: 'sms'},
      ],
    },
    {
      subTitle: 'Important Information'.toUpperCase(),
      type: 'importantinfo',
      subItem: [
        {text: 'Email', property: 'email'},
        {text: 'Push Notifications', property: 'push'},
        {text: 'Text Notifications', property: 'sms'},
      ],
    },
    {
      subTitle: 'Account Activity'.toUpperCase(),
      type: 'accountactivity',
      subItem: [
        {text: 'Email', property: 'email'},
        {text: 'Push Notifications', property: 'push'},
        {text: 'Text Notifications', property: 'sms'},
      ],
    },
  ],
};

/**
 * default distance in mile for filter
 */
export const FAKE_DEFAULT_DISTANCE = 1000;
export const DEFAULT_DISTANCE = 2;
export const DEFAULT_LOCATION = {latitude: 37.323, longitude: -122.0322};
export const DEFAULT_LOCATION_DELTA = {
  latitudeDelta: 0.0943,
  longitudeDelta: 0.0943,
};

export function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const postDetailFormData = (userInfo, formData) => {
  const dataToProduct = {};
  dataToProduct.userId = userInfo?.id;
  if (formData?.postTitle) {
    dataToProduct.title = formData.postTitle;
  }
  if (formData?.postDescription) {
    dataToProduct.description = formData.postDescription;
  }

  dataToProduct.customProperties = {};
  dataToProduct.customProperties.origin = 'app';
  if (Object.keys(formData.customProperties).length > 0) {
    dataToProduct.customProperties = formData.customProperties;
  }

  if (Object.keys(formData.listingType).length > 0) {
    dataToProduct.customProperties.listingType = formData.listingType;
  }

  if (Object.keys(formData.category).length > 0) {
    dataToProduct.customProperties.category = {};
    dataToProduct.customProperties.category.id = formData.category.id;
    dataToProduct.customProperties.category.name = formData.category.name;
  }
  dataToProduct.productStatus = 'bafb5ca5-341e-4f35-b6a1-a9ec6fe89cd3';
  if (Object.keys(formData.subCategory).length > 0) {
    dataToProduct.category = formData.subCategory.id;
  }
  return dataToProduct;
};

export const handleImageUploadAndUpdate = async (
  productId,
  photosList,
  formData,
  photosListInServer,
  postImageUploaded,
  dispatch,
) => {
  if (formData && formData.postId != '') {
    const updatedImage = photosList?.map((item, index) => {
      const imageData = {
        id: item.id,
        productId: productId,
        order: index + 1,
        type: item?.type,
        image: item?.image,
        uri: item?.uri
      };
      return imageData;
    });
    const getUndefinedImage = updatedImage?.filter(
      val => val?.type !== 'from-server' && val?.id == undefined,
    );
    let imageDataId;
    if (getUndefinedImage?.length > 0) {
      dispatch(isPostImageUploaded(true));
      imageDataId = await uploadMultiPhoto({
        productId: productId,
        photosList: getUndefinedImage,
      });
      if (imageDataId?.data && imageDataId?.data?.length > 0) {
        dispatch(postImageUpload(imageDataId?.data));
        dispatch(isPostImageUploaded(false));
      }
    }
    let count = 0;
    const removeUndefinedImage = updatedImage?.map(item => {
      if (item.id == undefined) {
        const imageData = {
          id: imageDataId?.data[count]?.id,
          productId: item?.productId,
          order: item?.order,
        };
        count = count + 1;
        return imageData;
      } else {
        const imageData = {
          id: item.id,
          productId: item?.productId,
          order: item?.order,
        };
        return imageData;
      }
    });
    if (removeUndefinedImage?.length > 0) {
      dispatch(isPostImageUploaded(true));
      await updatePostImage({params: removeUndefinedImage});
      let countImag = 0;
      photosList = photosList.map((item, index) => {
        if (item.type !== 'from-server') {
          const data = {
            id: imageDataId?.data[countImag]?.id,
            image: imageDataId?.data[countImag]?.urlImage,
            savIndex: index,
            type: 'from-server',
            uri: imageDataId?.data[countImag]?.urlImage,
          };
          countImag = countImag + 1;
          return data;
        } else {
          return item;
        }
      });
      dispatch(isPostImageUploaded(false));
    }
  }
  if (photosListInServer.length > 0) {
    const localPicsFromServer = photosList.filter(
      item => item.type === 'from-server',
    );

    for (let i = 0; i < photosListInServer.length; i++) {
      if (
        !localPicsFromServer.find(item => item.id === photosListInServer[i].id)
      ) {
        // delete task
        await deleteImageFromPost({
          productId: productId,
          imageId: photosListInServer[i].id,
          maintainImages: localPicsFromServer?.map(item => item?.id).toString(),
        });
        const updateImageDataAfterDelete = localPicsFromServer.map(
          (val, index) => {
            const data = {
              id: val?.id,
              productId: productId,
              order: index + 1,
            };
            return data;
          },
        );
        const removeUndefinedImage = updateImageDataAfterDelete?.filter(
          val => val?.id != undefined,
        );
        if (removeUndefinedImage?.length > 0) {
          await updatePostImage({params: removeUndefinedImage});
        }
      }
    }
    const imgsToAdd = photosList?.filter(item => item.type !== 'from-server');
    if (imgsToAdd?.length > 0) {
      dispatch(isPostImageUploaded(true));
      const res = await uploadMultiPhoto({
        productId: productId,
        photosList: imgsToAdd,
      });
      if (res?.data && res?.data?.length > 0) {
        dispatch(postImageUpload(res?.data));
        dispatch(isPostImageUploaded(false));
      }
    }
  } else if (postImageUploaded?.length > 0) {
    for (let i = 0; i < postImageUploaded?.length; i++) {
      await deleteImageFromPost({
        productId: productId,
        imageId: postImageUploaded[i]?.id,
        maintainImages: '',
      });
    }
  }
  if (photosListInServer.length == 0) {
    const imgsToAdd = photosList?.filter(item => item.type !== 'from-server');
    if (imgsToAdd?.length > 0) {
      dispatch(isPostImageUploaded(true));
      const res = await uploadMultiPhoto({
        productId: productId,
        photosList: imgsToAdd,
      });
      if (res?.data && res?.data?.length > 0) {
        dispatch(postImageUpload(res?.data));
        dispatch(isPostImageUploaded(false));
      }
    }
  }
};

export function removeEmptyAndUndefined(arr) {
  return arr.reduce((result, item) => {
    if (Array.isArray(item)) {
      const filteredItem = removeEmptyAndUndefined(item);
      if (filteredItem.length > 0) {
        result.push(filteredItem);
      }
    } else if (item !== undefined) {
      result.push(item);
    }
    return result;
  }, []);
}

export function flatten(arr) {
  if (!Array.isArray(arr)) return [arr];
  return arr.reduce((acc, val) => acc.concat(flatten(val)), []);
}

export const ImageAspectRation = 1.146;

export const RemoveDuplicates = (array, key) => {
  return array?.reduce((arr, item) => {
    const removed = arr.filter(i => i[key] !== item[key]);
    return [...removed, item];
  }, []);
};
