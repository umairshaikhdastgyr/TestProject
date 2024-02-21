import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList, TouchableOpacity, Text, ScrollView} from 'react-native';
import * as Progress from 'react-native-progress';
import _ from 'lodash';
import {EmptyState, Button, CachedImage, Icon, Loader} from '#components';
import {Colors} from '#themes';
import {styles} from './styles';
import MoreButton from './MoreButton';
import {productStatusHelper} from './productStatusHelper';
import {ORDER_STATUS} from '#utils/enums';
import moment from 'moment';
import {getMapObjectFromGoogleObj, useActions} from '#utils';
import {selectCategoriesData} from '#modules/Categories/selectors';
import {useDispatch, useSelector} from 'react-redux';
import {
  getPostsDraft,
  getPostsDraftNextPage,
  deletePost,
  setPhotoList,
  setCopyPhotoList,
  setNewForm,
  setCopyFormData,
  setPhotoListFromServer,
} from '#modules/Sell/actions';
import Tabs from './Tabs';
import {tabs} from './sellListTabs';
import {userSelector} from '#modules/User/selectors';
import ScreenLoader from '#components/Loader/ScreenLoader';
import {getUserPendingList} from '#modules/User/actions';
import {DashBoardLoader} from '#components/SkeletonPlaceholderLoader';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';

const ProductListItem = ({
  data,
  navigation,
  loadSellData,
  showBoost,
  reloadList,
  actions,
  categoriesList,
  activeTab,
  userId,
  userInfo,
  loader,
  setLoader,
  successCount,
}) => {
  let item = data;
  const imgURI = _.get(item, 'images', null);
  let postStatus = _.get(item, 'status', 'Undefined');

  let statusColor =
    postStatus === ORDER_STATUS.CANCELLED ||
    postStatus === 'Blocked' ||
    postStatus === 'blocked'
      ? Colors.red
      : postStatus === 'draft'
      ? Colors.primary
      : postStatus === 'inactive'
      ? Colors.inactiveText
      : Colors.active;

  const loadData = data => {
    const newFormData = {};
    const newPhotosList = [];
    let lastScreen = null;
    for (let i = 0; i < data.Product.ProductImages.length; i++) {
      newPhotosList.push({
        type: 'from-server',
        image: data.Product.ProductImages[i].urlImage,
        uri: data.Product.ProductImages[i].urlImage,
        id: data.Product.ProductImages[i].id,
      });
    }

    actions.setPhotoList(newPhotosList);
    actions.setPhotoListFromServer(newPhotosList);

    newFormData.postId = data.id;
    newFormData.productId = data.Product.id;

    // listing types:
    if (
      data.Product.customProperties &&
      data.Product.customProperties.lastScreen
    ) {
      lastScreen = data.Product.customProperties.lastScreen;
    }

    if (
      data.Product.customProperties &&
      data.Product.customProperties.listingType
    ) {
      newFormData.listingType = data.Product.customProperties.listingType;
    }

    // Category:
    if (
      data.Product.customProperties &&
      data.Product.customProperties.category
    ) {
      newFormData.category = categoriesList?.find(
        item => item?.id === data?.Product?.customProperties?.category.id,
      );
    }

    // subCategory:
    if (data.Product.Category && data.Product.Category.id) {
      const subCat = newFormData?.category?.childCategory?.find(
        item => item?.id === data.Product.Category.id,
      );
      if (subCat) {
        newFormData.subCategory = subCat;
      } else {
        newFormData.subCategory = data.Product.Category;
      }
    }

    // postDetails
    if (data.title !== null) {
      newFormData.postTitle = data.title;
    } else {
      newFormData.postTitle = '';
    }

    if (data.description !== null) {
      newFormData.postDescription = data.description;
    } else {
      newFormData.postDescription = '';
    }

    if (data.location !== null) {
      newFormData.location = getMapObjectFromGoogleObj(data.location);
    } else {
      newFormData.location = {};
    }

    switch (data.itemConditionId) {
      case 'e86c9f39-f8a9-481a-b622-5beb4afa6956':
        newFormData.condition = [1];
        break;
      case '4993e897-45c4-493d-954d-eaa48a4e60c6':
        newFormData.condition = [2];
        break;
      case '33b2f829-2f4f-4df8-add7-9054793b5225':
        newFormData.condition = [3];
        break;
      case 'fd6e8d14-e0ba-4321-8efd-1bba4f9b0033':
        newFormData.condition = [4];
        break;
      case 'eb734308-4fbf-48fe-9c76-3907c5f0e645':
        newFormData.condition = [5];
        break;
    }

    if (data.initialPrice !== null) {
      newFormData.price = data.initialPrice;
    } else {
      newFormData.price = '';
    }

    newFormData.isNegotiable = data.isNegotiable;

    newFormData.customProperties = data.Product.customProperties;

    newFormData.deliveryMethodsSelected = data.DeliveryMethods;

    for (let i = 0; i < newFormData.deliveryMethodsSelected.length; i++) {
      newFormData.deliveryMethodsSelected[i].deliveryCustomProperties = {};
      newFormData.deliveryMethodsSelected[i].deliveryCustomProperties =
        newFormData.deliveryMethodsSelected[
          i
        ].DeliveryMethodPerPost?.customProperties;

      if (
        newFormData.deliveryMethodsSelected[i].DeliveryMethodPerPost &&
        newFormData.deliveryMethodsSelected[i].DeliveryMethodPerPost
          .customProperties &&
        newFormData.deliveryMethodsSelected[i].DeliveryMethodPerPost
          .customProperties.PaymentMethods
      ) {
        newFormData.deliveryMethodsSelected[i].PaymentMethods = {};
        newFormData.deliveryMethodsSelected[i].PaymentMethods =
          newFormData.deliveryMethodsSelected[
            i
          ].DeliveryMethodPerPost?.customProperties.PaymentMethods;

        delete newFormData.deliveryMethodsSelected[i].deliveryCustomProperties
          .PaymentMethods;
      } else {
        newFormData.deliveryMethodsSelected[i].PaymentMethods =
          data.PaymentMethods;
      }
    }

    newFormData.paymentMethodsSelected = data.PaymentMethods;

    newFormData.postStatus = data.PostStatus;

    newFormData.shareOnFacebook = data.shareOnFacebook;

    actions.setPhotoList(newPhotosList);
    actions.setNewForm(newFormData);
    actions.setCopyPhotoList(newPhotosList);
    actions.setCopyFormData(newFormData);

    if (lastScreen) {
      navigation.navigate(lastScreen, {
        'category-type':
          newFormData?.listingType?.name === 'Vehicle' ? 'Vehicle' : 'Goods',
        isDraft: true,
        isDashboard: true
      });
    } else {
      navigation.goBack();
    }
  };

  const prodType = 'SELL';

  let action = tabs?.[activeTab]?.options
    ? JSON.parse(JSON.stringify(tabs?.[activeTab]?.options))
    : [];

  if (activeTab === 0) {
    const transformedStatus = postStatus.toLowerCase();
    if (tabs[0].statuses.includes(transformedStatus)) {
      action = JSON.parse(JSON.stringify(tabs[0].options));
    }
    if (tabs[1].statuses.includes(transformedStatus)) {
      action = JSON.parse(JSON.stringify(tabs[1].options));
    }
    if (tabs[3].statuses.includes(transformedStatus)) {
      action = JSON.parse(JSON.stringify(tabs[3].options));
    }
    if (tabs[4].statuses.includes(transformedStatus)) {
      action = JSON.parse(JSON.stringify(tabs[4].options));
    }
    if (tabs[5].statuses.includes(transformedStatus)) {
      action = JSON.parse(JSON.stringify(tabs[5].options));
    }
  }

  if (postStatus === 'active') {
    action = [
      'Boost',
      'Make Listing Inactive',
      'Delete Listing',
      'Edit Listing',
      'Help',
      'Cancel',
    ];
  } else if (postStatus === 'draft') {
    action = ['Post Listing', 'Delete Listing', 'Cancel'];
  } else if (postStatus === 'inactive' || postStatus === 'deactivated') {
    action = [
      'Reactivate Listing',
      'Edit Listing',
      'Delete Listing',
      'Help',
      'Cancel',
    ];
  } else if (postStatus === 'blocked') {
    action = ['Delete Listing', 'Help', 'Cancel'];
  } else if (
    postStatus === 'buying' &&
    item?.orderInfo?.cancelStatus == 'cancelled'
  ) {
    action = ['View Order Status', 'Help', 'Cancel'];
  } else if (
    ['homitag_funded_claim', 'seller_funded_claim'].includes(postStatus)
  ) {
    action = [
      'View Order Status',
      'Use Listing as a Template',
      'Help',
      'Cancel',
    ];
  }

  const removeReviewFromOptions = () => {
    const index = action?.findIndex(m => m === 'Leave buyer a review');
    if (index >= 0) {
      action?.splice(index, 1);
    }
  };

  const removeReactivateFromOptions = () => {
    const index = action?.findIndex(m => m === 'Reactivate Listing');
    if (index >= 0) {
      action?.splice(index, 1);
    }
    const index2 = action?.findIndex(m => m === 'Reactivate item');
    if (index2 >= 0) {
      action?.splice(index2, 1);
    }
  };

  if (postStatus === 'cancelled') {
    action = [
      'View Order Status',
      'Message Buyer',
      'Use Listing as a Template',
      'Help',
      'Cancel',
    ];
  }
  if (postStatus === 'buying') {
    if (
      item?.orderInfo?.orderStatus === 'pending' &&
      item?.orderInfo?.cancelStatus === null
    ) {
      action = ['View Order Status', 'Help', 'Cancel'];
    } else if (
      postStatus !== 'buying' &&
      item?.orderInfo?.cancelStatus != 'cancelled'
    ) {
      action = ['Reactivate item', 'Edit Listing', 'Help', 'Cancel'];
    }
  }
  // if (!isUserReviewAvailable()) {
  //   // removeReviewFromOptions();
  // }

  const isReviewAvailable = day => {
    const orderPlaceDate = item?.orderInfo?.createdAt;
    const reviewLimitDate = moment(orderPlaceDate).add(day, 'days');
    return new Date() < reviewLimitDate;
  };

  if (userInfo?.status == 'deactivated') {
    removeReactivateFromOptions();
  }
  // reviewToBuyer,reviewToSeller,product-review type
  const {reviewInfo} = item;
  if (reviewInfo?.length > 0) {
    reviewInfo?.forEach(element => {
      if (
        element?.type.includes('reviewToSeller') ||
        element?.type.includes('reviewToSupplier')
      ) {
        if (isReviewAvailable(30)) {
          if (element.enabled) {
            action = action.includes('Leave seller a review')
              ? action
              : ['Leave seller a review', ...action];
          }
        } else {
          action = action;
        }
      } else if (element?.type.includes('reviewToBuyer')) {
        if (isReviewAvailable(30)) {
          if (element.enabled) {
            action = action.includes('Leave buyer a review')
              ? action
              : ['Leave buyer a review', ...action];
          }
        } else {
          action = action;
        }
      } else if (element?.type.includes('product')) {
        if (isReviewAvailable(90)) {
          if (element.enabled) {
            action = action.includes('Leave product review')
              ? action
              : ['Leave product review', ...action];
          }
        } else {
          action = action;
        }
      }
    });
  } else {
    removeReviewFromOptions();
    const index = action?.findIndex(m => m === 'Leave buyer a review');
    if (index >= 0) {
      action?.splice(index, 1);
    }
  }

  const [updatedProductImages, setUpdatedProductImages] = useState([]);

  const makeApiCall = useCallback(element => {
    return axios
      .get(element?.urlImage, {responseType: 'arraybuffer'})
      .then(response => {
        return response?.request?._response;
      })
      .catch(error => {
        console.error(error, element);
        throw error;
      });
  }, []);

  const makeApiCallsOneByOne = useCallback((maxIndex, productImages = []) => {
    let i = 1;
    let base64ImageList = [];

    const makeNextApiCall = () => {
      if (i <= maxIndex) {
        const element = productImages[i - 1];
        makeApiCall(element)
          .then(base64Data => {
            base64ImageList = [
              ...base64ImageList,
              {
                ...element,
                urlImage: `data:image/png;base64,${base64Data}`,
              },
            ];
            setUpdatedProductImages(base64ImageList);
            i++;
            makeNextApiCall();
          })
          .catch(error => {
            console.error(error, element);
            i++;
            makeNextApiCall();
          });
      }
    };
    makeNextApiCall();
  }, []);

  useEffect(() => {
    let productImages = item?.productInfo?.Product?.ProductImages ?? [];

    makeApiCallsOneByOne(productImages.length, productImages);
  }, []);

  const onPress = async () => {
    if (postStatus === 'draft') {
      loadData(item?.postDetail, 'SellMain');
      return;
    } else {
      const finalProductImages = item?.productInfo?.Product?.ProductImages?.map(
        obj => {
          const findObj = updatedProductImages?.find(el => el?.id == obj?.id);
          if (findObj) {
            return findObj;
          } else {
            return obj;
          }
        },
      );
      navigation.navigate('ProductDetail', {
        postId: item?.postId,
        isFromDashboard: true,
        statusColor,
        status: productStatusHelper(postStatus, true, item),
        prodStatus: productStatusHelper(postStatus, true, item),
        postData: {
          ...item?.productInfo,
          ...item?.orderInfo?.productInfo,
          Product: {
            ...data?.productInfo?.Product,
            ProductImages: finalProductImages,
          },
        },
        updatedProductImages: finalProductImages,
        prodType,
        action,
        completePostFromDashboard: item,
        orderId: item?.orderId,
        isBuy: item?.orderId != null || item?.orderId != undefined,
      });
    }
  };

  const refundType = () => {
    const currentStatus = _.get(item, 'status', 'Undefined');
    const refunds = item?.orderInfo?.ReturnRequests?.[0]?.OrderRefund;
    const latestStatus = refunds?.[refunds?.length - 1];
    return currentStatus?.includes('return') && refunds?.length > 0
      ? latestStatus?.refundedPartial
        ? 'partial_refund'
        : 'full_refund'
      : currentStatus;
  };
  const displayBoostIcon = item?.productInfo?.boost;
  // const isPostDetail = item?.postDetail;
  if (postStatus == 'bought' && action && !action.includes('Ship Now')) {
    action = ['Ship Now', ...action];
  }
  return (
    <View key={postStatus + item?.postId} style={styles.listItemView}>
      <View style={[styles.listItemContainer, {overflow: 'hidden'}]}>
        {loader && <ScreenLoader />}
        <MoreButton
          navigation={navigation}
          productItem={item}
          postId={item?.postId}
          sellProductId={item?.productInfo?.Product?.id}
          loadSellData={loadSellData}
          showBoost={() => showBoost(item)}
          reloadList={reloadList}
          actions={action}
          setLoader={setLoader}
          successCount={successCount}
          isDashboard={true}
        />
        <TouchableOpacity onPress={() => onPress()}>
          <View>
            {postStatus === 'blocked' && (
              <View style={styles.headerButton}>
                <Icon icon="alert_red" size="small" />
              </View>
            )}
            {displayBoostIcon ? (
              <View style={styles.headerButton}>
                <Icon
                  icon="boost_grey"
                  size="small"
                  style={{width: 20, height: 20, resizeMode: 'contain'}}
                />
              </View>
            ) : null}
            <CachedImage
              source={
                imgURI
                  ? {uri: imgURI}
                  : require('../../../assets/images/img_placeholder1.jpg')
              }
              style={styles.productImg}
              indicator={Progress.Pie}
              resizeMode="contain"
              indicatorProps={{
                size: 30,
                borderWidth: 0,
                color: Colors.primary,
                unfilledColor: Colors.white,
              }}
            />
          </View>
          <View style={[styles.productInfoContainer]}>
            <Text style={styles.blackText} numberOfLines={1}>
              {_.get(item, 'title', 'Undefined')}
            </Text>
            <Text style={[styles.productStatusText, {color: statusColor}]}>
              {productStatusHelper(refundType(), true, item)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const NoProductListItem = ({navigation, optionDetails}) => {
  const onStartSelling = () => {
    navigation.navigate('SellMain');
  };

  const text =
    optionDetails.id === 0
      ? 'You have no products yet'
      : `You have no products in ${optionDetails.name} category!`;

  return (
    <View style={styles.noProductViewContainer}>
      <EmptyState icon="explore" text={text} />
      {optionDetails.id === 0 && (
        <Button
          label="Start Selling"
          theme="secondary"
          size="large"
          onPress={onStartSelling}
        />
      )}
    </View>
  );
};

export const SellList = ({
  products,
  isFetching,
  navigation,
  loadSellData,
  showBoost,
  reloadList,
  onEndReached,
  isFetchingNextPageSellList,
  successCount,
}) => {
  const dispatch = useDispatch();
  // console.log({ products });
  const actions = useActions({
    getPostsDraft,
    getPostsDraftNextPage,
    deletePost,
    setPhotoList,
    setCopyPhotoList,
    setNewForm,
    setCopyFormData,
    setPhotoListFromServer,
  });

  const [activeTab, setActiveTab] = useState(0);
  const [loader, setLoader] = useState(false);
  const [pendingCount, setPendingCount] = useState(1);

  const {categoriesList} = useSelector(selectCategoriesData());

  // Options should be calculated like the way they were done before.
  const {
    user: {
      userPendingListState,
      noMorePendingList,
      isFetchingNextPagePendingList,
    },
  } = useSelector(userSelector);
  const {user} = useSelector(userSelector);
  const {information} = user;
  const userInfo = information;
  const isUserReviewAvailable = item => {
    const userReviewed = item?.sellerReviewed;
    const orderData = item?.orderId !== null ? item?.orderInfo : null;
    if (!orderData || userReviewed) {
      return false;
    }
    const deliveryDate = orderData?.deliveredAt;
    const expDeliveryDate = orderData?.deliverBy;
    const isReviewable =
      deliveryDate !== null ||
      (new Date() > new Date(expDeliveryDate) && deliveryDate === null);
    let initiatedBySeller = false;
    if (item?.status === ORDER_STATUS.CANCELLED) {
      const cancelReqs = item?.orderInfo?.cancelRequest;
      initiatedBySeller = cancelReqs?.[0].userId === userInfo?.id;
    }
    if (!isReviewable || initiatedBySeller) {
      return false;
    }
    const orderPlaceDate = item?.orderInfo?.createdAt;
    const reviewLimitDate = moment(new Date(orderPlaceDate)).add(30, 'd');
    const claimStatuses = [
      ORDER_STATUS.CLAIM_ACCEPTED,
      ORDER_STATUS.CLAIM_DISPUTED,
      ORDER_STATUS.CLAIM_FILED,
    ];
    if (claimStatuses.includes(item.status)) {
      return false;
    }
    return new Date() < reviewLimitDate;
  };

  const optionDetails = tabs.find(t => t.id === activeTab);

  let getProductsForSelectedTab = () => {
    // REVIEWS
    if (activeTab === 5) {
      return products?.filter(
        p =>
          optionDetails.statuses?.includes(p?.status) &&
          isUserReviewAvailable(p),
      );
    }

    if (activeTab === 4) {
      return products?.filter(
        p =>
          optionDetails.statuses?.includes(p?.status) ||
          (tabs[5].statuses?.includes(p?.status) && !isUserReviewAvailable(p)),
      );
    }
    if (activeTab === 2) {
      return userPendingListState?.data;
    }
    return products?.filter(
      p => optionDetails.statuses?.includes(p?.status) || activeTab === 0,
    );
  };

  useEffect(() => {
    if (activeTab == 2) {
      getPendingData();
    }
  }, [activeTab]);

  const getPendingData = () => {
    const pendingParams = {
      type: 'pending',
      userId: userInfo?.id,
      page: 1,
    };
    dispatch(getUserPendingList(pendingParams, 1));
  };

  const onEndReachedPending = () => {
    if (
      !isFetchingNextPagePendingList &&
      !noMorePendingList &&
      userPendingListState?.data?.length != userPendingListState?.total
    ) {
      const pendingParams = {
        type: 'pending',
        userId: userInfo?.id,
        page: pendingCount + 1,
      };
      dispatch(getUserPendingList(pendingParams, pendingCount + 1));
      setPendingCount(pendingCount + 1);
      return;
    }
  };

  const handleOnEndReach = () => {
    if (activeTab == 2) {
      onEndReachedPending();
    } else {
      onEndReached();
    }
  };

  return (
    <>
      {isFetching ? (
        <View style={{marginTop: 20}}>
          <DashBoardLoader />
        </View>
      ) : (
        <>
          {products?.length > 0 && (
            <ScrollView
              horizontal
              style={{paddingHorizontal: 0, width: '100%'}}
              showsHorizontalScrollIndicator={false}>
              <Tabs
                tabs={tabs.map(({id, name}) => ({id, name}))}
                spaceEvenly
                activeTab={activeTab}
                setActiveTab={id => setActiveTab(id)}
              />
            </ScrollView>
          )}
          <FlatList
            data={getProductsForSelectedTab()}
            renderItem={({item}) => {
              return (
                <ProductListItem
                  data={item}
                  navigation={navigation}
                  loadSellData={loadSellData}
                  showBoost={showBoost}
                  reloadList={reloadList}
                  categoriesList={categoriesList}
                  activeTab={activeTab}
                  userInfo={userInfo}
                  loader={loader}
                  setLoader={setLoader}
                  successCount={successCount}
                  actions={actions}
                />
              );
            }}
            keyExtractor={(item, index) =>
              `key-${index}-${item?.PostStatus?.name}`
            }
            numColumns={2}
            onEndReachedThreshold={0.8}
            scrollEventThrottle={1}
            contentInset={{bottom: 32}}
            style={{paddingTop: 10}}
            onEndReached={handleOnEndReach}
            scrollEnabled={false}
            ListFooterComponent={() => {
              return <>{isFetchingNextPageSellList && <Loader />}</>;
            }}
            ListEmptyComponent={() => {
              return (
                <>
                  {userPendingListState?.isFetching ? (
                    <Loader />
                  ) : (
                    <NoProductListItem
                      navigation={navigation}
                      optionDetails={optionDetails}
                    />
                  )}
                </>
              );
            }}
          />
        </>
      )}
    </>
  );
};
