import React, {useEffect, useState, useRef, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import _ from 'lodash';

import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  BackHandler,
  Keyboard,
  Text,
} from 'react-native';
import {FooterAction, SweetDialog, BodyText} from '#components';

import {safeAreaViewWhite, safeAreaNotchHelper} from '#styles/utilities';
import styles from './styles';
import ScreenLoader from '#components/Loader/ScreenLoader';
import {selectSellData} from '#modules/Sell/selectors';
import {selectUserData} from '#modules/User/selectors';
import {
  setFormValue,
  setPhotoList,
  clearSell,
  getDeliveryMethods,
  syncServer,
  getPostsDraft,
  clearDeliveryMethods,
  getMinimumShipRate,
  postImageUpload,
  savePostDetail,
  isPostImageUploaded,
} from '#modules/Sell/actions';
import {useActions} from '#utils';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tabs from './components/Tabs';

import CategoriesSection from '../CategoryScreen/sections/categories';
import SubcategoriesSection from '../CategoryScreen/sections/subcategories';

import PostDetails from '../PostDetailsScreens/post-details';

import VehicleList from '../VehicleDetailsScreen/vehicle-list';
import usePrevious from '#utils/usePrevious';
import {useFocusEffect} from '@react-navigation/native';
import Header from './components/Tabs/header';
import CreatePostTab from './components/Tabs/create-post';
import DeliveryMethodTab from './components/Tabs/delivery-method';
import PriceTab from './components/Tabs/price';
import {Fonts, Colors} from '#themes';
import {defaultVehicleDeliveryMethod} from '../helpers/sell-functions';
import {
  deleteImageFromPost,
  updatePostImage,
  updateProduct,
  uploadMultiPhoto,
} from '#services/apiPosts';
import {handleImageUploadAndUpdate, postDetailFormData} from '#constants';

const EditorScreen = ({navigation, route}) => {
  const dispatch = useDispatch();

  const {
    formData,
    photosList,
    deliveryMethods,
    isFetchingServer,
    photosListInServer,
    minShippingRate,
    savePostDetailData,
    postImageUploaded,
  } = useSelector(selectSellData());
  const {information: userInfo} = useSelector(selectUserData());

  /* Actions */
  const actions = useActions({
    setFormValue,
    setPhotoList,
    clearSell,
    getDeliveryMethods,
    syncServer,
    getPostsDraft,
    clearDeliveryMethods,
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

  const prevFormData = usePrevious(formData);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [checkingServer, setCheckingServer] = useState(false);
  const [loader, setLoader] = useState(false);

  const initialFormDataRef = useRef(formData);
  const initialPhotosListRef = useRef(photosList);

  const [activeTab, setActiveTab] = useState('');
  const [properties, setProperties] = useState([]);
  const fromScreen = route?.params?.screen ?? null;
  const overrideSave = route?.params?.overrideSave ?? false;

  const [errTotalPriceErr, setErrTotalPriceErr] = useState(null);
  const [modelChangeError, setModelChangeError] = useState(null);
  const [errShipPriceErr, setErrShipPriceErr] = useState(null);
  const [errHomiLabel, setErrHomiLabel] = useState(null);

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
    pounds: packageProperties.pounds ? null : 'Required',
    ounces: packageProperties.ounces ? null : 'Required',
    length: packageProperties.length ? null : 'Required',
    width: packageProperties.width ? null : 'Required',
    height: packageProperties.height ? null : 'Required',
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
    const dataToProp = [];

    if (formData?.listingType?.name === 'Vehicle') {
      dataToProp.push({name: 'Create Post'});
      dataToProp.push({name: 'Category'});
      dataToProp.push({name: 'Post Details'});
      dataToProp.push({name: 'Vehicle Details'});
      dataToProp.push({name: 'Price'});
    } else if (formData?.listingType?.name === 'Goods') {
      dataToProp.push({name: 'Create Post'});
      dataToProp.push({name: 'Category'});
      dataToProp.push({name: 'Post Details'});
      dataToProp.push({name: 'Price'});
      dataToProp.push({name: 'Delivery Method'});
    } else {
      dataToProp.push({name: 'Create Post'});
      dataToProp.push({name: 'Category'});
      dataToProp.push({name: 'Post Details'});
      dataToProp.push({name: 'Price'});
      dataToProp.push({name: 'Delivery Method'});
    }

    setProperties(dataToProp);

    if ((deliveryMethods?.data?.length ?? 0) === 0) {
      actions.getDeliveryMethods({categoryId: formData.subCategory.id});
    }
    return () => {
      if(fromScreen == 'profile'){
        actions.clearSell();
      }
    }
  }, []);

  useEffect(() => {
    if (
      prevFormData &&
      prevFormData.customProperties &&
      prevFormData.customProperties.model &&
      prevFormData.customProperties.model.name &&
      prevFormData.customProperties.make &&
      prevFormData.customProperties.make.name
    ) {
      if (
        formData &&
        formData.customProperties &&
        formData.customProperties.make &&
        formData.customProperties.make.name &&
        formData.customProperties.make.name !==
          prevFormData.customProperties.make.name
      ) {
        let tempData = formData;
        tempData.customProperties.model = {};
        setFormValue(tempData);
        setModelChangeError(true);
        setAlertText(
          `Model "${prevFormData.customProperties.model.name}" does not exist in Make "${formData.customProperties.make.name}".`,
        );
      } else {
        setModelChangeError(false);
        setAlertText('');
      }
    }
    if (
      formData &&
      formData.customProperties &&
      formData.customProperties.model &&
      !formData.customProperties.model.name
    ) {
      setModelChangeError(true);
    } else {
      setModelChangeError(false);
    }
    if (formData.success && prevFormData && !prevFormData.success) {
      actions.clearSell();

      actions.getPostsDraft({
        filters: {
          sellerId: userInfo.id,
          postStatus: 'Draft',
          page: 1,
          perPage: 20,
        },
      });

      dispatch(postImageUpload([]));
      navigation.navigate('Dashboard', {fromScreen: 'editPost'});
    }

    if (prevFormData?.listingType && formData?.listingType?.name) {
      if (prevFormData.subCategory.id !== formData.subCategory.id) {
        if (formData.subCategory.id) {
          actions.getDeliveryMethods({categoryId: formData.subCategory.id});
        }
      }
    }
  }, [formData]);

  useEffect(() => {
    const dataToProp = [];
    if (prevFormData?.listingType?.id !== formData?.listingType?.id) {
      if (formData?.listingType?.name === 'Vehicle') {
        dataToProp.push({name: 'Create Post'});
        dataToProp.push({name: 'Category'});
        dataToProp.push({name: 'Post Details'});
        dataToProp.push({name: 'Vehicle Details'});
        dataToProp.push({name: 'Price'});

        //load new vehicle templates

        //load delivery methods / payment methods
        const vehicleDeliveryMethod = defaultVehicleDeliveryMethod();

        dispatch(
          setFormValue({
            deliveryMethodsSelected: [vehicleDeliveryMethod],
            paymentMethodsSelected: vehicleDeliveryMethod.PaymentMethods,
          }),
        );

        dispatch(clearDeliveryMethods());
      } else if (formData?.listingType?.name === 'Goods') {
        dataToProp.push({name: 'Create Post'});
        dataToProp.push({name: 'Category'});
        dataToProp.push({name: 'Post Details'});
        dataToProp.push({name: 'Price'});
        dataToProp.push({name: 'Delivery Method'});
      }

      setProperties(dataToProp);
    }
  }, [formData, prevFormData, dispatch]);

  useEffect(() => {
    const homitagshipping = formData.deliveryMethodsSelected?.find(
      deliveryMethodSelected =>
        deliveryMethodSelected.code === 'homitagshipping',
    );
    const selectedProvider =
      homitagshipping?.deliveryCustomProperties?.optionsAvailable
        ?.find(option => option.selected === true)
        ?.providers?.find(prov => prov.selected === true);

    if (selectedProvider) {
      dispatch(getMinimumShipRate({shippingCost: selectedProvider.cost}));
    }
  }, [dispatch, formData.deliveryMethodsSelected]);

  useEffect(() => {
    if (isFetchingServer === true && checkingServer === true) {
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

      navigation.navigate('ExploreMain');
    }
  }, [isFetchingServer]);

  const handleCloseEditorClick = () => {
    // if (noDataChanged()) {
    discardCurrentChanges();
    // } else {
    //   setDialogVisible(true);
    //   return true;
    // }
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({handleCloseEditorClick});
      const handleBackButton = () => {
        // handleCloseEditorClick();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButton,
      );
      return () => subscription.remove();
    }, []),
  );

  const onModalTouchOutside = () => {
    setDialogVisible(false);
  };

  const discardCurrentChanges = () => {
    if (fromScreen === 'profile') {
      actions.clearSell();
    } else {
      actions.setFormValue(initialFormDataRef.current);
      actions.setPhotoList(initialPhotosListRef.current);
    }
    setDialogVisible(false);
    navigation.goBack();
  };

  const setDeliveryFormData = data => {
    const dataToTest = formData.deliveryMethodsSelected.find(
      element => element.id === data.id,
    );

    const isHomitagshipping = dataToTest?.code === 'homitagshipping';

    if (dataToTest) {
      // remove
      setErrHomiLabel(null);
      actions.setFormValue({
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
    } else {
      // add
      actions.setFormValue({
        deliveryMethodsSelected: [
          ...formData.deliveryMethodsSelected,
          ...[data],
        ],
      });
    }
    // alert(JSON.stringify(data));
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
      deliveryCustomProperties.shippingCost ||
      optionsAvailable
    ) {
      return false;
    } else {
      return true;
    }
  };
  const prepraidShippingLabelIsNotComplete = () => {
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

  const priceIsZero = () => {
    if (Number(formData.price) == 0) {
      return true;
    } else {
      return false;
    }
  };

  const noImageSelected = () => {
    if (Object.entries(formData?.listingType).length !== 0) {
      if (photosList.length === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const vehicleListingTypeRequirementsComplete = () => {
    if (
      formData?.listingType?.name === 'Vehicle' &&
      formData?.subCategory?.name === 'Cars'
    ) {
      if (
        formData?.customProperties?.make?.name &&
        formData?.customProperties?.model?.name &&
        formData?.customProperties?.year?.name
      ) {
        return true;
      }
    }

    if (
      formData?.listingType?.name === 'Vehicle' &&
      formData?.subCategory?.name !== 'Cars'
    ) {
      if (formData?.customProperties?.year?.name) {
        return true;
      }
    }

    // Bypass this check if the type is Goods
    if (formData?.listingType?.name === 'Goods') {
      return true;
    }

    return true;
  };

  const subCategoryIsSelected = () => {
    if (formData?.subCategory?.id) {
      return true;
    }
    return false;
  };

  const postTitleIsEmpty = () => {
    if (formData?.postTitle?.trim() !== '') {
      return false;
    }

    return true;
  };

  const postDescriptionIsEmpty = () => {
    if (formData?.postDescription?.trim() !== '') {
      return false;
    }

    return true;
  };

  const locationCountryIsValid = () => {
    if (formData?.location?.country) {
      return true;
    }

    return false;
  };

  const conditionIsNotSelected = () => {
    if (formData?.condition?.length > 0) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (initialFormDataRef.current === null) {
      initialFormDataRef.current = formData;
    }
  }, [formData]);

  const formDataIsNotChanged = _.isEqual(initialFormDataRef.current, formData);

  const photosIsNotChanged = _.isEqual(
    initialPhotosListRef.current,
    photosList,
  );

  const noDataChanged = formDataIsNotChanged && photosIsNotChanged;

  const saveEditedPostDetail = () => {
    const areArrayEqual = _.isEqual(savePostDetailData?.photosList, photosList);
    if (
      formData?.listingType?.name === 'Vehicle' &&
      formData?.subCategory?.name !== 'Cars'
    ) {
      actions.setFormValue({
        customProperties: {
          year: formData?.customProperties?.year,
          color: formData?.customProperties?.color,
        },
      });
    }

    if (fromScreen === 'profile') {
     actions.syncServer({
        formData,
        photosList,
        userId: userInfo.id,
        photosListInServer,
      });
    } else {
      setPhotoList(photosList);
      if (activeTab == 'Create Post' && !areArrayEqual) {
        const productId = formData?.productId
          ? formData?.productId
          : savePostDetailData?.productId;
        handleImageUploadAndUpdate(
          productId,
          photosList,
          formData,
          photosListInServer,
          postImageUploaded,
          dispatch,
        );
        navigation.goBack();
      } else if (activeTab == 'Category') {
        handlePostDetailButton();
      } else if (activeTab == 'Post Details') {
        handlePostDetailButton();
      } else if (activeTab == 'Price') {
        handlePostDetailButton();
      } else if (activeTab == 'Delivery Method') {
        handlePostDetailButton();
      } else {
        navigation.goBack();
      }
    }
  };

  const handlePostDetailButton = async () => {
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
      setLoader(true);
      const areArrayEqual = _.isEqual(
        savePostDetailData?.photosList,
        photosList,
      );
      delete savePostDetailData.productId;
      delete savePostDetailData.photosList;
      const areObjectsEqual = _.isEqual(savePostDetailData, dataToProduct);
      if (areObjectsEqual) {
        setLoader(false);
        dataToProduct.photosList = photosList;
        dispatch(
          savePostDetail({
            productId: productId,
            ...dataToProduct,
          }),
        );
        navigation.goBack();
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
          setLoader(false);
          navigation.goBack();
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
    }
  };

  const [alertText, setAlertText] = useState('');

  const sendAlert = data => {
    setAlertText('');
    const price = Number(formData.price);
    const minShippingPrice =
      data?.deliveryCustomProperties?.rangeAvailable?.[0];
    const maxShippingPrice =
      data?.deliveryCustomProperties?.rangeAvailable?.[1];

    if (price < 3 && data?.code !== 'pickup') {
      setAlertText(
        'Minimum price for prepaid shipping and ship independently is $3',
      );
      return;
    }

    if (
      data?.deliveryCustomProperties?.rangeAvailable &&
      (price < minShippingPrice || price > maxShippingPrice)
    ) {
      setAlertText(
        `This delivery method is only available for a price range between $${minShippingPrice} and $${maxShippingPrice}`,
      );
    } else {
      setAlertText('');
    }
  };

  const [buttonVisibility, setButtonVisibility] = useState(true);
  useEffect(() => {
    const keyboardDidShow = () => {
      setButtonVisibility(false);
    };

    const keyboardDidHide = () => {
      setButtonVisibility(true);
    };
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide,
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
        keyboardVerticalOffset={60}>
        <SafeAreaView style={safeAreaViewWhite}>
          <Tabs
            properties={properties}
            activeTab={activeTab}
            setActiveTab={tabName => {
              setAlertText('');
              setActiveTab(tabName);
            }}
          />
          <View style={styles.editorContainer}>
            {activeTab === '' && (
              <View style={styles.emptyContainer}>
                <BodyText
                  size="medium"
                  theme="active"
                  align="center"
                  style={{color: 'rgba(49, 51, 52, 0.67)', marginBottom: 20}}>
                  Select which section you want to edit above.
                </BodyText>
                <BodyText
                  size="medium"
                  theme="active"
                  align="center"
                  style={{color: 'rgba(49, 51, 52, 0.67)'}}>
                  Pressing "Save Changes" will save all of your changes.
                </BodyText>
              </View>
            )}
            {activeTab === 'Create Post' && (
              <CreatePostTab
                navigation={navigation}
                emptyImageAlert={noImageSelected() === true}
                fromScreen={fromScreen}
              />
            )}
            {activeTab === 'Category' && (
              <>
                {formData?.listingType?.name !== 'Vehicle' && (
                  <CategoriesSection fromEditor />
                )}
                <SubcategoriesSection
                  categoryType={formData?.listingType?.name}
                  fromEditor
                />
              </>
            )}
            {activeTab === 'Post Details' && (
              <PostDetails
                navigation={navigation}
                formData={formData}
                setFormValue={actions.setFormValue}
                fromScreen={fromScreen}
              />
            )}
            {activeTab === 'Price' && (
              <PriceTab
                formData={formData}
                errTotalPriceErr={errTotalPriceErr}
                setErrTotalPriceErr={setErrTotalPriceErr}
                setPackageProperties={setPackageProperties}
                setPackagePropertiesError={setPackagePropertiesError}
              />
            )}
            {activeTab === 'Delivery Method' && (
              <DeliveryMethodTab
                deliveryMethods={deliveryMethods}
                packageProperties={packageProperties}
                setPackageProperties={setPackageProperties}
                packagePropertiesError={packagePropertiesError}
                handlePackagePropertiesOnChange={
                  handlePackagePropertiesOnChange
                }
                handlePackagePropertiesOnBlur={handlePackagePropertiesOnBlur}
                formData={formData}
                setDeliveryFormData={setDeliveryFormData}
                updateDeliveryFormData={updateDeliveryFormData}
                errShipPriceErr={errShipPriceErr}
                setErrShipPriceErr={setErrShipPriceErr}
                sendAlert={sendAlert}
                setErrHomiLabel={setErrHomiLabel}
                errHomiLabel={errHomiLabel}
                getMinimumShipRate={actions.getMinimumShipRate}
                minShippingRate={minShippingRate}
                subCategoryIsSelected={subCategoryIsSelected()}
                locationCountryIsValid={locationCountryIsValid()}
              />
            )}
            {activeTab === 'Vehicle Details' && !formData.subCategory.id && (
              <View style={styles.emptyContainer}>
                <BodyText
                  size="medium"
                  theme="active"
                  align="center"
                  style={{color: 'rgba(49, 51, 52, 0.67)', marginBottom: 20}}>
                  Select a category previous to configure the vehicle details.
                </BodyText>
              </View>
            )}
            {activeTab === 'Vehicle Details' && formData.subCategory.id && (
              <VehicleList
                fromScreen={fromScreen}
                navigation={navigation}
                formData={formData}
              />
            )}
          </View>
          {alertText !== '' && (
            <Text
              style={{
                ...Fonts.style.homiTagText,
                color: Colors.red,
                width: '100%',
                paddingHorizontal: 10,
                textAlign: 'center',
              }}>
              {alertText}
            </Text>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
      {buttonVisibility && (
        <FooterAction
          mainButtonProperties={{
            label: 'Save Changes',
            disabled:
              photosList.length === 0
                ? true
                : overrideSave
                ? noDataChanged ||
                  noDeliveryMethodSelected() ||
                  prepraidShippingLabelIsNotComplete() ||
                  shipIndependentlyIsNotValid()
                : vehicleListingTypeRequirementsComplete() === false ||
                  noDeliveryMethodSelected() ||
                  prepraidShippingLabelIsNotComplete() === true ||
                  shipIndependentlyIsNotValid() ||
                  subCategoryIsSelected() === false ||
                  postTitleIsEmpty() ||
                  postDescriptionIsEmpty() ||
                  locationCountryIsValid() === false ||
                  conditionIsNotSelected() === false ||
                  priceIsZero() ||
                  noImageSelected() ||
                  noDataChanged ||
                  modelChangeError ||
                  errHomiLabel ||
                  errTotalPriceErr ||
                  errShipPriceErr,
            onPress: () => {
              saveEditedPostDetail();
            },
            showLoading: loader,
          }}
        />
      )}
      <SweetDialog
        title="Edit Post"
        message="Are you sure you want to discard these changes?"
        type="two"
        mainBtTitle="Discard"
        secondaryBtTitle="Cancel"
        dialogVisible={dialogVisible}
        onTouchOutside={onModalTouchOutside}
        onMainButtonPressed={discardCurrentChanges}
        onSecondaryButtonPressed={onModalTouchOutside}
      />
      {(isFetchingServer || minShippingRate.isFetching) && <ScreenLoader />}
      <SafeAreaView style={safeAreaNotchHelper} />
      {/* {minShippingRate.isFetching && <ScreenLoader />} */}
    </>
  );
};

export default EditorScreen;
