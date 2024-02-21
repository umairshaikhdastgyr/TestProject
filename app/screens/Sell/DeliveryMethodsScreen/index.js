import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  SafeAreaView,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  FooterAction,
  StepsBar,
  SweetDialog,
  BodyText,
  Loader,
} from '#components';
import DeliveryItem from './DeliveryItem';

import {safeAreaNotchHelper} from '#styles/utilities';
import styles from './styles';

import {selectSellData} from '#modules/Sell/selectors';
import {selectUserData} from '#modules/User/selectors';
import {
  setFormValue,
  clearSell,
  getDeliveryMethods,
  syncServer,
  getPostsDraft,
  getMinimumShipRate,
  savePostDetail,
  postImageUpload,
  isPostImageUploaded,
  changePostDetail,
} from '#modules/Sell/actions';
import {useActions} from '#utils';
import ScreenLoader from '#components/Loader/ScreenLoader';
import {clearImage} from '#modules/User/actions';

const HEIGHT = Dimensions.get('window').height;
let refFormData;
let refPhotoList;
let refCopyFormData;
let refCopyPhotoList;

const DeliveryMethodsScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  // 7bf82ff7-1b56-4b4d-8144-3952670657ec

  const categoryType = route.params['category-type'];
  const isDraft = route?.params?.isDraft;
  const isNormal = route?.params?.isNormal;
  /* Selectors */
  const {
    formData,
    deliveryMethods,
    isFetchingServer,
    photosList,
    photosListInServer,
    minShippingRate,
    copyFormData,
    copyPhotoList,
    shippingRate,
    isChangePostDetail,
  } = useSelector(selectSellData());
  const {information: userInfo} = useSelector(selectUserData());

  const [loader, setLoader] = useState(false);

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

  const handleCloseDeliveryClick = () => {
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

    if (refFormData.price !== refCopyFormData.price) {
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
    getDeliveryMethods,
    syncServer,
    getPostsDraft,
    getMinimumShipRate,
  });

  const getInitialPounds = () => {
    if (formData?.customProperties?.weight) {
      return Math.floor(formData?.customProperties?.weight ?? 0).toString();
    }

    return null;
  };

  const getInitialOunces = () => {
    if (formData?.customProperties?.weight) {
      return (
        ((parseFloat(formData?.customProperties?.weight) * 100 -
          Math.floor(formData?.customProperties?.weight) * 100) /
          100) *
        16
      )?.toString();
    }

    return null;
  };

  const getInitialLength = () =>
    formData?.customProperties?.length?.toString() ?? null;
  const getInitialWidth = () =>
    formData?.customProperties?.width?.toString() ?? null;
  const getInitialHeight = () =>
    formData?.customProperties?.height?.toString() ?? null;

  const [dialogVisible, setDialogVisible] = useState(false);
  const [checkingServer, setCheckingServer] = useState(false);
  const [errTotalPriceErr, setErrTotalPriceErr] = useState(null);
  const [errHomiLabel, setErrHomiLabel] = useState(null);
  const [alertContent, setAlertContent] = useState('');
  const [packageProperties, setPackageProperties] = useState({
    pounds: getInitialPounds(),
    ounces: getInitialOunces(),
    length: getInitialLength(),
    width: getInitialWidth(),
    height: getInitialHeight(),
    _meta: {
      isCompleted: Boolean(
        getInitialPounds() &&
          getInitialOunces() &&
          getInitialLength() &&
          getInitialWidth() &&
          getInitialHeight(),
      ),
      isModified: false,
    },
  });
  const [packagePropertiesError, setPackagePropertiesError] = useState({
    pounds: getInitialPounds() ? null : 'Required',
    ounces: getInitialOunces() ? null : 'Required',
    length: getInitialLength() ? null : 'Required',
    width: getInitialWidth() ? null : 'Required',
    height: getInitialHeight() ? null : 'Required',
  });

  /**
   * @return Void
   */
  const _handlePackagePropertiesOnError = (key = '', value = '') => {
    if (!value.trim()) {
      setPackagePropertiesError({
        ...packagePropertiesError,
        [key]: 'Required',
      });
      return;
    }
    setPackagePropertiesError({
      ...packagePropertiesError,
      [key]: null,
    });
  };

  /**
   * @description Set package properties values and clear error
   * @param {string} key Object key to be modified
   * @param {string} value New value
   * @return Void
   */
  const handlePackagePropertiesOnChange = (key = '', value = '') => {
    setErrHomiLabel(null);
    _handlePackagePropertiesOnError(key, value);

    if (parseInt(value, 10) > 120 && key === 'pounds') {
      return;
    }

    if (parseInt(value, 10) === 120 && key === 'pounds') {
      setPackageProperties({
        ...packageProperties,
        pounds: '120',
        ounces: '0',
      });

      return;
    }

    if (parseInt(value, 10) > 15 && key === 'ounces') {
      return;
    }

    if (parseInt(packageProperties.pounds, 10) === 120 && key === 'ounces') {
      setPackageProperties({
        ...packageProperties,
        ounces: '0',
      });
      return;
    }

    setPackageProperties({
      ...packageProperties,
      [key]: value,
    });
  };

  const handlePackagePropertiesOnBlur = () => {
    const fieldValues = Object.values(packageProperties).filter(
      value => value === null,
    );

    actions.setFormValue({
      customProperties: {
        ...formData.customProperties,
        width: parseInt(packageProperties.width, 10) || null,
        height: parseInt(packageProperties.height, 10) || null,
        length: parseInt(packageProperties.length, 10) || null,
        weight:
          Number(packageProperties.pounds) +
            Number(packageProperties.ounces) / 16 || null,
      },
    });

    // Set meta fields
    if (fieldValues.every(value => value !== null)) {
      setPackageProperties({
        ...packageProperties,
        _meta: {
          isCompleted: true,
          isModified: false,
        },
      });
    }
  };

  useEffect(() => {
    if (deliveryMethods.data.length === 0) {
      actions.getDeliveryMethods({categoryId: formData.subCategory.id});
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({handleCloseDeliveryClick});
      navigation.setParams({categoryType: formData.listingType.name});
    }, [isChangePostDetail]),
  );

  useFocusEffect(
    useCallback(() => {
      const handleBackButton = () => {
        navigation.navigate(
          'SellPrice',
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

  const setDeliveryFormData = data => {
    const dataToTest = formData.deliveryMethodsSelected.find(
      element => element.id === data.id,
    );
    setErrHomiLabel(null);
    setAlertContent('');

    const isHomitagshipping = dataToTest?.code === 'homitagshipping';

    if (dataToTest) {
      // remove
      actions.setFormValue({
        locationIsChanged: false,
        customProperties: {
          ...formData.customProperties,
          width: isHomitagshipping ? null : formData.customProperties.width,
          height: isHomitagshipping ? null : formData.customProperties.height,
          length: isHomitagshipping ? null : formData.customProperties.length,
          weight: isHomitagshipping ? null : formData.customProperties.weight,
        },
        deliveryMethodsSelected: [
          ...formData.deliveryMethodsSelected.filter(
            element => element.id !== data.id,
          ),
        ],
      });
      dispatch(changePostDetail(true));
    } else {
      actions.setFormValue({
        locationIsChanged: false,
        deliveryMethodsSelected: [
          ...formData.deliveryMethodsSelected,
          ...[data],
        ],
      });
      dispatch(changePostDetail(true));
    }
  };

  const sendAlert = data => {
    setAlertContent('');
    const price = Number(formData.price);
    const minShippingPrice =
      data?.deliveryCustomProperties?.rangeAvailable?.[0];
    const maxShippingPrice =
      data?.deliveryCustomProperties?.rangeAvailable?.[1];

    if (price < 3 && data?.code !== 'pickup') {
      setAlertContent(
        'Minimum price for prepaid shipping and ship independently is $3',
      );
      return;
    }

    if (
      data?.deliveryCustomProperties?.rangeAvailable &&
      (price < minShippingPrice || price > maxShippingPrice)
    ) {
      setAlertContent(
        `This delivery method is only available for a price range between $${minShippingPrice} and $${maxShippingPrice}`,
      );
    } else {
      setAlertContent('');
    }
  };

  const updateDeliveryFormData = data => {
    actions.setFormValue({
      deliveryMethodsSelected: [
        ...formData.deliveryMethodsSelected.filter(
          element => element.id !== data.id,
        ),
        ...[data],
      ],
    });
  };

  const onModalTouchOutside = () => {
    setDialogVisible(false);
  };

  const onMainButtonPressed = () => {
    setDialogVisible(false);
    setCheckingServer(true);
    setLoader(true);
    dispatch(savePostDetail({}));
    dispatch(postImageUpload([]));
    dispatch(isPostImageUploaded(false));
    dispatch(changePostDetail(false));
    actions.syncServer({
      formData,
      photosList,
      draft: true,
      userId: userInfo.id,
      photosListInServer,
      lastScreen: route.name,
    });
  };

  const onSecondaryButtonPressed = () => {
    actions.clearSell();
    dispatch(savePostDetail({}));
    dispatch(postImageUpload([]));
    dispatch(clearImage());
    dispatch(isPostImageUploaded(false));
    dispatch(changePostDetail(false));
    setDialogVisible(false);
    navigation.navigate('ExploreMain');
  };

  const prepaidShippingLabelIsNotComplete = () => {
    const homitagshipping = formData?.deliveryMethodsSelected?.find(
      deliveryMethodSelected =>
        deliveryMethodSelected.code === 'homitagshipping',
    );

    const selectedProvider =
      homitagshipping?.deliveryCustomProperties?.optionsAvailable
        ?.find(option => option.selected === true)
        ?.providers?.find(prov => prov.selected === true);

    const {weight, length, width, height} = formData?.customProperties;

    const packagePropertiesCompleted = Boolean(
      weight && length && width && height,
    );

    if (formData?.listingType?.name === 'Goods' && homitagshipping) {
      if (packageProperties._meta.isCompleted === false) {
        return true;
      }

      if (packagePropertiesCompleted === false) {
        return true;
      }
      if (!selectedProvider?.selected) {
        return true;
      }
    }
  };

  const shipIndependentlyIsNotValid = () => {
    if (
      formData?.listingType?.name === 'Goods' &&
      formData.deliveryMethodsSelected.find(
        ele => ele.code === 'shipindependently',
      )
    ) {
      const indShip = formData.deliveryMethodsSelected.find(
        ele => ele.code === 'shipindependently',
      );
      if (
        indShip?.deliveryCustomProperties?.freeOption?.valueSelected === false
      ) {
        if (
          parseFloat(indShip.deliveryCustomProperties.shippingCost) +
            parseFloat(formData.price) >
          1500
        ) {
          return true;
        }

        if (Number(indShip.deliveryCustomProperties.shippingCost) === 0) {
          return true;
        }

        return false;
      }
      return false;
    }
  };

  const noDeliveryMethodsSelected = () => {
    if (
      formData?.listingType?.name === 'Goods' &&
      formData.deliveryMethodsSelected.length === 0
    ) {
      return true;
    }
  };
  const noDeliveryMethodSelected = () => {
    let deliveryCustomProperties =
      formData?.deliveryMethodsSelected[0]?.deliveryCustomProperties;
    let deliveryMethodsSelected = formData?.deliveryMethodsSelected[0];
    var optionsAvailable = false;
    if (Array.isArray(deliveryCustomProperties?.optionsAvailable)) {
      optionsAvailable = deliveryCustomProperties?.optionsAvailable.find(
        element => element.selected == true,
      );
    }
    if (formData?.deliveryMethodsSelected?.length === 0) {
      return true;
    }
    if (deliveryMethodsSelected.id == '6d820c00-87e5-482a-801d-da6c5fcec4b3') {
      if (optionsAvailable) {
        return false;
      } else {
        return true;
      }
    }
    if (
      deliveryCustomProperties?.freeOption?.valueSelected ||
      deliveryCustomProperties?.shippingCost ||
      optionsAvailable
    ) {
      return false;
    } else {
      return true;
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: headerLeft,
    });
  }, [navigation]);

  const headerLeft = () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(
          'SellPrice',
          formData.listingType.name === 'Vehicle' && {
            'category-type': 'Vehicle',
          },
        );
      }}>
      <Icon
        name="chevron-left"
        size={37}
        color="#959595"
        style={{marginLeft: -14}}
      />
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: 'white'}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
      keyboardVerticalOffset={60}>
      <SafeAreaView style={{flex: 1, minHeight: HEIGHT - 240}}>
        <StepsBar steps={5} step={4} />
        {deliveryMethods.isFetching === true && (
          <View
            style={[
              styles['main-container'],
              {alignItems: 'center', justifyContent: 'center'},
            ]}>
            <Loader />
          </View>
        )}
        {deliveryMethods.isFetching === false && (
          <View style={styles['main-container']}>
            <ScrollView
              style={{flexGrow: 1}}
              contentContainerStyle={styles.scrollContainer}>
              <BodyText theme="active" style={styles.titleText} align="left">
                Please choose your delivery method(s) below...
                {deliveryMethods.length}
              </BodyText>

              {deliveryMethods?.data?.map((itemData, index) => {
                if (itemData.code == 'pickup') {
                  // Temparary removed for first release
                  return null;
                }
                return (
                  <DeliveryItem
                    packageProperties={packageProperties}
                    setPackageProperties={setPackageProperties}
                    packagePropertiesError={packagePropertiesError}
                    handlePackagePropertiesOnChange={
                      handlePackagePropertiesOnChange
                    }
                    handlePackagePropertiesOnBlur={
                      handlePackagePropertiesOnBlur
                    }
                    errTotalPriceErr={errTotalPriceErr}
                    setErrTotalPriceErr={setErrTotalPriceErr}
                    key={index}
                    itemData={itemData}
                    formData={formData}
                    setDeliveryFormData={setDeliveryFormData}
                    updateDeliveryFormData={updateDeliveryFormData}
                    deliveryMethodsCount={deliveryMethods.data.length}
                    sendAlert={sendAlert}
                    errHomiLabel={errHomiLabel}
                    setErrHomiLabel={setErrHomiLabel}
                    getMinimumShippingRate={actions.getMinimumShipRate}
                    minShippingRate={minShippingRate}
                  />
                );
              })}
            </ScrollView>
            {alertContent !== '' && (
              <BodyText
                style={{
                  color: 'red',
                  paddingHorizontal: 20,
                  textAlign: 'center',
                }}
                align="left">
                {alertContent}
              </BodyText>
            )}
          </View>
        )}

        <FooterAction
          mainButtonProperties={{
            label: 'Next',
            subLabel: 'POST PREVIEW',
            disabled:
              errHomiLabel ||
              Boolean(errTotalPriceErr) ||
              noDeliveryMethodSelected() === true ||
              shipIndependentlyIsNotValid() ||
              prepaidShippingLabelIsNotComplete() === true ||
              noDeliveryMethodSelected() ||
              shippingRate?.isFetching,
            onPress: () => {
              navigation.navigate('PostPreview', {
                'category-type': categoryType,
                isNormal: isNormal,
                isDraft: isDraft,
                isDashboard: route?.params?.isDashboard,
              });
            },
          }}
        />
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
      {minShippingRate.isFetching && <ScreenLoader />}
    </KeyboardAvoidingView>
  );
};
export default DeliveryMethodsScreen;
