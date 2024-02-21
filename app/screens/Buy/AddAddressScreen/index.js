import React, {useCallback, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Keyboard,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useActions} from '#utils';
import {apiModels} from '#services/apiModels';
import {addAddress, updateAddress, getAddressList} from '#modules/User/actions';

import {deleteAddress as deleteAddressApi} from '#services/apiUsers';

import {selectUserData} from '#modules/User/selectors';

import {FooterAction} from '#components';
import ScreenLoader from '#components/Loader/ScreenLoader';
import AddAddressForm from '../ShippingInfoScreen/sections/add-address';
import {safeAreaViewWhite, safeAreaNotchHelper} from '#styles/utilities';
import styles from './styles';

const AddAddressScreen = ({navigation, route}) => {
  let keyboardDidShowListener = null;
  let keyboardDidHideListener = null;

  const [editable] = useState(() => route?.params?.editable ?? false);
  const addr = route?.params?.address ?? {};
  const [addressObj, setAddressObj] = useState({
    name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'US',
    ...addr,
  });
  const [isAddressModified, setIsAddressModified] = useState(false);

  const [isDefault, setIsDefault] = useState(false);
  const [loader, setLoader] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [buttonVisibility, setButtonVisibility] = useState(true);
  const [errorMessage, setErrorMessage] = useState({
    address: '',
    zipcode: '',
  });
  const [toastError, setToastError] = useState({
    isVisible: false,
    message: '',
  });

  const {
    addAddressState,
    addressListState,
    information: userInfo,
  } = useSelector(selectUserData());

  /* Actions */
  const actions = useActions({
    addAddress,
    updateAddress,
    getAddressList,
  });

  const handleDefaultChange = () => {
    setIsDefault(!isDefault);
    if (editable) {
      setIsAddressModified(true);
    }
  };

  const handleAdd = async () => {
    setButtonLoader(true);
    let address = {
      ...addressObj,
    };

    let addressToValidate = {
      address1: address.address_line_1,
      address2:
        address.address_line_2 !== '' ? address.address_line_2 : undefined,
      city: address.city,
      state: address.state,
      zip: address.zipcode,
    };

    if (address.address_line_2) {
      addressToValidate.address2 = address.address_line_2;
    }

    //const check = addressListState.data[0].address_line_1;
    const check = addressListState.data.find(
      data =>
        data.address_line_1 == address.address_line_1 &&
        data.state == address.state &&
        data.zipcode == address.zipcode,
    );
    if (check) {
      Alert.alert('Oops!', 'Address already exists in the account');
      setButtonLoader(false);
    } else if (addressObj.name?.length == 0) {
      setToastError({
        isVisible: true,
        message: 'Please, insert a valid full name.',
      });
      setButtonLoader(false);
      return;
    } else if (addressObj.address_line_1?.length == 0) {
      setToastError({
        isVisible: true,
        message: 'Please, insert a valid address 1.',
      });
      setButtonLoader(false);
      return;
    } else if (addressObj.city?.length == 0) {
      setToastError({
        isVisible: true,
        message: 'Please, insert a valid city.',
      });
      setButtonLoader(false);
      return;
    } else if (addressObj.state?.length == 0) {
      setToastError({
        isVisible: true,
        message: 'Please, insert a valid state.',
      });
      setButtonLoader(false);
      return;
    } else if (addressObj.zipcode?.length == 0) {
      setToastError({
        isVisible: true,
        message: 'Please, insert a valid zipcode.',
      });
      setButtonLoader(false);
      return;
    } else {
      try {
        let response = await apiModels(
          '/orders/shipping/validateAddress?provider=usps',
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
          setToastError({
            isVisible: true,
            message: 'Please, insert a valid address.',
          });
          setButtonLoader(false);
          return;
        } else {
          const addressResult = {
            ...checkAddress?.fedex?.[0],
            ...checkAddress?.ups?.[0],
            ...checkAddress?.usps?.[0],
          };
          actions.addAddress({
            ...address,
            address_line_1: addressResult.address1 ?? address.address_line_1,
            address_line_2: addressResult.address2 ?? address.address_line_2,
            city: addressResult.city ?? address.city,
            zipcode: addressResult.zip ?? address.zipcode,
            country: addressResult.country ?? address.country,
            default: addressListState?.data?.length == 0 ? true : isDefault,
          });
          actions.getAddressList();
          setButtonLoader(false);
          navigation.goBack();
        }
      } catch (e) {
        setErrorMessage({
          ...errorMessage,
          address: 'Please, insert a valid address.',
        });
        setButtonLoader(false);
      }
    }
  };

  const handleUpdate = async () => {
    setLoader(true);
    let address = {...addressObj};

    let addressToValidate = {
      address1: address.address_line_1,
      address2:
        address.address_line_2 !== '' ? address.address_line_2 : undefined,
      city: address.city,
      state: address.state,
      zip: address.zipcode,
    };

    if (address.address_line_2) {
      addressToValidate.address2 = address.address_line_2;
    }

    try {
      let response = await apiModels(
        '/orders/shipping/validateAddress?provider=usps',
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
        setToastError({
          isVisible: true,
          message: 'Please, insert a valid address.',
        });
        setLoader(false);
        return;
      } else {
        if (addr?.id) {
          const addressResult = {
            ...checkAddress?.fedex?.[0],
            ...checkAddress?.ups?.[0],
            ...checkAddress?.usps?.[0],
          };

          actions.updateAddress({
            id: addr.id,
            address: {
              name: address.name,
              address_line_1: addressResult.address1 ?? address.address_line_1,
              address_line_2: addressResult.address2 ?? address.address_line_2,
              city: addressResult.city ?? address.city,
              zipcode: addressResult.zip ?? address.zipcode,
              country: addressResult.country ?? address.country,
              state: addressResult?.state ?? address.state,
              default: addr?.default || isDefault,
            },
          });
          actions.getAddressList();
          navigation.goBack();
        }
      }
    } catch (e) {
      setErrorMessage({
        ...errorMessage,
        address: 'Please, insert a valid address.',
      });
      setLoader(false);
    }
  };

  const handleDelete = async () => {
    if (addr?.id) {
      const deleteResult = await deleteAddressApi(userInfo.id, addr.id);
      navigation.goBack();
    }
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
    setToastError({
      message: '',
      isVisible: false,
    });
    setAddressObj({
      ...addressObj,
      [key]: value,
    });
    const data = {
      ...addressObj,
      [key]: value,
    };

    if (editable) {
      if (
        addr?.name == data?.name &&
        addr?.address_line_1 == data?.address_line_1 &&
        addr?.address_line_2 == data?.address_line_2 &&
        addr?.city == data?.city &&
        addr?.state == data?.state &&
        addr?.zipcode == data?.zipcode
      ) {
        setIsAddressModified(false);
      } else {
        setIsAddressModified(true);
      }
    } else {
      if (
        data.name?.length == 0 ||
        data.address_line_1?.length == 0 ||
        data.city?.length == 0 ||
        data.state?.length == 0 ||
        data.zipcode?.length == 0
      ) {
        setIsAddressModified(false);
      } else {
        setIsAddressModified(true);
      }
    }
  };

  /* Effetcs */
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

  if (editable) {
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: headerRight,
      });
    }, [navigation]);
  }

  const headerRight = () => {
    return (
      <>
        {editable && !addr.default ? (
          <TouchableOpacity
            onPress={() => {
              handleDelete();
            }}
            style={styles.rightIcon}>
            <AntDesign color={'#000000'} name="delete" size={20} />
          </TouchableOpacity>
        ) : null}
      </>
    );
  };

  return (
    <>
      <SafeAreaView style={safeAreaViewWhite}>
        {(addAddressState.isFetching || loader) && <ScreenLoader />}
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <AddAddressForm
            address={addressObj}
            handleOnChange={handleAddressOnChange}
            isDefault={isDefault || addressObj?.default}
            onDefaultChange={handleDefaultChange}
            errorMessage={errorMessage}
            toastMessage={toastError}
          />
        </ScrollView>
        {buttonVisibility && (
          <FooterAction
            mainButtonProperties={{
              label: editable ? 'Save' : 'Add Address',
              disabled: !isAddressModified,
              onPress: editable ? handleUpdate : handleAdd,
              showLoading: buttonLoader,
            }}
            {...(editable && !addressObj.default ? null : {})}
          />
        )}
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default AddAddressScreen;
