import React, {useCallback, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {
  SafeAreaView,
  Platform,
  BackHandler,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StepsBar, FooterAction, SweetDialog} from '#components';
import {safeAreaViewWhite, safeAreaNotchHelper} from '#styles/utilities';

import {selectSellData} from '#modules/Sell/selectors';
import {selectUserData} from '#modules/User/selectors';
import {
  setFormValue,
  clearSell,
  syncServer,
  getPostsDraft,
  savePostDetail,
  postImageUpload,
  isPostImageUploaded,
  changePostDetail,
} from '#modules/Sell/actions';
import PostDetails from './post-details';
import useCheckNetworkInfo from '../../../hooks/useCheckNetworkInfo';
import {
  createProduct,
  deleteImageFromPost,
  updateProduct,
  uploadMultiPhoto,
} from '#services/apiPosts';
import _ from 'lodash';
import {handleImageUploadAndUpdate, postDetailFormData} from '#constants';
import ScreenLoader from '#components/Loader/ScreenLoader';
import {clearImage} from '#modules/User/actions';

let refFormData;
let refPhotoList;
let refCopyFormData;
let refCopyPhotoList;

const PostDetailsScreen = ({navigation, route}) => {
  const categoryType = route.params['category-type'];
  const isNormal = route?.params?.isNormal;
  const isDraft = route?.params?.isDraft;

  /* Selectors */
  const {
    formData,
    isFetchingServer,
    photosList,
    photosListInServer,
    copyFormData,
    copyPhotoList,
    savePostDetailData,
    postImageUploaded,
    isChangePostDetail,
  } = useSelector(selectSellData());

  const {information: userInfo} = useSelector(selectUserData());

  const dispatch = useDispatch();

  let keyboardDidShowListener = null;
  let keyboardDidHideListener = null;
  const [buttonVisibility, setButtonVisibility] = useState(true);
  const [loader, setLoader] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const keyboardDidShow = () => {
        setButtonVisibility(false);
      };

      const keyboardDidHide = () => {
        setButtonVisibility(true);
      };
      keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        keyboardDidShow,
      );
      keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        keyboardDidHide,
      );

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []),
  );
  const [dialogVisible, setDialogVisible] = useState(false);
  const [checkingServer, setCheckingServer] = useState(false);
  const [conType, setConType] = useState(undefined);
  const {internetAvailable} = useCheckNetworkInfo();

  useEffect(() => {
    refFormData = formData;
  }, [formData]);
  useEffect(() => {
    refPhotoList = photosList;
  }, [photosList]);
  useEffect(() => {
    refCopyPhotoList = copyPhotoList;
  }, [copyPhotoList]);
  useEffect(() => {
    refCopyFormData = copyFormData;
  }, [copyFormData]);

  useEffect(() => {
    if (internetAvailable === true) {
      if (!conType) {
        setConType(true);
      }
    } else if (internetAvailable === false) {
      setConType(false);
    }
  }, [internetAvailable]);

  const handleClosePostDetailsClick = () => {
    if (refCopyPhotoList || refCopyFormData) {
      if (checkDisableStatus()) {
        dispatch(clearSell());
        if (route?.params?.isDashboard) {
          navigation.navigate('Dashboard', {
            fromScreen: 'explore',
            showSellSection: true,
            isSellTab: true,
          });
        } else {
          navigation.navigate('ExploreMain');
        }
      } else {
        if (isChangePostDetail == true) {
          setDialogVisible(true);
        } else {
          handleGoBackButton();
        }
      }
    } else {
      if (isChangePostDetail == true) {
        setDialogVisible(true);
      } else {
        handleGoBackButton();
      }
    }
  };

  const handleGoBackButton = () => {
    dispatch(savePostDetail({}));
    dispatch(isPostImageUploaded(false));
    dispatch(postImageUpload([]));
    dispatch(clearSell());
    if (route?.params?.isDashboard) {
      navigation.navigate('Dashboard', {
        fromScreen: 'explore',
        showSellSection: true,
        isSellTab: true,
      });
    } else {
      navigation.navigate('ExploreMain');
    }
  };

  const checkDisableStatus = () => {
    if (
      refPhotoList.length > 0 &&
      JSON.stringify(refPhotoList) !== JSON.stringify(refCopyPhotoList)
    ) {
      return false;
    }

    if (
      refFormData.listingType &&
      refCopyFormData.listingType &&
      refFormData.listingType.id &&
      refFormData.listingType.id !== refCopyFormData.listingType.id
    ) {
      return false;
    }

    if (
      refFormData.subCategory &&
      refCopyFormData.subCategory &&
      refFormData.subCategory.id &&
      refFormData.subCategory.id !== refCopyFormData.subCategory.id
    ) {
      return false;
    }

    if (
      refFormData.postTitle !== '' &&
      refFormData.postTitle !== refCopyFormData.postTitle
    ) {
      return false;
    }

    if (
      refFormData.postDescription !== '' &&
      refFormData.postDescription !== refCopyFormData.postDescription
    ) {
      return false;
    }

    if (
      refFormData.location.latitude &&
      JSON.stringify(refFormData.location) !==
        JSON.stringify(refCopyFormData.location)
    ) {
      return false;
    }

    if (
      refFormData.price &&
      Number(refFormData.price) > 0 &&
      refFormData.price !== refCopyFormData.price
    ) {
      return false;
    }

    if (refFormData.isNegotiable !== refCopyFormData.isNegotiable) {
      return false;
    }
    if (
      refCopyFormData.condition &&
      refFormData.condition &&
      refFormData.condition.length > 0 &&
      refFormData?.condition[0] !== refCopyFormData?.condition[0]
    ) {
      return false;
    }

    if (JSON.stringify(refPhotoList) !== JSON.stringify(refCopyPhotoList)) {
      return false;
    }

    if (JSON.stringify(refFormData) !== JSON.stringify(refCopyFormData)) {
      //return false;
    }

    if (refFormData.listingType.name === 'Vehicle') {
      if (
        JSON.stringify(refFormData.customProperties) !==
        JSON.stringify(refCopyFormData.customProperties)
      ) {
        return false;
      }
    }

    if (refFormData.listingType.name !== 'Vehicle') {
      if (
        refFormData.deliveryMethodsSelected &&
        refFormData.deliveryMethodsSelected.length > 0 &&
        JSON.stringify(refFormData.deliveryMethodsSelected) !==
          JSON.stringify(refCopyFormData.deliveryMethodsSelected)
      ) {
        //Left validate valid item

        return false;
      }
    }
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({handleClosePostDetailsClick});
      navigation.setParams({categoryType: formData.listingType.name});
    }, [navigation, isChangePostDetail]),
  );

  useFocusEffect(
    useCallback(() => {
      const handleBackButton = () => {
        navigation.navigate(
          'SellCategory',
          formData.listingType.name === 'Vehicle' && {
            'category-type': 'Vehicle',
          },
        );
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButton,
      );
      return () => subscription.remove();
    }, []),
  );

  useEffect(() => {
    if (isFetchingServer === false && checkingServer === true) {
      setCheckingServer(false);
      dispatch(clearSell());

      dispatch(
        getPostsDraft({
          filters: {
            sellerId: userInfo.id,
            postStatus: 'Draft',
            page: 1,
            perPage: 20,
          },
        }),
      );
      setLoader(false);
      navigation.navigate('ExploreMain');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkingServer, isFetchingServer, userInfo.id]);

  const onModalTouchOutside = () => {
    setDialogVisible(false);
  };

  const onMainButtonPressed = () => {
    setDialogVisible(false);
    dispatch(changePostDetail(false));
    setLoader(true);
    dispatch(
      syncServer({
        formData,
        photosList,
        draft: true,
        userId: userInfo.id,
        photosListInServer,
        lastScreen: route.name,
      }),
    );
    setCheckingServer(true);
  };

  const onSecondaryButtonPressed = () => {
    dispatch(clearSell());
    dispatch(clearImage());
    dispatch(changePostDetail(false));
    setDialogVisible(false);
    navigation.navigate('ExploreMain');
  };

  const handlePostDetailNextButton = async () => {
    const dataToProduct = {};

    const getDataToProduct = postDetailFormData(userInfo, formData);
    Object.assign(dataToProduct, getDataToProduct);

    const productId = formData?.productId
      ? formData?.productId
      : savePostDetailData?.productId;

    if (
      (formData || savePostDetailData) &&
      (formData?.productId || savePostDetailData?.productId)
    ) {
      setButtonLoader(true);
      const areArrayEqual = _.isEqual(
        savePostDetailData?.photosList,
        photosList,
      );
      delete savePostDetailData.productId;
      delete savePostDetailData.photosList;
      const areObjectsEqual = _.isEqual(savePostDetailData, dataToProduct);
      if (areObjectsEqual) {
        setButtonLoader(false);
        handleNextButton();
        dataToProduct.photosList = photosList;
        dispatch(
          savePostDetail({
            productId: productId,
            ...dataToProduct,
          }),
        );
      } else {
        const response = await updateProduct({
          productId: productId,
          params: dataToProduct,
        });
        if (response?.status == 200 || response?.success == true) {
          dataToProduct.photosList = photosList;
          dispatch(
            savePostDetail({
              productId: productId,
              ...dataToProduct,
            }),
          );
          setButtonLoader(false);
          handleNextButton();
        }
      }
      if (!areArrayEqual) {
        handleImageUploadAndUpdate(
          productId,
          photosList,
          formData,
          photosListInServer,
          postImageUploaded,
          dispatch,
        );
      }
    } else {
      setButtonLoader(true);
      const response = await createProduct({params: dataToProduct});
      if (Object.keys(response?.data)?.length > 0) {
        dataToProduct.productId = response?.data?.id;
        dataToProduct.photosList = photosList;
        dispatch(savePostDetail(dataToProduct));
        setButtonLoader(false);
        handleNextButton();
        dispatch(isPostImageUploaded(true));
        const res = await uploadMultiPhoto({
          productId: response?.data?.id,
          photosList: photosList,
        });
        if (res?.data && res?.data?.length > 0) {
          dispatch(postImageUpload(res?.data));
          dispatch(isPostImageUploaded(false));
        }
      } else {
        setButtonLoader(false);
      }
    }
  };

  const handleNextButton = () => {
    if (categoryType !== 'Vehicle') {
      navigation.navigate('SellPrice', {
        'category-type': categoryType,
        isNormal: isNormal,
        isDraft: isDraft,
        isDashboard: route?.params?.isDashboard,
      });
    } else {
      navigation.navigate('VehicleDetails', {
        'category-type': categoryType,
        isNormal: isNormal,
        isDraft: isDraft,
      });
    }
  };

  return (
    <>
      <SafeAreaView style={safeAreaViewWhite}>
        <StepsBar steps={5} step={2} />
        <PostDetails
          navigation={navigation}
          formData={formData}
          setFormValue={value => dispatch(setFormValue({...value}))}
        />
        {buttonVisibility && (
          <FooterAction
            mainButtonProperties={{
              label: 'Next',
              subLabel:
                categoryType !== 'Vehicle' ? 'PRICE' : 'VEHICLE DETAILS',
              disabled:
                !conType ||
                !formData.postTitle ||
                !formData.postDescription ||
                !formData.location.latitude,
              onPress: () => handlePostDetailNextButton(),
              showLoading: buttonLoader,
            }}
          />
        )}
        {loader && <ScreenLoader />}
        <SweetDialog
          title="Save Draft"
          message="Want to save your post for later?"
          type="two"
          mainBtTitle="Save for Later"
          secondaryBtTitle="No Thanks"
          dialogVisible={dialogVisible}
          onTouchOutside={onModalTouchOutside}
          onMainButtonPressed={onMainButtonPressed}
          onSecondaryButtonPressed={onSecondaryButtonPressed}
        />
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};
export default PostDetailsScreen;
