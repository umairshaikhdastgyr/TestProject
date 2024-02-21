import { Alert } from 'react-native';
import useActions from './useActions';
import parseDateToTimeAgo from './parseDateToTimeAgo';
import { checkEmail, checkPass } from './validation';
import 'intl';
import 'intl/locale-data/jsonp/en';
import {
  AccountSettings,
  NotificationSettings,
  FAKE_DEFAULT_DISTANCE,
} from '../constants';
import Geocoder, { regionFrom } from './geocoder';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import auth from '@react-native-firebase/auth';

const showAlert = (title, phrase, onPress = () => null) => {
  Alert.alert(title, phrase, [{ text: 'OK', onPress }], {
    cancelable: false,
  });
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});


const capitalize = (s) => {
  if (typeof s !== 'string') {
    return '';
  }
  const str = s.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getFirebaseLink = async (deeplinkParam) => {
    const link = await dynamicLinks().buildShortLink({
      link: `https://www.homitag.com${deeplinkParam}`,
      domainUriPrefix: 'https://homitag.page.link',
      android: {
        packageName: 'com.homitag.app',
      },
      ios: {
        bundleId: 'com.homitag.app',
        appStoreId: '1483007119',
  
      }
    });
    return link;
};

export const getFirebaseLinkForPost = async (
  deeplinkParam,
  imageLink,
  title,
  desc,
) => {
    const link = await dynamicLinks().buildLink({
      link: `https://www.homitag.com/${deeplinkParam}`,
      domainUriPrefix: 'https://homitag.page.link',
      social: {
        descriptionText: desc,
        imageUrl: imageLink,
        title,
      },
      android: {
        packageName: 'com.homitag.app',
      },
      ios: {
        bundleId: 'com.homitag.app',
        appStoreId: '1483007119',
  
      }
    });
    return link;
  
};

const getAddress = (location) => {
  let locality = '';
  let administrative_area_level_1 = '';
  for (const key in location?.address_components) {
    if (location?.address_components[key]?.types?.includes('locality')) {
      locality = location?.address_components[key]?.long_name;
    } else if (
      location?.address_components[key]?.types?.includes(
        'administrative_area_level_1',
      )
    ) {
      administrative_area_level_1 = location?.address_components[key]?.short_name;
    }
  }
  return `${locality} ${locality ? "," : ""} ${administrative_area_level_1}`;
};

const numberWithCommas = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const convertNumberToCurrency = (number) => number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
const mapAccountSettingsData = (respObj, settingType) => {
  const res = [];

  const settings = settingType == 'Account' ? AccountSettings : NotificationSettings;
  settings.items.map((item) => {
    let settingType = {
      subTitle: item.subTitle,
      type: item.type,
      subItem: [],
    };
    if (respObj.data[item.type]) {
      item.subItem.map((sub) => {
        if (
          respObj.data[item.type][sub.property] == true
          || respObj.data[item.type][sub.property] == false
        ) {
          settingType = {
            ...settingType,
            subItem: [
              ...settingType.subItem,
              {
                property: sub.property,
                text: sub.text,
                value: respObj.data[item.type][sub.property],
              },
            ],
          };
        }
      });
      res.push(settingType);
    }
  });
  return res;
};
const convertCurrencyToNumber = (currency) => Number(currency.replace(/[^0-9.-]+/g, ''));

const getMapObjectFromGoogleObj = (googleObj) => {
  const locationParsed = {
    country: googleObj?.address_components?.reduce(
      (newString, address_component) => {
        if (address_component?.types?.includes('country')) {
          newString = address_component?.short_name;
        }
        return newString;
      },
      '',
    ),
    state: googleObj?.address_components?.reduce(
      (newString, address_component) => {
        if (address_component.types.includes('administrative_area_level_1')) {
          newString = address_component.short_name;
        }
        return newString;
      },
      '',
    ),
    city: googleObj?.address_components?.reduce(
      (newString, address_component) => {
        if (address_component.types.includes('locality')) {
          newString = address_component.long_name;
        }
        if (
          newString === ''
          && address_component.types.includes('sublocality')
        ) {
          newString = address_component.long_name;
        }
        if (
          newString === ''
          && address_component.types.includes('administrative_area_level_2')
        ) {
          newString = address_component.long_name;
        }

        if (
          newString === ''
          && address_component.types.includes('administrative_area_level_2')
        ) {
          newString = address_component.long_name;
        }
        return newString;
      },
      '',
    ),
    short_city_name: googleObj?.address_components?.reduce(
      (newString, address_component) => {
        if (address_component.types.includes('locality')) {
          newString = address_component.short_name;
        }
        if (
          newString === ''
          && address_component.types.includes('sublocality')
        ) {
          newString = address_component.short_name;
        }
        if (
          newString === ''
          && address_component.types.includes('administrative_area_level_2')
        ) {
          newString = address_component.short_name;
        }

        if (
          newString === ''
          && address_component.types.includes('administrative_area_level_2')
        ) {
          newString = address_component.short_name;
        }
        return newString;
      },
      '',
    ),
    postalCode: googleObj?.address_components?.reduce(
      (newString, address_component) => {
        if (address_component.types.includes('postal_code')) {
          newString = address_component.short_name;
        }
        return newString;
      },
      '',
    ),
    formattedAddress: googleObj?.formatted_address,
    latitude: googleObj?.geometry?.location?.lat,
    longitude: googleObj?.geometry?.location?.lng,
    googleObj,
  };

  return locationParsed;
};

const isDefaultDistance = (distance) => distance === FAKE_DEFAULT_DISTANCE;

const saveAppleDataToFirebase = (identityToken, nonce) => {
  const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
  return new Promise((resolve, reject) => {
    auth().signInWithCredential(appleCredential).then(response => {
      resolve(response)
    })
      .catch(_error => {
        console.log(_error)
        reject({ success: false })
      })
  })
}

const getProductShareLink = async (
  deeplinkParam,
  imageLink,
  title,
  desc) => {
    try {
      const link = await dynamicLinks().buildShortLink({
        link: `https://www.homitag.com${deeplinkParam}`,
        domainUriPrefix: 'https://homitag.page.link',
        social: {
          descriptionText: desc,
          imageUrl: imageLink,
          title,
        },
        android: {
          packageName: 'com.homitag.app',
        },
        ios: {
          bundleId: 'com.homitag.app',
          appStoreId: '1483007119',
    
        }
      });

      return link;
    } catch (error) {
      console.log('erroorrr ',error);
    }
      
  
};

export {
  Geocoder,
  regionFrom,
  useActions,
  parseDateToTimeAgo,
  showAlert,
  checkEmail,
  checkPass,
  capitalize,
  getAddress,
  numberWithCommas,
  convertNumberToCurrency,
  convertCurrencyToNumber,
  getMapObjectFromGoogleObj,
  mapAccountSettingsData,
  isDefaultDistance,
  currencyFormatter,
  getFirebaseLink,
  saveAppleDataToFirebase,
  getProductShareLink,
};
