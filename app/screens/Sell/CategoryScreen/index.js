import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  SafeAreaView,
  BackHandler,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '#themes';
import {StepsBar, FooterAction, SweetDialog} from '#components';
import CategoriesSection from './sections/categories';
import SubcategoriesSection from './sections/subcategories';
import {safeAreaViewWhite, safeAreaNotchHelper} from '#styles/utilities';
import {selectSellData} from '#modules/Sell/selectors';
import {selectUserData} from '#modules/User/selectors';
import {
  clearSell,
  syncServer,
  getPostsDraft,
  changePostDetail,
  postImageUpload,
  isPostImageUploaded,
  savePostDetail,
} from '#modules/Sell/actions';
import {useActions} from '#utils';
import useCheckNetworkInfo from '../../../hooks/useCheckNetworkInfo';
import ScreenLoader from '#components/Loader/ScreenLoader';
import {clearImage} from '#modules/User/actions';

let refFormData;
let refPhotoList;
let refCopyFormData;
let refCopyPhotoList;

const CategoryScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  /* Selectors */
  const {
    formData,
    photosList,
    photosListInServer,
    isFetchingServer,
    copyFormData,
    copyPhotoList,
    isChangePostDetail,
  } = useSelector(selectSellData());
  const {information: userInfo} = useSelector(selectUserData());

  const actions = useActions({clearSell, syncServer, getPostsDraft});
  const {internetAvailable} = useCheckNetworkInfo();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [checkingServer, setCheckingServer] = useState(false);
  const [conType, setConType] = useState(undefined);
  const [loader, setLoader] = useState(false);
  const [exitDialogData, setExitDialogData] = useState({
    code: 'draft_available',
    title: 'Save Draft',
    message: 'Want to save your post for later?',
    mainBtTitle: 'Save for Later',
    secondaryBtTitle: 'No Thanks',
  });

  useEffect(() => {
    if (internetAvailable === true) {
      if (!conType) {
        setConType(true);
      }
    } else if (internetAvailable === false) {
      setConType(false);
    }
  }, [internetAvailable]);

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

  const isCurrentProductADraft = formData?.productStatus?.name === 'Draft';

  const handleCloseClick = () => {
    if (false) {
      // isCurrentProductADraft
      actions.syncServer({
        formData: refCopyFormData,
        photosList,
        photosListInServer,
        userId: userInfo.id,
      });
      // Need to save draft here. Not create a new one.
      actions.clearSell();
      navigation.navigate('ExploreMain');
    } else {
      if (refCopyPhotoList || refCopyFormData) {
        if (checkDisableStatus()) {
          actions.clearSell();
          navigation.goBack();
        } else {
          if (isChangePostDetail == true) {
            setExitDialogData({
              code: 'draft_available',
              title: 'Save Draft',
              message: 'Want to save your post for later?',
              mainBtTitle: 'Save for Later',
              secondaryBtTitle: 'No Thanks',
            });
            setDialogVisible(true);
          } else {
            handleBackButton();
          }
        }
      } else {
        if (isChangePostDetail == true) {
          setExitDialogData({
            code: 'draft_available',
            title: 'Save Draft',
            message: 'Want to save your post for later?',
            mainBtTitle: 'Save for Later',
            secondaryBtTitle: 'No Thanks',
          });
          setDialogVisible(true);
        } else {
          handleBackButton();
        }
      }
    }
  };

  const handleBackButton = () => {
    dispatch(savePostDetail({}));
    dispatch(isPostImageUploaded(false));
    dispatch(postImageUpload([]));
    actions.clearSell();
    if (route?.params?.isDashboard) {
      navigation.navigate('Dashboard', {
        fromScreen: 'explore',
        showSellSection: true,
        isSellTab: true
      });
    } else {
      navigation.navigate('ExploreMain');
    }
  };

  const checkDisableStatus = () => {
    if (
      refPhotoList &&
      refPhotoList.length > 0 &&
      JSON.stringify(refPhotoList) !== JSON.stringify(refCopyPhotoList)
    ) {
      return false;
    }

    if (
      refFormData &&
      refCopyFormData &&
      JSON.stringify(refFormData.listingType) !==
        JSON.stringify(refCopyFormData.listingType)
    ) {
      return false;
    }

    if (
      refFormData &&
      refCopyFormData &&
      JSON.stringify(refFormData.subCategory) !==
        JSON.stringify(refCopyFormData.subCategory)
    ) {
      return false;
    }

    if (
      refFormData &&
      refCopyFormData &&
      refFormData.postTitle !== refCopyFormData.postTitle
    ) {
      return false;
    }

    if (
      refFormData &&
      refCopyFormData &&
      refFormData.postDescription !== refCopyFormData.postDescription
    ) {
      return false;
    }

    if (
      refFormData &&
      refCopyFormData &&
      JSON.stringify(refFormData.location) !==
        JSON.stringify(refCopyFormData.location)
    ) {
      return false;
    }

    if (
      refFormData &&
      refCopyFormData &&
      refFormData.price !== refCopyFormData.price
    ) {
      return false;
    }

    if (
      refFormData &&
      refCopyFormData &&
      refFormData.isNegotiable !== refCopyFormData.isNegotiable
    ) {
      return false;
    }

    if (
      refFormData &&
      refCopyFormData &&
      refCopyFormData.condition &&
      refFormData.condition &&
      refFormData.condition.length > 0 &&
      refFormData?.condition[0] !== refCopyFormData?.condition[0]
    ) {
      return false;
    }

    if (
      refPhotoList &&
      refCopyPhotoList &&
      JSON.stringify(refPhotoList) !== JSON.stringify(refCopyPhotoList)
    ) {
      return false;
    }

    if (
      refFormData &&
      refCopyFormData &&
      JSON.stringify(refFormData) !== JSON.stringify(refCopyFormData)
    ) {
      //return false;
    }

    if (
      refFormData &&
      refFormData.listingType &&
      refFormData.listingType.name === 'Vehicle'
    ) {
      if (
        refFormData &&
        refCopyFormData &&
        JSON.stringify(refFormData.customProperties) !==
          JSON.stringify(refCopyFormData.customProperties)
      ) {
        return false;
      }
    }

    if (
      refFormData &&
      refFormData.listingType &&
      refFormData.listingType.name !== 'Vehicle'
    ) {
      if (
        refFormData &&
        refCopyFormData &&
        JSON.stringify(refFormData.deliveryMethodsSelected) !==
          JSON.stringify(refCopyFormData.deliveryMethodsSelected)
      ) {
        //Left validate valid item

        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (isFetchingServer === false && checkingServer === true) {
      setCheckingServer(false);
      actions.clearSell();

      actions.getPostsDraft({
        filters: {
          sellerId: userInfo.id,
          postStatus: 'Draft',
          page: 1,
          perPage: 20,
        },
      });
      setLoader(false);
      navigation.navigate('ExploreMain');
    }
  }, [isFetchingServer]);

  const onModalTouchOutside = () => {
    setDialogVisible(false);
  };

  useEffect(() => {
    navigation.setParams({handleCloseClick});
  }, [isChangePostDetail]);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({handleCloseClick});
      const handleBackButton = () => {
        navigation.navigate('SellMain');
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButton,
      );
      return () => subscription.remove();
    }, []),
  );

  const onMainButtonPressed = () => {
    switch (exitDialogData.code) {
      case 'draft_available':
        setDialogVisible(false);
        setCheckingServer(true);
        dispatch(changePostDetail(false));
        setLoader(true);
        actions.syncServer({
          formData,
          photosList,
          userId: userInfo.id,
          photosListInServer,
          lastScreen: route.name,
        });
        break;
      case 'draft_not_available':
        actions.clearSell();
        dispatch(changePostDetail(false));
        setDialogVisible(false);
        navigation.navigate('ExploreMain');
        break;
    }
  };

  const onSecondaryButtonPressed = () => {
    switch (exitDialogData.code) {
      case 'draft_available':
        actions.clearSell();
        dispatch(clearImage());
        setDialogVisible(false);
        dispatch(changePostDetail(false));
        navigation.navigate('ExploreMain');
        break;
      case 'draft_not_available':
        setDialogVisible(false);
        dispatch(changePostDetail(false));
        break;
    }
  };

  const categoryType = route.params['category-type'];
  const isNormal = route?.params?.isNormal;
  const isDraft = route?.params?.isDraft;

  return (
    <>
      <SafeAreaView style={safeAreaViewWhite}>
        <StepsBar steps={5} step={1} />
        {categoryType !== 'Vehicle' && <CategoriesSection />}
        <SubcategoriesSection categoryType={categoryType} />
        <FooterAction
          mainButtonProperties={{
            label: 'Next',
            subLabel: 'POST DETAILS',
            disabled: !formData.subCategory.id,
            onPress: () =>
              navigation.navigate('PostDetails', {
                'category-type': categoryType,
                isNormal: isNormal,
                isDraft: isDraft,
                isDashboard: route?.params?.isDashboard,
              }),
          }}
        />
        {loader && <ScreenLoader />}
      </SafeAreaView>
      <SweetDialog
        title={exitDialogData.title}
        message={exitDialogData.message}
        type="two"
        mainBtTitle={exitDialogData.mainBtTitle}
        secondaryBtTitle={exitDialogData.secondaryBtTitle}
        dialogVisible={dialogVisible}
        onTouchOutside={onModalTouchOutside}
        onMainButtonPressed={onMainButtonPressed}
        onSecondaryButtonPressed={onSecondaryButtonPressed}
      />
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};
export default CategoryScreen;
