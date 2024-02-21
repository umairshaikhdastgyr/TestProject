import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList, TouchableOpacity, Text, ScrollView} from 'react-native';
import * as Progress from 'react-native-progress';
import _ from 'lodash';
import {CachedImage, EmptyState, Button, Loader} from '#components';
import {Colors} from '#themes';
import {styles} from './styles';
import MoreButton from './MoreButton';
import {productStatusHelper} from './productStatusHelper';
import {ORDER_STATUS} from '#utils/enums';
import moment from 'moment';
import Tabs from './Tabs';
import {useSelector} from 'react-redux';
import {selectUserData} from '#modules/User/selectors';
import {tabs} from './buyListTabs';
import RNFetchBlob from 'rn-fetch-blob';
import {DashBoardLoader} from '#components/SkeletonPlaceholderLoader';
import axios from 'axios';

const BUYING_STATUS = ['counteredseller', 'counteredbuyer', 'pendingexchange'];

const REQUESTED_STATUS = [
  'created',
  'pending',
  'accepted',
  'pendingbuyerconfirmation',
];

const ITEM_SHIPPED_STATUS = [
  'buyaccepted',
  'buyacceptedhomi',
  'buyacceptedind',
  'intransit',
  'inTransit',
];

const DELIVERED_STATUS = [
  'deliveredreturn',
  'transactioncomplete',
  'delivered',
];

const ProductListItem = ({data, navigation, reloadList, activeIndex}) => {
  let item = data;
  const imgURI = _.get(item, 'images', null);
  let statusColor = Colors.active;
  let productStatus = _.get(item, 'status', 'Undefined');
  let status = _.get(item, 'status', 'Undefined');
  const postStatus = item?.productInfo?.PostStatus?.name.toUpperCase();

  productStatus = productStatus.toUpperCase();
  let prodStatus = '';
  const actionType = 'primary';
  const prodType = 'BUY';
  if (BUYING_STATUS.includes(productStatus.toLowerCase())) {
    prodStatus = 'BUYING';
    productStatus = 'BUYING';
  } else if (productStatus === 'TRANSACTIONCANCELLED') {
    prodStatus = 'CANCELLED';
    productStatus = 'CANCELLED';
    statusColor = Colors.red;
    //start
  } else if (REQUESTED_STATUS.includes(productStatus.toLowerCase())) {
    prodStatus = 'REQUESTED';
    productStatus = 'REQUESTED';
  } else if (productStatus === 'ACCEPTEDSELLER') {
    prodStatus = 'AWAITING SHIPPING';
    productStatus = 'AWAITING SHIPPING';
  } else if (productStatus === 'BUYACCEPTEDDSELLER') {
    prodStatus = 'AWAITING SHIPPING';
    productStatus = 'AWAITING SHIPPING';
  } else if (productStatus === 'RETURNSHIPPED') {
    prodStatus = 'RETURN SHIPPED';
    productStatus = 'RETURN SHIPPED';
  } else if (productStatus === 'RETURNSHIPPED') {
    prodStatus = 'RETURN SHIPPED';
    productStatus = 'RETURN SHIPPED';
  } else if (productStatus === 'RETURNED') {
    prodStatus = 'RETURN COMPLETED';
    productStatus = 'RETURN COMPLETED';
  } else if (productStatus === 'RETURNED') {
    prodStatus = 'RETURN COMPLETED';
    productStatus = 'RETURN COMPLETED';
  } else if (productStatus === 'CANCELLATION_CANCELLED') {
    prodStatus = 'CANCELLED';
    productStatus = 'CANCELLED';
    statusColor = Colors.red;
  } else if (ITEM_SHIPPED_STATUS.includes(productStatus.toLowerCase())) {
    prodStatus = 'ITEM SHIPPED';
    productStatus = 'ITEM SHIPPED';
  } else if (productStatus === 'PARTIALYSHIPPED') {
    prodStatus = 'PARTIALY SHIPPED';
    productStatus = 'PARTIALY SHIPPED';
  } else if (productStatus === 'PARTIALYSHIPPED') {
    prodStatus = 'PARTIALY SHIPPED';
    productStatus = 'PARTIALY SHIPPED';
  } else if (productStatus === 'REQUESTRETURN') {
    prodStatus = 'RETURN REQUESTED';
    productStatus = 'RETURN REQUESTED';
  } else if (productStatus === 'LABELSHARED') {
    prodStatus = 'LABEL SHARED';
    productStatus = 'LABEL SHARED';
  } else if (productStatus === 'LABELSHAREDIND') {
    prodStatus = 'LABEL SHARED';
    productStatus = 'LABEL SHARED';
  } else if (DELIVERED_STATUS.includes(productStatus.toLowerCase())) {
    prodStatus = 'DELIVERED';
    productStatus = 'DELIVERED';
  } else if (productStatus === 'TRANSACTIONCANCELLED') {
    prodStatus = 'CANCELLED';
    productStatus = 'CANCELLED';
  } else if (productStatus === 'REFUNDED') {
    prodStatus = 'REFUNDED';
    productStatus = 'REFUNDED';
  } else if (productStatus === 'DEFAULT') {
    prodStatus = 'IN PROGRESS';
    productStatus = 'IN PROGRESS';
  } else if (productStatus === 'RETURNDECLINED') {
    prodStatus = 'RETURN DECLINED';
    productStatus = 'RETURN DECLINED';
  } else if (productStatus === 'REFUNDEDRETURNED') {
    prodStatus = 'REFUNDED/RETURNED';
    productStatus = 'REFUNDED/RETURNED';
  } else if (productStatus === 'RETURNCLOSED') {
    prodStatus = 'RETURN CLOSED';
    productStatus = 'RETURN CLOSED';
  } else if (productStatus === 'RETURNCANCELLED') {
    prodStatus = 'RETURN CANCELLED';
    productStatus = 'RETURN CANCELLED';
  } else if (productStatus === 'DECLINED') {
    //end
    prodStatus = 'DECLINED';
    productStatus = 'DECLINED';
    statusColor = Colors.red;
  } else if (productStatus === 'CANCELLED') {
    //end
    prodStatus = 'CANCELLED';
    productStatus = 'CANCELLED';
    statusColor = Colors.red;
  }
  switch (postStatus) {
    case 'INACTIVE':
      statusColor = Colors.inactiveText;
      prodStatus = postStatus;
      productStatus = postStatus;
      break;
    case 'SOLD OUT':
      statusColor = Colors.primary;
      prodStatus = 'SOLD';
      productStatus = 'SOLD';
      break;
    default:
      break;
  }

  const {reviewInfo} = item;
  let action = tabs?.[activeIndex]?.options
    ? JSON.parse(JSON.stringify(tabs?.[activeIndex]?.options))
    : ['Help', 'Cancel'];

  const isProductReviewAvailable = () => {
    const productReviewed = item?.reviewed;
    const isProductBySupplier =
      item?.orderInfo?.productInfo?.customProperties?.origin === 'suppliers';

    const orderData = item?.orderId !== null ? item?.orderInfo : null;
    const deliveryDate = orderData?.deliveredAt;
    const expDeliveryDate = orderData?.deliverBy;
    const isApplicableForDelayedAndDeliveredProducts =
      deliveryDate !== null ||
      (new Date() > new Date(expDeliveryDate) && deliveryDate === null);
    if (
      !isProductBySupplier ||
      productReviewed ||
      !isApplicableForDelayedAndDeliveredProducts
    ) {
      return false;
    }
    if (item.status === 'cancelled') {
      return false;
    }

    if (item.status === 'buying') {
      return false;
    }
    const orderPlaceDate = item?.orderInfo?.createdAt;
    const reviewLimitDate = moment(orderPlaceDate).add(90, 'days');
    return new Date() < reviewLimitDate;
  };

  const isReviewAvailable = day => {
    const orderPlaceDate = item?.orderInfo?.createdAt;
    const reviewLimitDate = moment(orderPlaceDate).add(day, 'days');
    return new Date() < reviewLimitDate;
  };

  if (activeIndex === 0) {
    const transformedStatus = productStatus.toLowerCase();

    if (tabs[0].statuses.includes(transformedStatus)) {
      action = JSON.parse(JSON.stringify(tabs[0].options));
    }
    if (tabs[1].statuses.includes(transformedStatus)) {
      action = JSON.parse(JSON.stringify(tabs[1].options));
    }
    if (tabs[2].statuses.includes(transformedStatus)) {
      action = JSON.parse(JSON.stringify(tabs[2].options));
    }
    if (tabs[3].statuses.includes(transformedStatus)) {
      action = JSON.parse(JSON.stringify(tabs[3].options));
    }
  }

  if (isProductReviewAvailable() && action) {
    // action = action.includes('Leave product review')
    //   ? action
    //   : ['Leave product review', ...action];
  } else {
    if (isReviewAvailable(90)) {
      const hasReviewOption = action?.indexOf('Leave product review');
      if (hasReviewOption >= 0) {
        action.splice(hasReviewOption, 1);
      }
      action = action;
    } else {
      action = action;
    }
  }

  const refundType = () => {
    const currentStatus = _.get(item, 'status', 'Undefined');
    const refunds = item?.orderInfo?.ReturnRequests?.[0]?.OrderRefund;
    const latestStatus = refunds?.[refunds?.length - 1];
    if (currentStatus === 'partial_shipped') {
      return `PARTIAL SHIPPED (${item?.orderInfo?.partialInfo?.shippedQuantity} / ${item?.orderInfo?.quantity})`;
    }
    return currentStatus?.includes('return') && refunds?.length > 0
      ? latestStatus?.refundedPartial
        ? 'partial_refund'
        : 'full_refund'
      : currentStatus;
  };

  const removeReviewFromOptions = () => {
    const index = action?.findIndex(m => m === 'Leave seller a review');
    if (index >= 0) {
      action?.splice(index, 1);
    }
  };

  // if (!isUserReviewAvailable()) {
  //   // removeReviewFromOptions();
  // }
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

  const onPress = () => {
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
      postId: item.postId,
      isFromDashboard: true,
      isBuy: true,
      status: productStatusHelper(
        _.get(item, 'status', 'Undefined'),
        false,
        item,
      ),
      postData: {
        ...item?.productInfo,
        customProperties:item?.productInfo?.Product.customProperties,
        ...item?.orderInfo?.productInfo,
        Product: {
          ...item?.productInfo?.Product,
          ProductImages: finalProductImages,
        },
      },
      updatedProductImages: finalProductImages,
      statusColor,
      prodStatus,
      prodType,
      order: item,
      orderId: item?.orderId,
      action: action,
      completePostFromDashboard: item,
      key: `PostDetail${item.postId}`,
    });
  };
  // const isPostDetail = item?.postDetail;

  return (
    <View key={postStatus + item?.postId} style={styles.listItemView}>
      <View style={[styles.listItemContainer, {overflow: 'hidden'}]}>
        <MoreButton
          navigation={navigation}
          productItem={item}
          postId={item.postId}
          reloadList={reloadList}
          actions={action}
        />
        <TouchableOpacity onPress={onPress}>
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
          <View style={styles.productInfoContainer}>
            <Text style={styles.blackText} numberOfLines={1}>
              {_.get(item, 'title', 'Undefined')}
            </Text>
            <Text style={[styles.productStatusText, {color: statusColor}]}>
              {productStatusHelper(refundType(), false, item)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const NoProductListItem = ({navigation, optionDetails}) => {
  const onStartBuying = () => {
    navigation.navigate('ExploreMain');
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
          label="Start Buying"
          theme="secondary"
          size="large"
          onPress={onStartBuying}
        />
      )}
    </View>
  );
};

export const BuyList = ({
  products,
  isFetching,
  navigation,
  reloadList,
  onEndReached,
  isFetchingNextPageBuyList,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const optionDetails = tabs.find(t => t.id === activeTab);

  const getProductsForSelectedTab = () => {
    return products?.filter(
      p => optionDetails.statuses?.includes(p?.status) || activeTab === 0,
    );
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
                  reloadList={reloadList}
                  activeIndex={activeTab}
                />
              );
            }}
            keyExtractor={(item, index) => `key-${index}`}
            numColumns={2}
            onEndReachedThreshold={0.8}
            scrollEventThrottle={1}
            contentInset={{bottom: 32}}
            onEndReached={onEndReached}
            style={{paddingTop: 10}}
            scrollEnabled={false}
            ListFooterComponent={() => {
              return (
                <>
                  {isFetchingNextPageBuyList &&
                    getProductsForSelectedTab()?.length != 0 && <Loader />}
                </>
              );
            }}
            ListEmptyComponent={
              <NoProductListItem
                navigation={navigation}
                optionDetails={optionDetails}
              />
            }
          />
        </>
      )}
    </>
  );
};
