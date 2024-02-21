import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FooterAction, StepsBar, SweetDialog} from '#components';
import {safeAreaNotchHelper} from '#styles/utilities';
import styles from './styles';

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
import {useActions} from '#utils';
import PriceElement from './price-element';
import useCheckNetworkInfo from '../../../hooks/useCheckNetworkInfo';
import ScreenLoader from '#components/Loader/ScreenLoader';
import {clearImage} from '#modules/User/actions';
let refFormData;
let refPhotoList;
let refCopyFormData;
let refCopyPhotoList;
const HEIGHT = Dimensions.get('window').height;

const PriceScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const isNormal = route?.params?.isNormal;
  const isDraft = route?.params?.isDraft;
  let keyboardDidShowListener = null;
  let keyboardDidHideListener = null;
  const [buttonVisibility, setButtonVisibility] = useState(true);
  const [conType, setConType] = useState(undefined);
  const {internetAvailable} = useCheckNetworkInfo();
  const [loader, setLoader] = useState(false);

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

  useEffect(() => {
    if (internetAvailable === true) {
      if (!conType) {
        setConType(true);
      }
    } else if (internetAvailable === false) {
      setConType(false);
    }
  }, [internetAvailable]);

  /* Selectors */
  const {
    formData,
    isFetchingServer,
    photosList,
    photosListInServer,
    copyFormData,
    copyPhotoList,
    isChangePostDetail,
  } = useSelector(selectSellData());
  const {information: userInfo} = useSelector(selectUserData());

  const categoryType = formData?.listingType?.name;

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

  const handleClosePriceClick = () => {
    if (refCopyPhotoList || refCopyFormData) {
      if (checkDisableStatus()) {
        actions.clearSell();
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
          handleBackButton();
        }
      }
    } else {
      if (isChangePostDetail == true) {
        setDialogVisible(true);
      } else {
        handleBackButton();
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
      JSON.stringify(refFormData.listingType) !==
      JSON.stringify(refCopyFormData.listingType)
    ) {
      return false;
    }

    if (
      JSON.stringify(refFormData.subCategory) !==
      JSON.stringify(refCopyFormData.subCategory)
    ) {
      return false;
    }

    if (refFormData.postTitle !== refCopyFormData.postTitle) {
      return false;
    }

    if (refFormData.postDescription !== refCopyFormData.postDescription) {
      return false;
    }

    if (
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
        JSON.stringify(refFormData.deliveryMethodsSelected) !==
        JSON.stringify(refCopyFormData.deliveryMethodsSelected)
      ) {
        //Left validate valid item

        return false;
      }
    }
    return true;
  };

  /* Actions */
  const actions = useActions({
    setFormValue,
    clearSell,
    syncServer,
    getPostsDraft,
  });

  const [dialogVisible, setDialogVisible] = useState(false);
  const [checkingServer, setCheckingServer] = useState(false);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({handleClosePriceClick});
      navigation.setParams({categoryType: formData.listingType.name});
    }, [navigation, isChangePostDetail]),
  );

  useFocusEffect(
    useCallback(() => {
      const handleBackButton = () => {
        if (formData.listingType.name === 'Vehicle') {
          navigation.navigate('VehicleDetails', {
            'category-type': 'Vehicle',
          });
        } else {
          navigation.navigate(
            'PostDetails',
            formData.listingType.name === 'Vehicle' && {
              'category-type': 'Vehicle',
            },
          );
        }
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

  const onMainButtonPressed = () => {
    setDialogVisible(false);
    setCheckingServer(true);
    setLoader(true);
    dispatch(savePostDetail({}));
    dispatch(isPostImageUploaded(false));
    dispatch(postImageUpload([]));
    dispatch(changePostDetail(false));
    actions.syncServer({
      formData,
      photosList,
      userId: userInfo.id,
      draft: true,
      photosListInServer,
      lastScreen: route.name,
    });
  };

  const onSecondaryButtonPressed = () => {
    actions.clearSell();
    dispatch(savePostDetail({}));
    dispatch(isPostImageUploaded(false));
    dispatch(postImageUpload([]));
    dispatch(clearImage());
    dispatch(changePostDetail(false));
    setDialogVisible(false);
    navigation.navigate('ExploreMain');
  };
  const [errTotalPriceErr, setErrTotalPriceErr] = useState(null);
  const [resetWarningText, setResetWarningText] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: headerLeft,
    });
  }, [navigation]);

  const headerLeft = () => (
    <TouchableOpacity
      onPress={() => {
        if (formData.listingType.name === 'Vehicle') {
          navigation.navigate('VehicleDetails', {
            'category-type': 'Vehicle',
          });
        } else {
          navigation.navigate(
            'PostDetails',
            formData.listingType.name === 'Vehicle' && {
              'category-type': 'Vehicle',
            },
          );
        }
      }}
      style={{paddingHorizontal: 5}}>
      <Icon
        name="chevron-left"
        size={37}
        color="#959595"
        style={{marginLeft: -18}}
      />
    </TouchableOpacity>
  );

  return (
    <>
      <SafeAreaView
        style={{flex: 1, backgroundColor: '#ffffff', minHeight: HEIGHT - 240}}>
        <StepsBar steps={5} step={categoryType !== 'Vehicle' ? 3 : 4} />
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles['main-container']}>
            <PriceElement
              resetWarningText={resetWarningText}
              setResetWarningText={setResetWarningText}
              formData={formData}
              errTotalPriceErr={errTotalPriceErr}
              setErrTotalPriceErr={setErrTotalPriceErr}
            />
          </View>
        </TouchableWithoutFeedback>
        {buttonVisibility && (
          <FooterAction
            mainButtonProperties={{
              label: 'Next',
              subLabel:
                categoryType !== 'Vehicle' ? 'DELIVERY METHOD' : 'POST PREVIEW',
              disabled:
                !conType ||
                !formData.price ||
                errTotalPriceErr ||
                Number(formData.price) === 0,
              onPress: () => {
                setResetWarningText('');

                categoryType !== 'Vehicle'
                  ? navigation.navigate('DeliveryMethod', {
                      'category-type': categoryType,
                      isNormal: isNormal,
                      isDraft: isDraft,
                      isDashboard: route?.params?.isDashboard,
                    })
                  : navigation.navigate('PostPreview', {
                      'category-type': categoryType,
                      isNormal: isNormal,
                      isDraft: isDraft,
                    });
              },
            }}
          />
        )}
        {loader && <ScreenLoader />}
      </SafeAreaView>
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
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};
export default PriceScreen;
