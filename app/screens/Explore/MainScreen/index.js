import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {BoostScreen} from '../../Profile/DashboardScreen/BoostScreen';

import {
  SafeAreaView,
  Animated,
  View,
  Platform,
  Dimensions,
  ActivityIndicator,
  Share,
  AppState,
  NativeModules,
  BackHandler,
} from 'react-native';
import {
  getPosts as getPostsApi,
  getPostDetail as getPostDetailApi,
} from '#services/apiPosts';

import Geolocation from 'react-native-geolocation-service';
import {selectOrderData} from '#modules/Orders/selectors';

import {getUserInfo as getUserInfoApi} from '#services/apiUsers';
import moment from 'moment';
import {Loader, SweetCustomAlert, Toast} from '#components';
import ProductsList from './views/ProductsList';
import FilterInput from './views/ProductsFilters/filter-input';
import Categories from './views/ProductsFilters/categories';
import MoreFilters from './views/ProductsFilters/more-filters';
import SelectedFilters from './views/ProductsFilters/selected-filters';
import SuccessModal from './SuccessModal';
import {Utilities} from '#styles';

import {Geocoder, getFirebaseLink, getMapObjectFromGoogleObj} from '#utils';
import {
  getUserInfo,
  getPaymentBanks,
  getUserSellList,
  addAddress,
} from '#modules/User/actions';
import {selectFiltersData} from '#modules/Filters/selectors';
import {getCategories} from '#modules/Categories/actions';
import {getPosts, getPostNextPage} from '#modules/Posts/actions';
import {selectPostsData} from '#modules/Posts/selectors';
import {selectUserData} from '#modules/User/selectors';
import {selectCategoriesData} from '#modules/Categories/selectors';

import {notificationSelector} from '../../../modules/Notifications/selectors';
import {persistFilterValues} from '#modules/Filters/actions';
import {
  FAKE_DEFAULT_DISTANCE,
  flatten,
  isJsonString,
  removeEmptyAndUndefined,
} from '#constants';
import {ShareDialog} from 'react-native-fbsdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {useFocusEffect} from '@react-navigation/native';
import {receiveConversations} from '#modules/Chat/actions';
import {selectSellData} from '#modules/Sell/selectors';
import {userSelector} from '#modules/User/selectors';
import {clearOrder} from '#modules/Orders/actions';
const screenWidth = Math.round(Dimensions.get('window').width);
import dynamicLinks from '@react-native-firebase/dynamic-links';
import queryString from 'query-string';
import {getNotificationList} from '../../../modules/Notifications/actions';
import ConfirmationPopup from './ConfirmationPopup';
import {checkIfFirstOrderPosted} from '#services/apiOrders';
import {getPaymentMethods} from '#services/apiUsers';
import {Colors} from '#themes';
import {apiModels} from '#services/apiModels';
import {isEmpty} from 'lodash';
import {getCategories as getCategoriesApi} from '#services/apiCatalog';
import useCheckNetworkInfo from '../../../hooks/useCheckNetworkInfo';
import {apiInstance} from '#services/httpclient';
import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import RNExitApp from 'react-native-exit-app';

const MainScreen = ({navigation, route}) => {
  const {internetAvailable} = useCheckNetworkInfo();
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [boostStatus, setBoostStatus] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGetPostData, setIsGetPostData] = useState(true);
  const [isFetchPostData, setIsFetchPostData] = useState(false);
  const [isLocationUpdate, setIsLocationUpdate] = useState(false);

  const boost = route?.params?.boost;

  useEffect(() => {
    if (boost === 'true') {
      setBoostStatus(true);
    }
  }, [boost]);

  let exitApp = 0;

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      exitApp = 0;
    }

    appState.current = nextAppState;
    console.log('----------AppState', appState.current);
  };

  const backAction = () => {
    if (exitApp === 0) {
      exitApp = exitApp + 1;
      showMessage({
        message: 'Tap back again to exit the App',
        type: 'info',
      });
    } else if (exitApp === 1) {
      RNExitApp.exitApp();
    }
    return true;
  };

  useEffect(() => {
    const handleBackButton = () => {
      backAction();
      return true;
    };
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );
    return () => subscription.remove();
  }, []);

  const {user} = useSelector(userSelector);

  /* Selectors */
  const {filterValues, properties, defaultValues} = useSelector(
    selectFiltersData(),
  );
  const {draftsList, postDetailforBoost, formData} = useSelector(
    selectSellData(),
  );

  const {totalPostData, isLoadPost, postsList} = useSelector(selectPostsData());
  const {
    notifications: {notificationList},
  } = useSelector(notificationSelector);

  const {information: userInfo, addressListState} = useSelector(
    selectUserData(),
  );
  const {categoriesList} = useSelector(selectCategoriesData());

  const dispatch = useDispatch();

  /* States */
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterFocused, setIsFilterFocused] = useState(false);
  const [filtersCount, setFiltersCount] = useState(0);
  const [sellPost, setSellPost] = useState({});
  const [showDepositMethodPopup, setShowDepositMethodPopup] = useState(false);

  const [successModal, setSuccessModal] = useState({
    isVisible: false,
    message: '',
  });

  const [dialogVisible, setDialogVisible] = useState(false);

  const animatedValueScrollY = useRef(new Animated.Value(0)).current;

  const handleDeeplinks = async link => {
    dynamicLinks()
      .getInitialLink()
      .then(async originalURL => {
        const UrlData = link ? link : originalURL;
        if (UrlData && UrlData.url) {
          const params = queryString.parseUrl(UrlData.url);
          if (params.query && params.query.postId) {
            const postData = await getPostDetailApi({
              postId: params.query.postId,
              params: {
                lat: 0,
                lng: 0,
                userId: userInfo.id,
              },
            });
            navigation.navigate('ProductDetail', {
              postId: params.query.postId,
              postData: postData.data,
              key: `PostDetail${params.query.postId}`,
            });
          } else if (params.query && params.query.supplierId) {
            dispatch(
              getUserInfo({
                userId: params.query.supplierId,
                params: {light: true, followedUser: userInfo?.id},
              }),
            );
            const userData = await getUserInfoApi({
              userId: params.query.supplierId,
              params: {
                light: true,
                followedUser: userInfo.id,
              },
            });
            navigation.navigate('FollowerDetail', {
              data: userData,
              from: 'detail',
            });
          }
        }
      });
  };

  const checkIfNeedToShowModal = async () => {
    const paymentBankResp = await getPaymentMethods({
      userId: userInfo.id,
      type: 'bank',
    });
    if (!paymentBankResp?.data?.length && userInfo.id) {
      const resp = await checkIfFirstOrderPosted(userInfo.id);
      if (resp?.sold) {
        setShowDepositMethodPopup(true);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDeeplinks);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userInfo?.id) {
      dispatch(getPaymentBanks({userId: userInfo?.id, type: 'bank'}));
      dispatch(getNotificationList({userId: userInfo?.id}));
      dispatch(getUserInfo({userId: userInfo.id}));
    }
    handleDeeplinks();
    completedLoginFlow();
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse');
    }
    checkCategories();

    const loadDefaultLocation = async () => {
      try {
        const storedLocationString = await AsyncStorage.getItem(
          '@main-screen-location',
        );
        if (user?.information?.location) {
          setIsLocationUpdate(true);
          const findLocation = getMapObjectFromGoogleObj(
            user?.information?.location,
          );
          dispatch(
            persistFilterValues({
              location: findLocation,
              latitude: user?.information?.location?.geometry?.location?.lat,
              longitude: user?.information?.location?.geometry?.location?.lng,
            }),
          );
          setIsLocationUpdate(false);
        } else if (storedLocationString) {
          setIsLocationUpdate(true);
          const storedLocation = JSON.parse(storedLocationString);
          dispatch(
            persistFilterValues({
              location: storedLocation.location,
              latitude: storedLocation.location.latitude,
              longitude: storedLocation.location.longitude,
              distance: storedLocation.distance,
            }),
          );
          setIsLocationUpdate(false);
        } else {
          Geolocation.getCurrentPosition(
            async data => {
              setIsLocationUpdate(true);
              const res = await Geocoder.from(
                data.coords.latitude,
                data.coords.longitude,
              );
              const findLocation = getMapObjectFromGoogleObj(res.results[0]);

              dispatch(
                persistFilterValues({
                  location: findLocation,
                  latitude: data.coords.latitude,
                  longitude: data.coords.longitude,
                }),
              );
              setIsLocationUpdate(false);
            },
            error => {},
            {enableHighAccuracy: true, maximumAge: 0},
          );
        }
      } catch (error) {
        console.log({error});
      }
    };
    setTimeout(() => {
      check(
        Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        }),
      )
        .then(permissionResult => {
          if (permissionResult !== RESULTS.GRANTED) {
            request(
              Platform.select({
                android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
              }),
            )
              .then(result => {
                getLibaryAccess();
              })
              .catch(reason => getLibaryAccess());
          }
          if (permissionResult === RESULTS.GRANTED) {
            loadDefaultLocation();
            getLibaryAccess();
          }
        })
        .catch(reason => console.log({reason}));
    }, 1500);
  }, [dispatch, userInfo?.id]);

  const completedLoginFlow = async (data = []) => {
    try {
      await AsyncStorage.setItem('@is_complete_login', JSON.stringify(true));
    } catch (error) {
      console.log({error});
    }
  };

  const checkCategories = async () => {
    try {
      const exploreCategoryData = await AsyncStorage.getItem('@category-list');
      if (exploreCategoryData == null) {
        const GetCategories = await getCategoriesApi();
        dispatch(getCategories(GetCategories));
      }
    } catch (error) {
      console.log({error});
    }
  };

  const getLibaryAccess = () => {
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      }),
    )
      .then(result => {
        // console.log({ result });
      })
      .catch(reason => console.log({reason}));
  };

  useEffect(() => {
    request(
      Platform.select({
        ios: PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
      }),
    );
  }, []);

  useEffect(() => {
    checkIfNeedToShowModal();
    getAddressAndAddAddress();
  }, []);

  const getAddressAndAddAddress = async () => {
    const isAddAddress = await AsyncStorage.getItem('@is_add_address');
    if (isJsonString(isAddAddress)) {
      if (isAddAddress == true) {
        return;
      }
    }
    const location = userInfo?.location?.geometry?.location;
    if (location && addressListState?.data?.length == 0) {
      const res = await Geocoder.from(location?.lat, location?.lng);
      const parsedLocation = getMapObjectFromGoogleObj(res.results[0]);
      const getPlusCode = parsedLocation?.googleObj?.address_components?.filter(
        item => item?.types?.includes('plus_code'),
      );
      const splitUserAddress =
        userInfo?.location?.formatted_address?.split(',');
      const removePlusCode = splitUserAddress?.filter(
        obj => !obj.includes(getPlusCode[0]?.long_name),
      );
      let addressToValidate = {
        address1: removePlusCode[0]?.trim() || '',
        address2: '',
        city: parsedLocation?.city || '',
        state: parsedLocation?.state || '',
        zip: parsedLocation?.postalCode || '',
      };
      let checkAddress = await apiModels(
        'orders/shipping/validateAddress',
        'POST',
        {
          params: addressToValidate,
        },
      );
      if (checkAddress?.isValid) {
        dispatch(
          addAddress({
            name: userInfo?.name || '',
            address_line_1: removePlusCode[0]?.trim() || '',
            address_line_2: '',
            city: parsedLocation?.city || '',
            state: parsedLocation?.state || '',
            zipcode: parsedLocation?.postalCode || '',
            country: parsedLocation?.country || '',
            default: true,
          }),
        );
        try {
          await AsyncStorage.setItem('@is_add_address', JSON.stringify(true));
        } catch (error) {
          console.log({error});
        }
      }
    }
  };

  useEffect(() => {
    const fromSellPostId = route?.params?.sellPostId ?? '';
    const fromSellPostTitle = route?.params?.sellPostTitle ?? '';
    const shareFaceBook = route?.params?.shareFaceBook ?? false;
    const popUpMessage = route?.params?.popUpMessage ?? false;

    if (fromSellPostId !== '') {
      if (shareFaceBook) {
        setTimeout(() => {
          shareLinkWithShareDialog({fromSellPostId, fromSellPostTitle});
        }, 50);
      } else {
        loadSuccessDialog({fromSellPostId, fromSellPostTitle});
      }
    }

    if (popUpMessage) {
      setSuccessModal({
        isVisible: true,
        message: popUpMessage,
      });
    }

    setTimeout(function () {
      setSuccessModal({
        isVisible: false,
        message: '',
      });
    }, 1000);
  }, [
    loadSuccessDialog,
    navigation,
    route,
    navigation.state,
    shareLinkWithShareDialog,
  ]);

  const loadSuccessDialog = ({fromSellPostId, fromSellPostTitle}) => {
    setSellPost({id: fromSellPostId, title: fromSellPostTitle});
    setDialogVisible(true);

    loadData();
  };

  const shareLinkContent = {
    contentType: 'link',
    contentUrl: 'http://www.homitag.com',
    contentDescription: 'Homitag!',
  };

  const shareLinkWithShareDialog = ({fromSellPostId, fromSellPostTitle}) => {
    ShareDialog.canShow(shareLinkContent)
      .then(function (canShow) {
        if (canShow) {
          return ShareDialog.show(shareLinkContent);
        }
      })
      .then(
        function (result) {
          if (result.isCancelled) {
            /// CANCELLED
            loadSuccessDialog({fromSellPostId, fromSellPostTitle});
          } else {
            /// SUCCESS
            loadSuccessDialog({fromSellPostId, fromSellPostTitle});
          }
        },
        function (error) {
          /// ERROR
          loadSuccessDialog({fromSellPostId, fromSellPostTitle});
        },
      );
  };

  useEffect(() => {
    if (internetAvailable != null && internetAvailable != false) {
      handleExplorePageApiCall();
    }
  }, [loadData, filterValues, internetAvailable]);

  useEffect(() => {
    if (!isLoadPost) {
      setIsGetPostData(false);
    }
  }, [isLoadPost]);

  const handleExplorePageApiCall = async () => {
    const exploreData = await AsyncStorage.getItem('@is_call_auth_screen');
    if (isJsonString(exploreData) && JSON.parse(exploreData) == true) {
      await AsyncStorage.setItem('@is_call_auth_screen', JSON.stringify(false));
    } else {
      loadData();
    }
  };

  /* Methods */
  const parseFilters = useCallback(() => {
    const {
      searchText,
      distance,
      location,
      sortBy,
      quickDeliveries,
      delivery,
      priceRange,
      longitude,
      latitude,
    } = filterValues;
    return {
      ...(searchText
        ? {searchText: searchText.replace("'", '’')}
        : {postStatus: 'active'}),
      ...(location.latitude && location.latitude !== 0
        ? {
            lat: location.latitude,
          }
        : {
            lat: 0,
          }),
      ...(location.longitude && location.longitude !== 0
        ? {
            lng: location.longitude,
          }
        : {
            lng: 0,
          }),
      ...(distance[0] > 0 &&
        distance[0] !== FAKE_DEFAULT_DISTANCE && {
          minDistance: 0,
          maxDistance: distance[0],
        }),
      ...(sortBy != '' && {sort: sortBy}),
      ...(quickDeliveries &&
        quickDeliveries.length > 0 && {
          // delivery: quickDeliveries.length,
          delivery: quickDeliveries
            .map(quickDelivery => quickDelivery.ids)
            .join(','),
        }),
      ...(delivery.length > 0 && {
        deliveryGrouped: delivery
          .map(deliveryOption => deliveryOption.id)
          .join(','),
      }),
      ...(priceRange[0] > 0 && {minPrice: priceRange[0]}),
      ...(priceRange[1] < defaultValues.maxPrice && {
        maxPrice: priceRange[1],
      }),
      ...(userInfo.id && {userId: userInfo.id}),
      ...parseCategoryFilters(),
    };
  }, [defaultValues.maxPrice, filterValues, parseCategoryFilters, userInfo.id]);

  const parseCategoryFilters = useCallback(() => {
    const {category, subCategories, subCategoriesChilds} = filterValues;
    let categoriesToFilter = [];
    if (category.id) {
      categoriesToFilter.push(category.id);
      if (subCategories.length === 0) {
        categoriesToFilter = [...categoriesToFilter];
      } else {
        let mainValuesToUpdate = [...subCategories];
        let childValuesToUpdate = [...subCategoriesChilds];
        for (let index = 0; index < subCategories.length; index++) {
          const element = subCategories[index];
          let findObj = false;
          for (let index = 0; index < childValuesToUpdate.length; index++) {
            const childElement = childValuesToUpdate?.[index];
            if (
              !isEmpty(
                element?.childCategory.find(({id}) => id === childElement.id),
              )
            ) {
              findObj = true;
            }
          }
          if (findObj === true) {
            mainValuesToUpdate = [...mainValuesToUpdate].filter(
              ({id}) => id !== element.id,
            );
          }
        }
        categoriesToFilter = [
          ...mainValuesToUpdate.map(subCategory => subCategory.id),
          ...subCategoriesChilds.map(subCategoryChild => subCategoryChild.id),
        ];
      }
    }
    if (categoriesToFilter?.length > 0) {
      return {category: categoriesToFilter.join(',')};
    } else {
      return {};
    }
  }, [categoriesList, filterValues]);

  const parseCustomFilters = useCallback(() => {
    const {category, customProperties, subCategories} = filterValues;
    const customParsed = [];
    if (
      Object.keys(customProperties).length === 0 ||
      !category.id ||
      subCategories.length === 0
    ) {
      return {};
    }
    Object.keys(customProperties).forEach(key => {
      const property = properties.find(({name}) => name === key);
      const filter = customProperties[key];
      const name = key.replace(/ /g, '');
      if (property) {
        if (property.type === 'integer') {
          if (filter[0] !== property.min || filter[1] !== property.max) {
            customParsed.push(`${name}=range(${filter[0]}-${filter[1]})`);
          }
        }

        if (property.type === 'year-integer') {
          const maxYear = Number(moment().format('YYYY'));
          if (
            Number(filter[0]) !== Number(maxYear - 30) ||
            Number(filter[1]) !== Number(maxYear + 1)
          ) {
            customParsed.push(`${name}=range(${filter[0]}-${filter[1]})`);
          }
        }

        if (
          ['list', 'tags', 'color-list', 'vertical-list'].includes(
            property.type,
          ) &&
          filter.length > 0
        ) {
          customParsed.push(
            filter.map(value => `${name}=${value.value}`).join(','),
          );
        }
      }

      if (key === 'model') {
        customParsed.push(
          filter.map(value => `${key}=${value.value}`).join(','),
        );
      }
    });

    return {custom: customParsed.join(',')};
  }, [filterValues, properties]);

  const setCategoryHeight = () =>
    animatedValueScrollY.interpolate({
      inputRange: [0, 150],
      outputRange: [0, -94],
      extrapolate: 'clamp',
    });

  const setFiltersHeight = () => {
    if (filterValues?.subCategories?.length !== 0) {
      return animatedValueScrollY.interpolate({
        inputRange: [0, 5],
        outputRange: [-5, -5],
        extrapolate: 'clamp',
      });
    }
    if (
      filterValues.searchText === '' ||
      (filterValues.searchText !== '' && filtersCount === 0)
    ) {
      return animatedValueScrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [0, -94],
        extrapolate: 'clamp',
      });
    }
    return -94;
  };

  const setMoreFilterY = () => {
    if (filterValues?.subCategories?.length !== 0) {
      return animatedValueScrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [35, 35],
        extrapolate: 'clamp',
      });
    }
    if (
      filterValues.searchText === '' ||
      (filterValues.searchText !== '' && filtersCount === 0)
    ) {
      return animatedValueScrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [134, 35],
        extrapolate: 'clamp',
      });
    }
    return 35;
  };

  const setPaddingTop = () => {
    const fixPad = 15;
    if (filterValues?.subCategories?.length !== 0) {
      return 100 + fixPad;
    }
    if (filterValues.searchText !== '' && filtersCount === 0) {
      return 134 + fixPad;
    }
    if (filterValues.searchText === '' && filtersCount > 0) {
      return 184 + fixPad;
    }
    if (filterValues.searchText === '') {
      return 134 + fixPad;
    }
    return 80 + fixPad;
  };

  let pageCount = 1;

  const handleOnEndReached = async (value, iValue) => {
    try {
      if (
        totalPostData > postsList?.length &&
        !isFetchPostData &&
        internetAvailable
      ) {
        if (cancelSource && !isLoadData) {
          cancelSource.cancel('Request canceled due to new category selection');
        }

        const newCancelSource = axios.CancelToken.source();
        setCancelSource(newCancelSource);

        setIsFetchPostData(true);

        let postData = {
          ...parseFilters(),
          page: iValue >= 0 ? iValue + 2 : currentPage + pageCount,
          onlyWithImages: true,
          perPage: 20,
          ...parseCustomFilters(),
        };
        // if (postData?.lat && postData?.lng) {
        //   const res = await Geocoder.from(postData?.lat, postData?.lng);
        //   const findLocation = getMapObjectFromGoogleObj(res.results[0]);
        //   postData.location =
        //     findLocation?.postalCode +
        //     "," +
        //     findLocation?.short_city_name +
        //     "," +
        //     findLocation?.state;
        // }
        pageCount = iValue >= 0 ? iValue + 2 : pageCount + 1;
        const getPostData = await apiInstance.get(
          `catalog/v2/posts?${new URLSearchParams(postData).toString()}`,
          {
            cancelToken: newCancelSource.token,
          },
        );
        if (Platform.OS == 'ios') {
          if (loopValue != 3) {
            for (loopValue = 0; loopValue < 3; loopValue++) {
              if (value == true) break;
              setLoopValue(loopValue);
              handleOnEndReached();
            }
          }
        }

        if (getPostData?.data?.data?.length > 0) {
          dispatch(getPostNextPage(getPostData?.data));
          setCurrentPage(currentPage + pageCount - 1);
          setIsFetchPostData(false);
        } else {
          setIsFetchPostData(false);
        }
      }
    } catch (error) {
      setIsFetchPostData(false);
    }
  };

  const onFocusFilter = () => {
    setIsFilterFocused(true);
  };

  const getFiltersCount = count => {
    setFiltersCount(count);
  };

  const onModalTouchOutside = () => {
    setDialogVisible(false);
    setSellPost({});
  };

  const onBtAPressed = () => {
    setDialogVisible(false);
    navigation.navigate('SellMain');

    setSellPost({});
  };

  const loadSellList = useCallback(
    page => {
      const sellParams = {
        type: 'sell',
        userId: userInfo.id,
        page: 1,
        isDashBoard: false,
      };
      dispatch(getUserSellList(sellParams, page));
    },
    [dispatch, userInfo.id],
  );

  const onBtBPressed = () => {
    setDialogVisible(false);
    loadSellList(1);
    navigation.navigate('Dashboard', {
      fromScreen: 'explore',
      showSellSection: true,
    });
    setSellPost({});
  };

  const onBtCPressed = () => {
    setDialogVisible(false);
    setShowBoostModal(true);
    setSellPost({});
  };

  const handleOnRefresh = async () => {
    try {
      if (internetAvailable) {
        setIsRefreshing(true);
        dispatch(getUserInfo({userId: userInfo.id}));
        const GetCategories = await getCategoriesApi();
        dispatch(getCategories(GetCategories));
        const getPostData = await getPostsApi({
          ...parseFilters(),
          page: 1,
          perPage: 20,
          ...parseCustomFilters(),
        });
        if (getPostData && getPostData?.data?.length > 0) {
          dispatch(getPosts(getPostData));
          setIsRefreshing(false);
        } else {
          await AsyncStorage.setItem(
            '@explore-page',
            JSON.stringify(getPostData?.data),
          );
          dispatch(getPosts(getPostData));
          setIsRefreshing(false);
        }
      }
    } catch (error) {
      setIsRefreshing(false);
    }
  };

  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const [cancelSource, setCancelSource] = useState(null);
  const [isLoadData, setIsLoadData] = useState(false);
  let [loopValue, setLoopValue] = useState(0);

  const loadData = async () => {
    setCurrentPage(1);
    pageCount = 1;
    if (isLocationUpdate) return;
    if (cancelTokenSource) {
      setIsGetPostData(true);
      cancelTokenSource.cancel(
        'Request canceled due to new category selection',
      );
    }

    const newCancelTokenSource = axios.CancelToken.source();
    setCancelTokenSource(newCancelTokenSource);

    try {
      if (internetAvailable) {
        setIsGetPostData(true);
        let postData = {
          ...parseFilters(),
          page: 1,
          perPage: 20,
          ...parseCustomFilters(),
        };
        // if (postData?.lat && postData?.lng) {
        //   const res = await Geocoder.from(postData?.lat, postData?.lng);
        //   const findLocation = getMapObjectFromGoogleObj(res.results[0]);
        //   postData.location =
        //     findLocation?.postalCode +
        //     "," +
        //     findLocation?.short_city_name +
        //     "," +
        //     findLocation?.state;
        // }
        const getPostData = await apiInstance.get(
          `catalog/v2/posts?${new URLSearchParams(postData).toString()}`,
          {
            cancelToken: newCancelTokenSource.token,
          },
        );
        setIsFetchPostData(false);
        dispatch(getPosts({data: []}));
        if (getPostData && getPostData?.data?.data?.length > 0) {
          animatedValueScrollY.setValue(0);
          dispatch(getPosts(getPostData?.data));
          setIsGetPostData(false);
        } else {
          dispatch(getPosts(getPostData?.data));
          setIsGetPostData(false);
        }
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Error:', error.message);
        setIsGetPostData(false);
      }
    }
  };

  const {order, paymentDefault, cardDetail} = useSelector(selectOrderData());
  useFocusEffect(
    useCallback(() => {
      if (order.id) {
        loadData();
        dispatch(clearOrder());
      }
    }, [order]),
  );

  useEffect(() => {
    dispatch(
      receiveConversations({
        userId: userInfo.id,
        lightMode: false,
        origin: 'app',
      }),
    );
  }, []);

  const closeModal = () => {
    setShowBoostModal(false);
  };
  const listFooterComponent = () => {
    return (
      <>
        {isFetchPostData && (
          <ActivityIndicator size={'large'} color={Colors.primary} />
        )}
      </>
    );
  };

  return (
    <>
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
      <SafeAreaView style={Utilities.flex.grow1}>
        {showDepositMethodPopup && (
          <ConfirmationPopup
            isVisible={showDepositMethodPopup}
            title="Congratulation!"
            description="You sold your first item successfully on Homitag! Please add bank account to receive funds."
            onClose={() => {
              setShowDepositMethodPopup(false);
            }}
            primaryButtonText="Add deposit method"
            onPressPrimaryButton={() => {
              setShowDepositMethodPopup(false);
              navigation.navigate('PaymentBankTransfer', {
                createStripeAccount: true,
              });
            }}
          />
        )}
        <FilterInput
          onFocus={onFocusFilter}
          isFilterFocused={isFilterFocused}
          setIsFilterFocused={setIsFilterFocused}
          filtersCount={filtersCount}
          navigation={navigation}
          notificationCount={notificationList.newNotificationCout}
          setIsGetPostData={setIsGetPostData}
        />
        <Toast
          isVisible={internetAvailable === false}
          message="Please, check your internet connection."
        />

        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <ProductsList
              navigation={navigation}
              handleOnScroll={Animated.event(
                [
                  {
                    nativeEvent: {contentOffset: {y: animatedValueScrollY}},
                  },
                ],
                {useNativeDriver: false},
              )}
              handleEndReached={handleOnEndReached}
              setIsLoadData={setIsLoadData}
              paddingTop={setPaddingTop()}
              handleOnRefresh={handleOnRefresh}
              footerComponent={listFooterComponent}
              isRefreshing={isRefreshing}
              isGetPostData={isGetPostData}
              parseFilters={parseFilters}
            />
            {(filterValues.searchText === '' ||
              (filterValues.searchText !== '' && filtersCount === 0)) &&
            filterValues?.subCategories?.length == 0 &&
            !isFilterFocused ? (
              <Categories
                categoriesAnimation={setCategoryHeight()}
                setIsGetPostData={setIsGetPostData}
              />
            ) : null}

            <MoreFilters
              navigation={navigation}
              heightAnimated={setFiltersHeight()}
            />
            <SelectedFilters
              propStyle={{
                position: 'absolute',
                width: screenWidth,
                transform: [{translateY: setMoreFilterY()}],
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              }}
              setIsGetPostData={setIsGetPostData}
              getFiltersCount={getFiltersCount}
            />
          </View>
          {isFilterFocused && (
            <View
              style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                backgroundColor: 'white',
              }}
            />
          )}
        </View>
      </SafeAreaView>

      {boostStatus && (
        <BoostScreen
          item={postDetailforBoost}
          navigation={navigation}
          boost={true}
          visible={showBoostModal ? true : false}
          closeModal={closeModal}
        />
      )}

      {showBoostModal && (
        <BoostScreen
          item={postDetailforBoost}
          navigation={navigation}
          boost={true}
          visible={showBoostModal ? true : false}
          closeModal={closeModal}
        />
      )}
      <SweetCustomAlert
        postTitle={sellPost.title}
        dialogVisible={dialogVisible}
        onTouchOutside={onModalTouchOutside}
        onDonePressed={onModalTouchOutside}
        onBtAPressed={onBtAPressed}
        onBtBPressed={onBtBPressed}
        onBtCPressed={onBtCPressed}
        onShareItem={async () => {
          const link = await getFirebaseLink(`?postId=${sellPost.id}`);
          const shareOptions = {
            title: 'Share Item',
            message: `Checkout this ${sellPost.title} on Homitag. ${link}`,
          };
          await Share.share(shareOptions);
          setSellPost({});
        }}
      />
      <SuccessModal
        isVisible={successModal.isVisible}
        message={successModal.message}
      />
    </>
  );
};

export default MainScreen;
