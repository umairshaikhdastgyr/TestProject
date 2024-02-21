import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView, View, ScrollView, Keyboard} from 'react-native';
import {SweetAlert, FooterAction, Loader, Toast} from '#components';
import {safeAreaViewWhite, safeAreaNotchHelper} from '#styles/utilities';
import styles from './styles';
import {selectUserData} from '#modules/User/selectors';
import {
  getAddressList,
  addAddress,
  updateAddress,
  addressErrorRemove,
} from '#modules/User/actions';

import {selectSellData} from '#modules/Sell/selectors';
import AddAddressForm from './sections/add-address';
import AddressList from './AddressList';
import {apiModels} from '#services/apiModels';
import {useFocusEffect} from '@react-navigation/native';

const ShippingInfo = ({navigation, route}) => {
  /* Selectors */
  const {shippingRate} = useSelector(selectSellData());
  const {addressListState, addAddressState, paymentMethodDefault} = useSelector(
    selectUserData(),
  );
  const screenDetails = route?.params?.data;

  const dispatch = useDispatch();

  const from = route?.params?.from;
  const quantitySelected = route?.params?.quantitySelected ?? 1;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    address: '',
    zipcode: '',
  });
  const [isDefault, setIsDefault] = useState(false);
  const [addressObj, setAddressObj] = useState({
    name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'us',
  });
  const [alertStatus, setAlertStatus] = useState({
    visible: false,
    message: '',
    type: '',
  });
  const [buttonVisibility, setButtonVisibility] = useState(true);
  const [toastMessage, setToastMessage] = useState({
    message: '',
    isVisible: false,
  });

  const sIndependentlyDlryMethod = screenDetails.DeliveryMethods.find(
    item => item.code === 'shipindependently',
  );

  const handleDefaultChange = () => setIsDefault(!isDefault);

  const enableNext = Object.entries(addressObj)
    .filter(([key]) => key !== 'address_line_2')
    .every(([key, value]) => !!value);

  const _verifyUserHasDefaultPaymentMethod = () => {
    const defaultPayment = paymentMethodDefault.default;

    if (defaultPayment) {
      return true;
    }
    return false;
  };

  /**
   * @description Modify the address object given a key
   * @param {String} key Address object property to be modified
   * @param {String} value Value to be set to key
   */
  const handleAddressOnChange = (key = '', value = '') => {
    setErrorMessage({
      address: '',
      zipcode: '',
    });
    setToastMessage({
      message: '',
      isVisible: false,
    });
    setAddressObj({
      ...addressObj,
      [key]: value,
    });
  };

  /**
   * @description Navigate to the right route after address is pressed
   * @returns Void
   */
  const handleAddressOnPress = async address => {
    try {
      setIsLoading(true);
      let addressToValidate = {
        address1: address.address_line_1,
        address2: address.address_line_2,
        city: address.city,
        state: address.state,
        zip: address.zipcode,
      };

      if (address.address_line_2) {
        addressToValidate.address2 = address.address_line_2;
      }

      let response = await apiModels(
        'orders/shipping/validateAddress?provider=usps',
        'POST',
        {
          params: addressToValidate,
        },
      );
      const data = {
        validation: response?.isValid,
        validAddress: response?.address,
      };
      const checkAddress = {
        fedex: [],
        ups: [],
        usps: [data],
        status: response?.status,
      };

      if (checkAddress.usps && !checkAddress.usps?.[0]?.validation) {
        setToastMessage({
          isVisible: true,
          message: 'Please, insert a valid address.',
        });
        return;
      } else {
      }

      const addressResult = {
        ...checkAddress?.fedex?.[0],
        ...checkAddress?.ups?.[0],
        ...checkAddress?.usps?.[0],
      };

      dispatch(
        addAddress({
          ...address,
          address_line_1: addressResult.address1 ?? address.address_line_1,
          address_line_2: addressResult.address2 ?? address.address_line_2,
          zipcode: addressResult.zip ?? address.zipcode,
          country: addressResult.country ?? address.country,
          default: isDefault,
        }),
      );
      navigateAfterAddressAddOrSelect(address);
    } catch (e) {
      console.log('error', e);
      setErrorMessage({
        ...errorMessage,
        address: 'Please, insert a valid address.',
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  useFocusEffect(
    useCallback(() => {
      dispatch(getAddressList());
    }, []),
  );
  useEffect(() => {
    if (addAddressState?.failure?.length > 0) {
      setAlertStatus({
        message: addAddressState?.failure,
        visible: true,
        type: 'error',
      });
    }
  }, [addAddressState]);

  const onAlertModalTouchOutside = () => {
    setAlertStatus({
      message: '',
      type: '',
      visible: false,
    });
    dispatch(addressErrorRemove());
  };

  const navigateAfterAddressAddOrSelect = (address, indexObj) => {
    let shippCost = {};
    const customProperties =
      sIndependentlyDlryMethod?.DeliveryMethodPerPost?.customProperties;

    if (customProperties?.freeOption?.valueSelected) {
      shippCost = {text: 'Free', value: '0.00'};
    } else {
      shippCost = {
        text: customProperties?.shippingCost
          ? `$ ${parseFloat(customProperties?.shippingCost).toFixed(2)}`
          : '0.00',
        value: customProperties?.shippingCost || 0,
      };
    }

    if (from === 'confirmation') {
      const addressArr = addressListState?.data?.map((item, index) => ({
        ...item,
        default: indexObj === index ? true : false,
      }));
      const addressList = addressArr?.filter(obj => obj?.default);

      dispatch(
        updateAddress({
          id: addressList[0]?.id,
          address: {
            name: addressList[0]?.name,
            address_line_1: addressList[0]?.address_line_1,
            address_line_2: addressList[0]?.address_line_2,
            city: addressList[0]?.city,
            state: addressList[0]?.state,
            zipcode: addressList[0]?.zipcode,
            country: addressList[0]?.country,
            default: addressList[0]?.default,
          },
        }),
      );
      route?.params?.setAddress({
        ...address,
        shippingCost: shippCost,
      });
      navigation.goBack();
      return;
    }

    if (_verifyUserHasDefaultPaymentMethod()) {
      navigation.navigate('PaymentConfirmationScreen', {
        data: screenDetails,
        address: {...address, shippingCost: shippCost},
        from: 'ShippingInfo',
        quantitySelected,
      });
      return;
    }

    navigation.navigate('PaymentScreen', {
      data: screenDetails,
      address: {...address, shippingCost: shippCost},
      from: 'ShippingInfo',
      quantitySelected,
    });
    return;
  };

  return (
    <>
      {addressListState &&
      addressListState.data &&
      addressListState.data.length ? (
        <SafeAreaView style={safeAreaViewWhite}>
          <Toast
            autoHideMs={3000}
            message={toastMessage.message}
            isVisible={toastMessage.isVisible}
            linkLabel="Back to Explore"
            linkOnPress={() => navigation.navigate('ExploreMain')}
          />
          {(addressListState?.data?.length ?? 0) >= 1 && (
            <AddressList
              addressList={addressListState?.data}
              handleAddressOnPress={navigateAfterAddressAddOrSelect}
            />
          )}
        </SafeAreaView>
      ) : (
        <SafeAreaView style={safeAreaViewWhite}>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled">
            <View style={{flex: 1, padding: 20}}>
              <AddAddressForm
                address={addressObj}
                handleOnChange={handleAddressOnChange}
                isDefault={isDefault}
                onDefaultChange={handleDefaultChange}
                errorMessage={errorMessage}
                toastMessage={toastMessage}
              />
            </View>
          </ScrollView>
          {buttonVisibility && (
            <FooterAction
              mainButtonProperties={{
                label: 'Next',
                subLabel: 'PAYMENT METHOD',
                disabled:
                  !enableNext || isLoading || addAddressState.isFetching,
                onPress: () => handleAddressOnPress(addressObj),
              }}
            />
          )}
        </SafeAreaView>
      )}
      <SweetAlert
        title={''}
        message={alertStatus.message}
        type={alertStatus.type}
        dialogVisible={alertStatus.visible}
        onTouchOutside={onAlertModalTouchOutside}
        onDone={onAlertModalTouchOutside}
      />
      <SafeAreaView style={safeAreaNotchHelper} />
      {addressListState.isFetching ||
        shippingRate.isFetching ||
        (addAddressState.isFetching && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}>
            <Loader />
          </View>
        ))}
    </>
  );
};

export default ShippingInfo;
