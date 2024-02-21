import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  SafeAreaView,
  Animated,
  Dimensions,
  BackHandler,
  Platform,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import _ from 'lodash';
import {useFocusEffect} from '@react-navigation/native';
import {EmptyState, Heading, SweetAlert} from '#components';
import {SetFavoritePostFlowModals} from '#common-views';
import Header from './components/header';
import Footer from './components/footer';
import ItemPictures from './sections/item-pictures';
import ItemDetails from './sections/item-details';
import Location from './sections/location';
import PostedBy from './sections/posted-by';
import OtherProducts from './sections/other-products';
import BuyerProtection from './sections/buyer-protection';
import {flex, safeAreaNotchHelper, paddings, margins} from '#styles/utilities';
import InterestedBuyers from './sections/interested-buyers';
import PurchasedBuyer from './sections/purchased-buyer';
import ScreenLoader from '#components/Loader/ScreenLoader';
import SmallLoader from '#components/Loader/SmallLoader';
import {BoostScreen} from 'screens/Profile/DashboardScreen/BoostScreen';

import {Geocoder, getMapObjectFromGoogleObj} from '#utils';
import usePrevious from '#utils/usePrevious';

import {
  getAddressList,
  getPaymentCards,
  getUserInfo,
  followUser,
  unfollowUser,
  postBuyerDetail as postBuyerDetailApi,
  clearUserReport,
  addAddress,
} from '#modules/User/actions';
import {getPostDetail, getNearbyPosts} from '#modules/Posts/actions';
import {getReviewTotal} from '#modules/ProductReview/actions';
import {getOrders, getCompletedOrders} from '#modules/Orders/actions';
import {selectPostsData} from '#modules/Posts/selectors';
import {selectUserData} from '#modules/User/selectors';
import {selectOrderData} from '#modules/Orders/selectors';
import {selectSellData} from '#modules/Sell/selectors';
import SoldBy from './sections/sold-by';
import {handleGotoChatScreen} from '../helper-functions';
import ProtectionModal from '../../Sell/OldOrderStatusScreen/ShippingStatus/protection-modal';

const STATUS_LIST = {SELL: ['INACTIVE', 'SOLD', 'LISTING BLOCKED'], BUY: []};
import {selectChatData} from '#modules/Chat/selectors';
import {getOrderById} from '#services/apiOrders';
import colors from '#themes/colors';
import {generalSelector} from '#modules/General/selectors';
import {getContent} from '#modules/General/actions';
import {apiModels} from '#services/apiModels';
import {getPosts, getSnapshotDetail} from '#services/apiPosts';
import {showMessage} from 'react-native-flash-message';
import {MainAuthStackNavigation} from '../../../navigators/MainAuthStackNavigation';
import ConfirmationPopup from '#screens/Sell/MainScreen/ConfirmationPopup';
import {apiInstance} from '#services/httpclient';
import {
  BuyNowLoader,
  SoldAndPostedLoader,
} from '#components/SkeletonPlaceholderLoader';
import {FlashList} from '@shopify/flash-list';
import ProductTile from '#components/ProductsList/product-tile';
import Tabs from '#screens/Chat/MainScreen/Tabs';
import {useActions} from '#utils';
import {deleteIdeaGlobally, getAlbumsIdeas} from '#modules/Ideas/actions';

const {height} = Dimensions.get('window');

const heightConst = height * 0.6; //width / 0.793

const ListHeaderComponent = React.memo(
  ({
    postDetailScreen,
    showBoostModal,
    navigation,
    showModal,
    toggleModal,
    updatedProductImages,
    statusColor,
    setPostDetailScreen,
    postDetail,
    isVisibleFavoriteModal,
    setIsVisibleFavoriteModal,
    latLng,
    isSupplier,
    isSupplierx,
    prodStatus,
    quantitySelected,
    setQuantitySelected,
    isFromDashboard,
    isBuy,
    userProductDetail,
    isAvailableForSell,
    chatInfo,
    userInfo,
    postId,
    interestedBuyers,
    setInterestedBuyers,
    postBuyerDetail,
    ordersList,
    prodType,
    isFetchingPostDetail,
    loader,
    prModalVisibleAction,
    sellerDetails,
    followUpdateState,
    followAction,
    unfollowAction,
    tabs,
    activeTab,
    setActiveTab,
    status,
    postHaveHTShipping,
    similarPostsLoader,
    similarPostsScreen,
    nearbyPostsScreen,
    setShowBoostModal,
  }) => {
    return (
      <View style={{flex: 1}}>
        {postDetailScreen && postDetailScreen.id && (
          <ItemPictures
            postDetail={postDetailScreen}
            navigation={navigation}
            status={status}
            updatedProductImages={updatedProductImages}
            statusColor={statusColor}
            setPostDetailScreen={setPostDetailScreen}
          />
        )}
        {showBoostModal && (
          <BoostScreen
            item={postDetail}
            boost={true}
            navigation={navigation}
            visible={showBoostModal ? true : false}
            closeModal={() => {
              setShowBoostModal(false);
            }}
          />
        )}
        <ItemDetails
          navigation={navigation}
          showModal={showModal}
          toggleModal={toggleModal}
          isVisibleFavoriteModal={isVisibleFavoriteModal}
          setIsVisibleFavoriteModal={setIsVisibleFavoriteModal}
          latLng={latLng}
          pDetail={postDetail}
          postDetail={postDetailScreen ? postDetailScreen : postDatas}
          isSupplier={isSupplier}
          isSupplierx={isSupplierx}
          proStatus={status}
          prodStatus={prodStatus}
          availableQuantity={postDetailScreen?.availableQuantity ?? 0}
          quantity={quantitySelected}
          setQuantity={setQuantitySelected}
          updateFavIconStatus={value => {
            setPostDetailScreen({
              ...postDetailScreen,
              isFavorite: value,
            });
          }}
          isFavorited={postDetailScreen?.isFavorite ?? false}
          isFromDashboard={isFromDashboard}
          isBuy={isBuy}
          isFetchingPostDetail={userProductDetail?.isFetching}
          isAvailableForSell={isAvailableForSell}
        />
        {postHaveHTShipping() === true && (
          <BuyerProtection prModalVisibleAction={prModalVisibleAction} />
        )}
        {!isSupplier &&
          postDetailScreen &&
          postDetailScreen.id &&
          postDetailScreen.location && (
            <Location
              navigation={navigation}
              location={postDetailScreen?.location}
            />
          )}
        {prodStatus === 'SOLD' && (
          <PurchasedBuyer
            chatInfo={chatInfo}
            userId={userInfo.id}
            postId={postId}
            navigation={navigation}
            interestedBuyers={interestedBuyers}
            setInterestedBuyers={setInterestedBuyers}
            prodStatus={prodStatus}
            postBuyerDetail={postBuyerDetail}
            orderList={ordersList}
          />
        )}
        {prodStatus === 'ACTIVE' ||
        prodStatus === 'OFFER ACCEPTED' ||
        prodStatus === 'OFFER RECEIVED' ? (
          <InterestedBuyers
            chatInfo={chatInfo}
            userId={userInfo.id}
            postId={postId}
            navigation={navigation}
            interestedBuyers={interestedBuyers}
            setInterestedBuyers={setInterestedBuyers}
            prodStatus={prodStatus}
          />
        ) : prodType ? (
          !STATUS_LIST[prodType].includes(prodStatus) && (
            <>
              {isSupplier ? (
                <>
                  {(!isFetchingPostDetail || loader) && postDetail ? (
                    <SoldBy
                      navigation={navigation}
                      postDetail={postDetail}
                      postDetailScreen={postDetailScreen}
                      setPostDetailScreen={setPostDetailScreen}
                      quantity={quantitySelected}
                      setQuantity={setQuantitySelected}
                      prModalVisibleAction={prModalVisibleAction}
                      isFromDashboard={isFromDashboard}
                      isBuy={isBuy}
                    />
                  ) : (
                    <SoldAndPostedLoader />
                  )}
                </>
              ) : (
                <>
                  {(!userProductDetail?.isFetching ||
                    !isFetchingPostDetail ||
                    loader) &&
                  sellerDetails &&
                  sellerDetails.reviews !== undefined ? (
                    <>
                      <PostedBy
                        isFetching={userProductDetail.isFetching}
                        data={sellerDetails}
                        followUpdateState={followUpdateState}
                        userInfo={userInfo}
                        followAction={followAction}
                        unfollowAction={unfollowAction}
                        navigation={navigation}
                      />
                    </>
                  ) : (
                    <SoldAndPostedLoader />
                  )}
                </>
              )}

              <View style={styles.header}>
                <Heading type="bodyText" style={margins['mb-3']}>
                  {isSupplier ? 'Other Similar Products' : 'Other Products'}
                </Heading>
                {!isSupplier && (
                  <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                )}
                {similarPostsLoader && (
                  <ActivityIndicator
                    size={'large'}
                    style={{marginVertical: 20}}
                  />
                )}
              </View>
              {activeTab === 'similar' && (
                <>
                  {similarPostsScreen &&
                    similarPostsScreen?.data?.length === 0 && (
                      <EmptyState icon="goods" text="No similar products" />
                    )}
                </>
              )}
              {activeTab === 'nearby' && (
                <>
                  {nearbyPostsScreen &&
                    nearbyPostsScreen?.list?.length === 0 && (
                      <EmptyState
                        icon="localization"
                        text="No nearby products"
                      />
                    )}
                </>
              )}
            </>
          )
        ) : (
          <>
            {isSupplier ? (
              <>
                {(!isFetchingPostDetail || loader) && postDetail ? (
                  <SoldBy
                    navigation={navigation}
                    postDetail={postDetail}
                    postDetailScreen={postDetailScreen}
                    setPostDetailScreen={setPostDetailScreen}
                    quantity={quantitySelected}
                    isSupplier={isSupplier}
                    availableQuantity={postDetailScreen?.availableQuantity ?? 0}
                    setQuantity={setQuantitySelected}
                    prModalVisibleAction={prModalVisibleAction}
                    isFromDashboard={isFromDashboard}
                    isBuy={isBuy}
                  />
                ) : (
                  // null
                  <SoldAndPostedLoader />
                )}
              </>
            ) : (
              <>
                {(!userProductDetail?.isFetching ||
                  !isFetchingPostDetail ||
                  loader) &&
                sellerDetails &&
                sellerDetails.reviews !== undefined ? (
                  <>
                    <PostedBy
                      isFetching={userProductDetail.isFetching}
                      data={sellerDetails}
                      followUpdateState={followUpdateState}
                      userInfo={userInfo}
                      followAction={followAction}
                      unfollowAction={unfollowAction}
                      navigation={navigation}
                    />
                  </>
                ) : (
                  <SoldAndPostedLoader />
                )}
              </>
            )}

            <View style={styles.header}>
              <Heading type="bodyText" style={margins['mb-3']}>
                {isSupplier ? 'Other Similar Products' : 'Other Products'}
              </Heading>
              {!isSupplier && (
                <Tabs
                  tabs={tabs}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              )}
              {similarPostsLoader && (
                <ActivityIndicator
                  size={'large'}
                  style={{marginVertical: 20}}
                />
              )}
            </View>
            {activeTab === 'similar' && (
              <>
                {similarPostsScreen &&
                  similarPostsScreen?.data?.length === 0 && (
                    <EmptyState icon="goods" text="No similar products" />
                  )}
              </>
            )}
            {activeTab === 'nearby' && (
              <>
                {nearbyPostsScreen && nearbyPostsScreen?.list?.length === 0 && (
                  <EmptyState icon="localization" text="No nearby products" />
                )}
              </>
            )}
          </>
        )}
      </View>
    );
  },
);

const ProductDetailScreen = ({navigation, route}) => {
  const prodStatus = route?.params?.prodStatus ?? null;
  const order = route?.params?.order ?? null;
  const orderId = route?.params?.orderId ?? null;
  const from = route?.params?.from ?? null;
  let postDatas = route?.params?.postData ?? null;
  let updatedProductImages = route?.params?.updatedProductImages ?? null;
  const postId = route?.params?.postId ?? null;
  const prodType = route?.params?.prodType ?? undefined;
  const status = route?.params?.status ?? null;
  const statusColor = route?.params?.statusColor ?? null;
  //Dashboard True then don't show below parameter
  const actionTypes = route?.params?.actionType ?? null;
  const moreActions = route?.params?.action ?? null;
  const completePost = route?.params?.completePostFromDashboard ?? null;
  const isFromDashboard = route?.params?.isFromDashboard ?? null;
  const isBuy = route?.params?.isBuy ?? null;

  const [similarPage, setSimilarPage] = useState(1);
  const [isFetchingNextSimilarPagePosts, setIsFetchingNextSimilarPagePosts] =
    useState(false);
  const [postDetail, setPostDetail] = useState({});
  const [isFetchingPostDetail, setIsFetchingPostDetail] = useState(false);
  const [showNumberVerificationPopup, setShowVerificationNumberPopup] =
    useState(false);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
    );
  };

  let pageCount;

  const handleSimilarEndReached = async () => {
    try {
      if (isFetchingNextSimilarPagePosts) {
        return;
      }

      if (
        !isFetchingNextSimilarPagePosts &&
        similarPostsScreen?.total > similarPostsScreen?.data?.length
      ) {
        if (!isFetchingNextSimilarPagePosts) {
          setIsFetchingNextSimilarPagePosts(true);
          pageCount = similarPage + 1;
          const res = await getPosts({
            category: postDetailScreen?.Product?.Category?.id,
            perPage: 20,
            postStatus: 'active',
            excludeProduct: postDetailScreen?.Product?.id,
            page: pageCount,
          });

          setSimilarPostsScreen(latestData => {
            const data = res?.data == undefined ? [] : res?.data;
            return {...latestData, data: [...latestData.data, ...data]};
          });
          setSimilarPage(pageCount);
          setIsFetchingNextSimilarPagePosts(false);
          return;
        }
      }
    } catch (error) {
      console.log('handleSimilarEndReached error:', error);
      setIsFetchingNextSimilarPagePosts(false);
    }
  };

  // const isSupplier = postData?.customProperties?.origin === "suppliers";

  /* Selectors */

  const isSupplierx = postDetail?.customProperties?.origin === 'suppliers';

  const [completePostFromDashboard, setCompletePostFromDashboard] =
    useState(completePost);

  let postData = postDatas;
  let productStatus;
  let deliveryMethod;
  let isSupplier =
    postData && postData?.customProperties?.origin
      ? postData?.customProperties?.origin === 'suppliers'
      : postDetail?.customProperties?.origin === 'suppliers';
  let actionType = actionTypes ? actionTypes : 'primary';

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (isFromDashboard) {
      setLoader(true);
      GetOrderById();
    }
  }, [completePost, postData, postDetail]);

  const GetOrderById = async () => {
    setLoader(true);
    try {
      const orderData = await getOrderById({orderId: completePost?.orderId});
      if (
        Object.keys(postDetail).length > 0 &&
        Object.keys(orderData).length > 0 &&
        isFromDashboard
      ) {
        postData = postDetail;
        const completePostDashboard = {
          ...completePost,
          postDetail: postDetail,
          orderData: orderData,
        };

        setCompletePostFromDashboard(completePostDashboard);
        postData?.PostStatus?.name;
        postData?.DeliveryMethods;
        productStatus = postDetail?.PostStatus?.name;
        deliveryMethod = postDetail.DeliveryMethods;
        if (productStatus?.toUpperCase() === 'ACTIVE') {
          if (
            deliveryMethod?.length > 0 &&
            deliveryMethod?.find(dItem => dItem?.code === 'pickup')
          ) {
            actionType = 'primary';
          } else {
            actionType = 'secondary';
          }
        }
        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.log('---GetOrderById-------error', JSON.stringify(error));
      setLoader(false);
    }
  };

  const {
    information: userInfo,
    sendUserReportState,
    addressListState,
    paymentMethodDefault,
  } = useSelector(selectUserData());

  const {userProductDetail, followUpdateState, postBuyerDetail} = useSelector(
    selectUserData(),
  );
  const {chatInfo} = useSelector(selectChatData());
  const {similarPosts, nearbyPosts} = useSelector(selectPostsData());
  const {ordersList, completedOrderList} = useSelector(selectOrderData());
  // const GetPostDetail = (data) => dispatch(getPostDetail(data));
  const GetUserInfo = user => dispatch(getUserInfo(user));
  const GetNearbyPosts = nbp => dispatch(getNearbyPosts(nbp));
  const FollowUser = fuser => dispatch(followUser(fuser));
  const UnfollowUser = ufuser => dispatch(unfollowUser(ufuser));
  const GetOrders = order => dispatch(getOrders(order));
  const GetCompletedOrders = comOrder => dispatch(getCompletedOrders(comOrder));
  const GetAddressList = () => dispatch(getAddressList());
  const GetPaymentCards = payCard => dispatch(getPaymentCards(payCard));
  const [activeTab, setActiveTab] = useState('similar');
  const tabs = [
    {id: 'similar', name: 'Similar'},
    {id: 'nearby', name: 'Nearby'},
  ];

  /* Actions */
  const actions = useActions({deleteIdeaGlobally, getAlbumsIdeas});

  /* States */
  const [alertStatus, setAlertStatus] = useState({
    title: '',
    visible: false,
    message: '',
    type: '',
    alertType: '',
  });
  const [interestedBuyers, setInterestedBuyers] = useState([]);

  const [quantitySelected, setQuantitySelected] = useState('1');
  const [isVisibleFavoriteModal, setIsVisibleFavoriteModal] = useState(false);
  const [isFavoriteModal, setIsFavoriteModal] = useState(false);
  const [sellerDetails, setSellerDetails] = useState({});
  const [showBoostModal, setShowBoostModal] = useState(false);

  const [latLng, setLatLng] = useState({lat: 0, lng: 0});
  const [firstCall, setFirstCall] = useState(false);
  const [firstCallNearby, setFirstCallNearby] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [postDetailScreen, setPostDetailScreen] = useState({});
  const [similarPostsScreen, setSimilarPostsScreen] = useState({});
  const [similarPostsLoader, setSimilarPostsLoader] = useState(false);
  const [nearbyPostsScreen, setNearbyPostsScreen] = useState({});
  const [makeOfferAvailable, setMakeOfferAvailable] = useState(null);
  const dispatch = useDispatch();
  const animatedValueScrollY = useRef(new Animated.Value(0)).current;
  const prevSendUserReportState = usePrevious(sendUserReportState);
  const [prModalVisible, setPrModalVisible] = useState(false);
  const [postToFavorite, setPostToFavorite] = useState({});

  const fetchReviewTotal = useCallback(() => {
    if (postDetail?.productId) {
      dispatch(getReviewTotal(postDetail.productId));
    }
  }, [dispatch, postDetail?.productId]);

  const goBackfromDetail = () => {
    if (from === 'chat-after-order') {
      navigation.navigate('ExploreMain');
      return;
    }
    navigation.goBack();
  };

  const {general} = useSelector(generalSelector);

  const onAlertModalTouchOutside = () => {
    setAlertStatus({
      title: '',
      visible: false,
      message: '',
      type: '',
    });
    if (alertStatus.alertType !== 'report') {
      navigation.goBack();
    }
    if (alertStatus.alertType === 'report') {
      dispatch(clearUserReport());
    }
  };

  const navigateToNumberVerification = () => {
    navigation.navigate('EditPersonalInfo');
  };

  const handleOnScroll = event => {};

  /**
   * @returns Boolean
   */

  const getAddressAndAddAddress = async () => {
    const location = userInfo?.location?.geometry?.location;
    if (location) {
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
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const _verifyUserHasDefaultAddress = async () => {
    if (addressListState?.data && addressListState?.data?.length > 0) {
      const defaultAddress = addressListState?.data?.length > 0;
      // addressListState?.data?.filter(
      //   item => item.default === true,
      //   )[0];

      if (defaultAddress) {
        return true;
      } else {
        if (await getAddressAndAddAddress()) {
          return true;
        }
        return false;
      }
    } else {
      if (await getAddressAndAddAddress()) {
        getAddressAndAddAddress();
        return true;
      }
      return false;
    }
  };

  const handleOnBack = () => {
    animatedValueScrollY.setValue(0);

    GetNearbyPosts({
      filters: {
        distance: postDetailScreen.distance,
        perPage: 4,
        postStatus: 'active',
        onlyWithImages: true,
        excludePost: postDetailScreen.id,
        ...(userInfo.id && {userId: userInfo.id}),
      },
    });
  };

  const handleFooterButtonB = () => {
    if (userInfo.id) {
      if (makeOfferAvailable) {
        navigation.navigate('MakeOfferScreen', {data: postDetailScreen});
        return;
      }

      navigation.navigate('BuyNowScreen', {
        data: postDetailScreen,
        quantitySelected: parseInt(quantitySelected, 10),
      });
      return;
    } else {
      MainAuthStackNavigation(navigation);
    }
  };
  const handlePressBuyButton = async () => {
    const response = await _verifyUserHasDefaultAddress();
    if (userInfo.id) {
      const offerValue = parseFloat(postDetailScreen.initialPrice).toFixed(2);
      const buyNowAction = true;
      if (_isItemVehicle() && _isItemCloserThan(10)) {
        navigation.navigate('BuyNowScreen', {
          data: postDetailScreen,
        });
        return;
      }
      if (response) {
        GetAddressList();
        navigation.navigate('PaymentConfirmationScreen', {
          from: 'ProductDetail',
          data: {
            ...postDetailScreen,
            offerValue,
            buyNowAction,
          },
          address: addressListState?.data?.find(item => item.default === true),
          quantitySelected: parseInt(quantitySelected, 10),
        });
        return;
      } else if (!response) {
        navigation.navigate('ShippingInfo', {
          data: {...postDetailScreen, offerValue, buyNowAction},
          quantitySelected: parseInt(quantitySelected, 10),
        });
        return;
      }
    } else {
      MainAuthStackNavigation(navigation);
    }
  };

  const handlePressSendMessageButton = () => {
    if (userInfo.id) {
      handleGotoChatScreen({
        navigation,
        sellerDetails,
        postDetail: postDetailScreen,
      });
    } else {
      MainAuthStackNavigation(navigation);
    }
  };

  const getPostDetails = async (data = {}) => {
    try {
      setIsFetchingPostDetail(true);
      const res = await apiInstance.get(`catalog/posts/${data.postId}`, data);
      if (res.status === 200) {
        if (isFromDashboard) {
          setPostDetailScreen(res?.data?.data);
        }
        setPostDetail(res?.data?.data);
        setIsFetchingPostDetail(false);
      } else {
        setIsFetchingPostDetail(false);
      }
    } catch (error) {
      setIsFetchingPostDetail(false);
      return false;
    }
  };

  const setHeaderOpacity = () => {
    animatedValueScrollY.interpolate({
      inputRange: [0, heightConst - 70, heightConst - 50],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });
  };

  const setPaddingTop = () => heightConst;

  const postHaveHTShipping = () => {
    if ((postDetailScreen?.DeliveryMethods?.length ?? 0) > 0) {
      const htshipping = postDetailScreen?.DeliveryMethods?.find(
        ele => ele.code === 'homitagshipping',
      );
      if (htshipping) {
        return true;
      }
      return false;
    }
    return false;
  };

  const followAction = () => {
    FollowUser({
      userID: userInfo.id,
      userToFollow: postDetailScreen.userId,
    });
  };

  const unfollowAction = () => {
    UnfollowUser({
      userID: userInfo.id,
      userToFollow: postDetailScreen.userId,
    });
  };

  const sellState = useSelector(selectSellData());
  const updatePostStatusState = sellState.updatePostStatus;
  const prevUpdatePostStatus = usePrevious(updatePostStatusState);

  const redirectToOrderStatus = async () => {
    let type = 'BUYER';
    if (postDetailScreen.userId === userInfo.id) {
      type = 'SELLER';
    } else {
      type = 'BUYER';
    }
    const chatItem = {};
    chatItem.receiver = {};
    chatItem.post = {};

    chatItem.id = null;
    chatItem.message = '';
    chatItem.datetime = null;
    chatItem.badgeCount = 0;
    chatItem.post.id = postDetailScreen.id;
    chatItem.urlImage = userInfo.profilepictureurl;

    let sellerOrderData;
    if (type === 'SELLER') {
      sellerOrderData = await getOrderById({
        orderId: postDetailScreen?.order?.id,
      });
      chatItem.title = `${userInfo.firstName} ${userInfo.lastName}`;
      chatItem.sellerId = sellerOrderData?.sellerId;
      chatItem.senderId = sellerOrderData?.id;
      chatItem.sellerFirstName = sellerOrderData?.sellerInfo?.firstName;
      chatItem.sellerLastName = sellerOrderData?.sellerInfo?.lastName;
      chatItem.receiver.userId = sellerOrderData?.buyerId;
      chatItem.receiver.firstName = sellerOrderData?.sellerInfo?.firstName;
      chatItem.receiver.lastName = sellerOrderData?.sellerInfo?.lastName;
      chatItem.receiver.pictureUrl = sellerOrderData?.productInfo.image;
    } else if (type === 'BUYER') {
      chatItem.post.id = postDetailScreen.postId;
      chatItem.title = `${userInfo.firstName} ${userInfo.lastName}`;
      chatItem.sellerId = postDetailScreen.sellerId;
      chatItem.senderId = postDetailScreen.sellerId;
      chatItem.sellerFirstName = postDetailScreen?.sellerInfo?.firstName;
      chatItem.sellerLastName = postDetailScreen?.sellerInfo?.lastName;
      chatItem.receiver.userId = userInfo.id;
      chatItem.receiver.firstName = userInfo.firstName;
      chatItem.receiver.lastName = userInfo.lastName;
      chatItem.receiver.pictureUrl = userInfo.profilepictureurl;
    }

    if (postDetailScreen.Product) {
      chatItem.post.urlImage =
        postDetailScreen.Product.ProductImages[0]?.urlImage;
      chatItem.post.title = postDetailScreen.Product.title;
    } else if (postDetailScreen.productInfo) {
      chatItem.post.urlImage =
        postDetailScreen.productInfo.ProductImages[0]?.urlImage;
      chatItem.post.title = postDetailScreen.productInfo.title;
    }
    navigation.navigate('OrderStatus', {
      data: type === 'BUYER' ? postDetailScreen.postDetail : postDetailScreen,
      type,
      chatItem,
      conversationId: null,
      orderId: postDetailScreen?.id || postDetailScreen?.order?.id,
    });
  };

  /**
   * @description Order more than two times
   * @returns Boolean
   */
  const orderMoreThanTwo = () => {
    if (ordersList?.data?.length > 2) {
      return true;
    }
    return false;
  };

  /**
   * @description Disable buy now button
   * @returns boolean
   */
  const disableBuyNowButton = () => {
    if (
      postDetailScreen?.availableQuantity >= 0 &&
      !(
        (isFetchingPostDetail && !postData) ||
        updatePostStatusState.isFetching ||
        ordersList.isFetching
      )
    ) {
      return false;
    }

    return true;
  };

  /**
   * @description Return true if item has multiple delivery methods
   * @returns Boolean
   */
  const _isItemVehicle = () => {
    if (postData?.Product?.customProperties?.category?.name === 'Vehicles') {
      return true;
    }
    return false;
  };

  /**
   * @description Verify if item is within $miles of distance
   * @param {Number} miles
   * @return Boolean
   */
  const _isItemCloserThan = (miles = 0) => {
    if (Math.round(postData?.distance) <= miles) {
      return true;
    }
    return false;
  };

  /**
   * @returns Boolean
   */
  const _isItemNegotiable = () => {
    if (postData?.isNegotiable) {
      return true;
    }
    return false;
  };

  /**
   * @description Verify if post item has multiple delivery methods
   * @returns Boolean
   */
  const _hasMultipleDeliveryMethods = () => {
    if ((postData?.DeliveryMethods?.length ?? 0) > 1) {
      return true;
    }
    return false;
  };

  /**
   * @description Verify if post item is for shipping
   * @return Boolean
   */
  const _isItemShipping = () => {
    if (postData?.DeliveryMethods?.find(item => item?.code?.includes('ship'))) {
      return true;
    }
    return false;
  };

  useFocusEffect(
    useCallback(() => {
      fetchReviewTotal();
    }, [fetchReviewTotal]),
  );

  useEffect(() => {
    dispatch(
      getContent({
        params:
          postHaveHTShipping() === true
            ? `?type=buyer_protection`
            : `?type=rr_public_policy`,
        type: 'terms',
      }),
    );
  }, [postHaveHTShipping()]);

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  useFocusEffect(
    useCallback(() => {
      const handleBackButton = () => {
        setShowModal(false);
        goBackfromDetail();
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
    if (sendUserReportState.data && !prevSendUserReportState?.data) {
      setAlertStatus({
        title: 'Success',
        visible: true,
        message: "You've reported successfully",
        type: 'success',
        alertType: 'report',
      });
    }
    if (sendUserReportState.data == null) {
      setAlertStatus({
        title: '',
        visible: false,
        message: '',
        type: '',
      });
    }
  }, [prevSendUserReportState, sendUserReportState]);

  useEffect(() => {
    if (sendUserReportState.failure && !prevSendUserReportState?.failure) {
      setAlertStatus({
        title: 'Oops!',
        visible: true,
        message: JSON.stringify(sendUserReportState.failure),
        type: 'error',
        alertType: 'report',
      });
    }
    if (sendUserReportState.failure == null) {
      setAlertStatus({
        title: '',
        visible: false,
        message: '',
        type: '',
      });
    }
  }, [prevSendUserReportState, sendUserReportState.failure]);

  useEffect(() => {
    const getLocationPost = () => {
      if (postId) {
        Geolocation.getCurrentPosition(
          data => {
            getPostDetails({
              postId,
              params: {
                lat: data?.coords?.latitude,
                lng: data?.coords?.longitude,
                ...(userInfo?.id && {userId: userInfo?.id}),
              },
            });
            setLatLng({
              lat: data?.coords?.latitude,
              lng: data?.coords?.longitude,
            });
          },
          error => {
            getPostDetails({
              postId,
              params: {
                lat: 0,
                lng: 0,
                ...(userInfo?.id && {userId: userInfo?.id}),
              },
            });
          },
        );
      }
    };

    const verifyOrder = () => {
      if (
        prodStatus === 'OFFER ACCEPTED' ||
        prodStatus === 'OFFER RECEIVED' ||
        prodStatus === 'SOLD'
      ) {
        let orderStatus = '';
        switch (prodStatus) {
          case 'OFFER RECEIVED':
            orderStatus = 'created';
            break;
          case 'OFFER ACCEPTED':
            orderStatus = 'accepted';
            break;
          case 'SOLD':
            orderStatus = 'transactioncomplete';
            break;
          default:
            break;
        }
        const dataToSend = {
          postId,
          sellerId: userInfo?.id,
          status: orderStatus,
        };
        GetOrders(dataToSend);
      } else {
      }
    };

    /**
     * @returns Void
     */
    const _callGetUserInfo = () => {
      if (userInfo?.id) {
        GetUserInfo({
          userId: postData?.userId,
          params: {light: true, followedUser: userInfo?.id},
        });
        return;
      }
      GetUserInfo({
        userId: postData?.userId,
        params: {light: true},
      });
    };
    setPostDetailScreen({});
    setIsLoading(true);

    if (postData) {
      setTimeout(() => {
        setPostDetailScreen(postData);
        setIsLoading(false);
      }, 200);

      _callGetUserInfo();

      if (!prodStatus) {
        // check if exists active order
        const dataToSend = {
          postId: postData?.id,
          sellerId: postData?.userId,
          sort: 'createdAt-desc',
          page: 1,
          perPage: 5,
          buyerId: userInfo?.id,
        };
        GetOrders(dataToSend);
      }

      if (postData?.id === postDetailScreen?.id) {
        setPostDetailScreen(postData);
        setIsLoading(false);
      }
    }

    if (prodStatus === 'SOLD' && prodType === 'SELL') {
      GetCompletedOrders({postId: route?.params?.postId});
    }

    if (isFromDashboard && isBuy) {
      getSnapPostDetails();
    } else {
      getLocationPost();
    }
    verifyOrder();

    if (userInfo?.id) {
      GetAddressList();
      GetPaymentCards({userId: userInfo?.id, type: 'card'});
    }

    if (_isItemVehicle()) {
      setMakeOfferAvailable(true);
      return;
    }

    if (!_isItemNegotiable() && _hasMultipleDeliveryMethods()) {
      setMakeOfferAvailable(true);
      return;
    }

    if (_isItemNegotiable() && _isItemShipping()) {
      setMakeOfferAvailable(true);
      return;
    }

    if (_isItemNegotiable() && !_isItemShipping()) {
      setMakeOfferAvailable(true);
      return;
    }

    if (!_isItemNegotiable() && !_isItemShipping()) {
      setMakeOfferAvailable(true);
      return;
    }
  }, [selectPostsData]);

  useEffect(() => {
    if (
      updatePostStatusState.failure &&
      prevUpdatePostStatus &&
      !prevUpdatePostStatus.failure
    ) {
      setAlertStatus({
        title: 'Oops',
        visible: true,
        message: JSON.stringify(updatePostStatusState.failure),
        type: 'error',
        alertType: 'action',
      });
    }
  }, [prevUpdatePostStatus, updatePostStatusState.failure]);

  const getSimilarProductDetails = async (data = {}) => {
    setSimilarPostsLoader(true);
    try {
      const res = await apiInstance.get(
        `catalog/v2/posts?${new URLSearchParams(data).toString()}`,
      );
      setSimilarPostsScreen(res?.data);
      setSimilarPostsLoader(false);
    } catch (error) {
      setSimilarPostsLoader(false);
    }
  };

  useEffect(() => {
    if (!postData) {
      if (
        postDetail?.userId &&
        route?.params?.postId === postDetail?.id &&
        firstCall === false
      ) {
        setPostDetailScreen(postDetail);
        setIsLoading(false);

        if (!userInfo?.id) {
          GetUserInfo({
            userId: postDetail?.userId,
            params: {light: true},
          });
        } else {
          GetUserInfo({
            userId: postDetail?.userId,
            params: {light: true, followedUser: userInfo?.id},
          });
        }
       
        if (postDetail?.Product?.Category?.id) {
          getSimilarProductDetails({
            category: postDetail?.Product?.Category?.id,
            perPage: 10,
            postStatus: 'active',
            excludeProduct: postDetail?.Product?.id,
            page: 1,
          });
        }
        GetNearbyPosts({
          filters: {
            distance: postDetail?.distance,
            perPage: 4,
            postStatus: 'active',
            onlyWithImages: true,
            excludePost: postDetail?.id,
            ...(userInfo?.id && {userId: userInfo?.id}),
          },
        });

        setFirstCall(true);

        if (!prodStatus) {
          // check if exists active order
          const dataToSend = {
            postId: postDetail.id,
            sellerId: postDetail.userId,
            sort: 'createdAt-desc',
            page: 1,
            perPage: 5,
            buyerId: userInfo.id,
          };
          GetOrders(dataToSend);
        }
      }

      if (postDetail?.id === postDetailScreen?.id) {
        setPostDetailScreen(postDetail);
        setIsLoading(false);
      }
    } else if (
      postDetail?.userId &&
      route?.params?.postId === postDetail?.id &&
      firstCall === false
    ) {
      setFirstCall(true);
      GetNearbyPosts({
        filters: {
          distance: postDetail?.distance,
          perPage: 4,
          postStatus: 'active',
          onlyWithImages: true,
          excludePost: postDetail?.id,
          ...(userInfo?.id && {userId: userInfo?.id}),
        },
      });
      if (postData?.Product?.Category?.id || postData?.Product?.categoryId) {
        getSimilarProductDetails({
          category:
            postData?.Product?.Category?.id || postData?.Product?.categoryId,
          perPage: 10,
          postStatus: 'active',
          excludeProduct: postData?.Product?.id,
          page: 1,
        });
      }
    }
  }, [postDetail]);

  useEffect(() => {
    if (userProductDetail?.data?.id === postDetailScreen?.userId) {
      setSellerDetails(userProductDetail?.data);
    }
  }, [userProductDetail]);

  const getSnapPostDetails = async () => {
    if (isFromDashboard && isBuy) {
      try {
        console.log('getPostDetails======= ', orderId);
        setIsFetchingPostDetail(true);
        const res = await apiInstance.get(`catalog/posts/${orderId}/snapshot`);
        if (res.status === 200 || (res && res?.data?.data)) {
          setPostDetail({...res?.data.data, orderId: orderId, ...order});
          setPostDetailScreen({
            ...res?.data.data,
            orderId: orderId,
            ...order,
          });
          setIsFetchingPostDetail(false);
        } else if (res?.error) {
          showMessage({message: res?.error, type: 'warning'});
          setIsFetchingPostDetail(false);
        }
      } catch (error) {
        setIsFetchingPostDetail(false);
      } finally {
        setIsFetchingPostDetail(false);
      }
    }
  };

  useEffect(() => {
    if (
      firstCallNearby === false &&
      nearbyPosts?.list &&
      nearbyPosts?.isFetching === false &&
      firstCall === true
    ) {
      setFirstCallNearby(true);
      setNearbyPostsScreen(nearbyPosts);
    }

    if (firstCallNearby === true) {
      if (nearbyPosts?.list?.length === nearbyPostsScreen?.list?.length) {
        let isOwnList = true;
        for (let i = 0; i < nearbyPosts?.list?.length; i++) {
          if (nearbyPosts?.list[i]?.id !== nearbyPostsScreen?.list[i]?.id) {
            isOwnList = false;
            break;
          }
        }
        if (isOwnList === true) {
          setNearbyPostsScreen(nearbyPosts);
        }
      }
    }
  }, [nearbyPosts]);

  useEffect(() => {
    if (prodStatus === 'SOLD') {
      if (ordersList?.data?.length > 0) {
        dispatch(
          postBuyerDetailApi({
            userId: ordersList?.data[0]?.buyerId,
            params: {light: true},
          }),
        );
      }
    }
  }, [ordersList, prodStatus]);

  const prModalVisibleAction = value => setPrModalVisible(value);

  const isPostedByCurrentUser = userInfo.id === postDetail.userId;
  const isAvailableForSell =
    postDetailScreen?.customProperties?.origin === 'suppliers'
      ? postDetailScreen?.additionalPosts?.length > 0
        ? postDetailScreen?.additionalPosts?.filter(val => {
            if (val?.id == postDetailScreen?.id) {
              return true;
            }
            return false;
          })?.length > 0
          ? true
          : false
        : false
      : true;

  const handleLiveView = () => {
    navigation.push('ProductDetail', {
      postId: postDetail?.id,
      isSnapshot: true,
    });
  };

  useEffect(() => {
    if (postToFavorite.id) {
      if (userInfo.id) setIsFavoriteModal(true);
      else navigation.navigate('MainAuth');
    }
  }, [postToFavorite.id]);

  const handlePressLike = async item => {
    if (userInfo.id) {
      if (item?.isFavorite != true) {
        setPostToFavorite({
          id: item.id,
          image: item.Product.ProductImages[0].urlImage,
        });
      } else {
        await actions.deleteIdeaGlobally({
          postId: item?.id,
          userId: userInfo.id,
        });
        if (Object.keys(similarPostsScreen).length !== 0) {
          const latestSimilarData = [...similarPostsScreen?.data]?.map(obj => {
            if (obj?.id == item.id) {
              return {...obj, isFavorite: false};
            } else {
              return obj;
            }
          });
          setSimilarPostsScreen({
            ...similarPostsScreen,
            data: latestSimilarData,
          });
          actions.getAlbumsIdeas({params: {userId: userInfo.id}});
        }
      }
    } else {
      MainAuthStackNavigation(navigation);
    }
  };

  const RenderFooter = () => {
    return (
      <>
        {isFromDashboard && isBuy && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '8%',
              backgroundColor: colors.lightGrey,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>This is a product snapshot</Text>
              {isSupplier && (
                <TouchableOpacity
                  onPress={handleLiveView}
                  style={{
                    marginLeft: 15,
                    borderWidth: 1,
                    borderColor: colors.primary,
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    borderRadius: 4,
                  }}>
                  <Text style={{color: colors.primary}}>Live View</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        {Object.keys(postDetailScreen).length > 0 ? (
          <>
            {(isFetchingPostDetail || ordersList.isFetching) &&
            isFromDashboard != true &&
            isBuy != true ? (
              <BuyNowLoader />
            ) : (
              <>
                {userInfo.id !== postDetailScreen.userId &&
                isFromDashboard != true &&
                isBuy != true &&
                (postDetail?.name
                  ? (postDetail?.availableQuantity ?? 0) > 0 &&
                    postDetail?.PostStatus?.name != 'Deactivated' &&
                    postDetail?.PostStatus?.name != 'Inactive' &&
                    postDetail?.PostStatus?.name != 'Inactive (Sold out)'
                  : postDetailScreen?.PostStatus?.name != 'Deactivated' &&
                    postDetailScreen?.PostStatus?.name != 'Inactive' &&
                    postDetailScreen?.PostStatus?.name !=
                      'Inactive (Sold out)') &&
                isAvailableForSell ? (
                  <Footer
                    navigation={navigation}
                    isSupplier={isSupplier}
                    onPressSendMessage={handlePressSendMessageButton}
                    onPressMakeOffer={handleFooterButtonB}
                    onPressBuy={handlePressBuyButton}
                    makeOfferAvailable={
                      _isItemVehicle() ||
                      (_isItemNegotiable() &&
                        _isItemShipping() &&
                        orderMoreThanTwo() === false)
                    }
                    buyerOfferAvaialable={
                      _isItemVehicle() ||
                      (!_isItemNegotiable() && _hasMultipleDeliveryMethods()) ||
                      (_isItemNegotiable() && _isItemShipping())
                    }
                    buyNowAvailable={!_isItemVehicle()}
                    disableMakeOffer={
                      orderMoreThanTwo() ||
                      ordersList?.data?.[0]?.orderStatus === 'created'
                    }
                    status={status}
                    disableBuyNow={disableBuyNowButton()}
                    setShowVerificationNumberPopup={
                      setShowVerificationNumberPopup
                    }
                  />
                ) : null}
              </>
            )}
          </>
        ) : null}
      </>
    );
  };
  const data = {
    postDetailScreen,
    showBoostModal,
    navigation,
    showModal,
    toggleModal,
    updatedProductImages,
    statusColor,
    setPostDetailScreen,
    postDetail,
    isVisibleFavoriteModal,
    setIsVisibleFavoriteModal,
    latLng,
    isSupplier,
    isSupplierx,
    prodStatus,
    quantitySelected,
    setQuantitySelected,
    isFromDashboard,
    isBuy,
    userProductDetail,
    isAvailableForSell,
    chatInfo,
    userInfo,
    postId,
    interestedBuyers,
    setInterestedBuyers,
    postBuyerDetail,
    ordersList,
    prodType,
    isFetchingPostDetail,
    loader,
    prModalVisibleAction,
    sellerDetails,
    sellerDetails,
    followUpdateState,
    followAction,
    unfollowAction,
    followAction,
    tabs,
    activeTab,
    setActiveTab,
    status,
    postHaveHTShipping,
    similarPostsLoader,
    similarPostsScreen,
    nearbyPostsScreen,
    setShowBoostModal,
  };
  return (
    <>
      <SafeAreaView style={safeAreaNotchHelper} />

      <SafeAreaView style={flex.grow1}>
        <Header
          status={status}
          statusColor={statusColor}
          navigation={navigation}
          headerOpacity={setHeaderOpacity()}
          prodStatus={prodStatus}
          actionType={actionType}
          postDetail={postDetailScreen}
          interestedBuyers={interestedBuyers}
          ordersList={ordersList.data}
          postId={postId}
          productId={postDetail?.Product?.id}
          userInfo={userInfo}
          userProductDetail={userProductDetail}
          chatAction={() =>
            handleGotoChatScreen({
              navigation,
              sellerDetails,
              postDetail: postDetailScreen,
            })
          }
          redirectToOrderStatus={redirectToOrderStatus}
          goBack={goBackfromDetail}
          completedOrderList={completedOrderList}
          showBoostModal={() => setShowBoostModal(postDetail)}
          actionItems={moreActions}
          isPostedByCurrentUser={isPostedByCurrentUser}
          completePostFromDashboard={completePostFromDashboard}
          setLoader={setLoader}
          isDashboard={isFromDashboard}
        />
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <FlashList
            ListHeaderComponent={<ListHeaderComponent {...data} />}
            keyExtractor={(item, index) => item + index}
            numColumns={2}
            data={
              activeTab == 'similar'
                ? similarPostsScreen.data
                : nearbyPostsScreen.list
            }
            onEndReached={handleSimilarEndReached}
            renderItem={({item, index}) => {
              return (
                <>
                  {isFromDashboard &&
                  (prodStatus === 'ACTIVE' ||
                    prodStatus === 'INACTIVE') ? undefined : (
                    <ProductTile
                      key={`${item?.id}${index}`}
                      data={item}
                      onPress={imageVal => {
                        const finalProductImages =
                          item?.Product?.ProductImages?.map(obj => {
                            const findObj = imageVal?.find(
                              el => el?.id == obj?.id,
                            );
                            if (findObj) {
                              return findObj;
                            } else {
                              return obj;
                            }
                          });
                        navigation.push('ProductDetail', {
                          postId: item.id,
                          onBack: handleOnBack,
                          postData: {
                            ...item,
                            Product: {
                              ...item?.Product,
                              ProductImages: finalProductImages,
                            },
                          },
                          updatedProductImages: finalProductImages,
                          key: `PostDetail${item.id}`,
                        });
                      }}
                      onPressLike={() => handlePressLike(item)}
                      onPressMoreIcon={() => onPressMoreIcon(item)}
                      onPressDelete={() => onPressDelete(item)}
                    />
                  )}
                </>
              );
            }}
            estimatedItemSize={100}
          />
          {isFetchingNextSimilarPagePosts && (
            <ActivityIndicator size={'large'} style={{marginVertical: 30}} />
          )}
        </View>
      </SafeAreaView>
      <RenderFooter />
      <SweetAlert
        title={alertStatus.title}
        message={alertStatus.message}
        type={alertStatus.type}
        dialogVisible={alertStatus.visible}
        onTouchOutside={onAlertModalTouchOutside}
        iconWidth={120}
      />
      <ProtectionModal
        isVisible={prModalVisible}
        onTouchOutside={() => {
          setPrModalVisible(false);
        }}
        contents={general.contentState.data}
      />
      {postDetailScreen.id && (
        <SetFavoritePostFlowModals
          post={{
            id: postDetailScreen.id,
            image: postDetailScreen.Product?.ProductImages?.[0]?.urlImage,
          }}
          isVisible={isVisibleFavoriteModal}
          closeModal={(withSuccess, name) => {
            if (withSuccess === 'close') {
              setIsVisibleFavoriteModal(false);
            } else if (withSuccess === true && name !== undefined) {
              setIsVisibleFavoriteModal(false);
              setPostDetailScreen({
                ...postDetailScreen,
                isFavorite: true,
              });
            }
          }}
        />
      )}
      <SetFavoritePostFlowModals
        post={postToFavorite}
        isVisible={isFavoriteModal}
        closeModal={(withSuccess,name) => {
          if (withSuccess && Object.keys(similarPostsScreen).length !== 0) {
            if(withSuccess === true && name !== undefined){
              setIsFavoriteModal(false);
              const latestSimilarData = [...similarPostsScreen.data]?.map(obj => {
                if (obj?.id == postToFavorite?.id) {
                  return {...obj, isFavorite: true};
                } else {
                  return obj;
                }
              });

              setSimilarPostsScreen({
                ...similarPostsScreen,
                data: latestSimilarData,
              });
            }
          }
          if(withSuccess === 'close'){
            setIsFavoriteModal(false);
          }
          setPostToFavorite({});
        }}
      />

      {showNumberVerificationPopup && (
        <ConfirmationPopup
          isVisible={showNumberVerificationPopup}
          title="Verification required!"
          description="Please verify your phone number to access this feature"
          onClose={() => {
            setShowVerificationNumberPopup(false);
            navigation.navigate('ExploreMain');
          }}
          primaryButtonText="Verify Phone Number"
          onPressSecondaryButton={() => {
            setShowVerificationNumberPopup(false);
            navigation.navigate('ExploreMain');
          }}
          secondaryButtonText="Back to Explore"
          onPressPrimaryButton={() => {
            setShowVerificationNumberPopup(false);
            navigateToNumberVerification();
          }}
        />
      )}
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};
const styles = StyleSheet.create({
  header: {
    ...paddings['px-3'],
    ...paddings['py-5'],
    paddingBottom: 10,
  },
});
export default ProductDetailScreen;
