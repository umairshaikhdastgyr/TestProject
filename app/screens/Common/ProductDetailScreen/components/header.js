import React, {useState, useEffect} from 'react';

import ActionSheet from 'react-native-actionsheet';

import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Animated,
  TouchableOpacity,
  Share,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import {Colors} from '#themes';
import {Icon, SweetDialog} from '#components';
import usePrevious from '#utils/usePrevious';
import {
  updatePostStatus,
  getPostsDraft,
  getPostsDraftNextPage,
  deletePost,
  setPhotoList,
  setNewForm,
  setPhotoListFromServer,
} from '#modules/Sell/actions';
import {
  useActions,
  getMapObjectFromGoogleObj,
  getProductShareLink,
} from '#utils';
import {getFirebaseLink} from '#utils';
import {selectCategoriesData} from '#modules/Categories/selectors';
import {repostItem} from '#services/apiPosts';
import {selectChatData} from '#modules/Chat/selectors';
import {handleGotoChatScreen} from '#screens/Common/helper-functions';
import {getOrderById} from '#services/apiOrders';
import {MainAuthStackNavigation} from '../../../../navigators/MainAuthStackNavigation';
import {useRoute} from '@react-navigation/native';
import {getUserBuyList, getUserSellList} from '#modules/User/actions';

const {width} = Dimensions.get('window');
const SELL_STATUS = [
  'ACTIVE',
  'OFFER RECEIVED',
  'OFFER ACCEPTED',
  'SOLD',
  'INACTIVE',
  'LISTING BLOCKED',
  'DRAFT',
];
const BUY_STATUS = [
  'BUYING',
  'DECLINED',
  'CANCELLED',
  'BROUGHT',
  'INACTIVE',
  'SOLD',
];
const ACTION_ITEMS_STATUS = {
  BUY: {
    BUYING: {
      primary: [
        'View Order Status',
        'Message Seller',
        'Share Item',
        // 'Help',
        'Cancel',
      ],
    },
    DECLINED: {
      primary: [
        'View Order Status',
        'Message Seller',
        'Share Item',
        // 'Help',
        'Cancel',
      ],
    },
    CANCELLED: {
      primary: [
        'Leave seller a review',
        'Message Seller',
        'View Order Status',
        'Share Item',
        // 'Help',
        'Cancel',
      ],
    },
    INACTIVE: {
      primary: [
        'Message Seller',
        'Share Item',
        // 'Help',
        'Cancel',
      ],
    },
    SOLD: {
      primary: [
        'View Order Status',
        'Message Seller',
        'Share Item',
        // 'Help',
        'Cancel',
      ],
    },
    BROUGHT: {
      primary: [
        'Leave seller a review',
        'Message Seller',
        'View Order Status',
        'Share Item',
        // 'Help',
        'Cancel',
      ],
    },
  },
  SELL: {
    ACTIVE: {
      primary: [
        'Mark as Sold',
        'Boost',
        'Make Listing Inactive',
        'Edit Listing',
        'Delete Listing',
        // 'Help',
        'Cancel',
      ],
      secondary: [
        'Boost',
        'Make Listing Inactive',
        'Edit Listing',
        'Delete Listing',
        // 'Help',
        'Cancel',
      ],
    },
    'OFFER ACCEPTED': {
      primary: [
        'Mark as Sold',
        'Boost',
        'Make Listing Inactive',
        'Edit Listing',
        'Delete Listing',
        // 'Help',
        'Cancel',
      ],
      secondary: [
        'Boost',
        'Make Listing Inactive',
        'Edit Listing',
        'Delete Listing',
        // 'Help',
        'Cancel',
      ],
    },
    'OFFER RECEIVED': {
      primary: [
        'Mark as Sold',
        'Boost',
        'Make Listing Inactive',
        'Edit Listing',
        'Delete Listing',
        // 'Help',
        'Cancel',
      ],
      secondary: [
        'Boost',
        'Make Listing Inactive',
        'Edit Listing',
        'Delete Listing',
        // 'Help',
        'Cancel',
      ],
    },
    INACTIVE: {
      primary: [
        'Reactivate Listing',
        'Edit Listing',
        'Delete Listing',
        // 'Help',
        'Cancel',
      ],
      secondary: [],
    },
    SOLD: {
      primary: [
        'View Order Status',
        'Repost Listing',
        'Use Listing as a Template',
        // 'Help',
        'Cancel',
      ],
      secondary: [
        'Leave a review',
        'Repost Listing',
        'View Order Status',
        'Use Listing as a Template',
        // 'Help',
        'Cancel',
      ],
    },
    'LISTING BLOCKED': {
      primary: [
        // 'Reactivate Listing',
        'Edit Listing',
        'Delete Listing',
        'Delete Listing',
        // 'Help',
        'Cancel',
      ],
      secondary: [],
    },
    DRAFT: {
      primary: [
        'Edit Listing',
        'Delete Listing',
        // 'Help',
        'Cancel',
      ],
      secondary: [],
    },
  },
};
const HeaderProductDetail = ({
  navigation,
  headerOpacity,
  prodStatus,
  actionType,
  postDetail,
  interestedBuyers,
  ordersList,
  postId,
  productId,
  userInfo,
  userProductDetail,
  chatAction,
  redirectToOrderStatus,
  goBack,
  completedOrderList,
  showBoostModal,
  actionItems = [],
  isPostedByCurrentUser,
  completePostFromDashboard = null,
  setLoader,
  isDashboard,
}) => {
  /* States */
  /* Actions */
  const {categoriesList} = useSelector(selectCategoriesData());
  const {chatInfo} = useSelector(selectChatData());
  const route = useRoute();
  const actions = useActions({
    getPostsDraft,
    getPostsDraftNextPage,
    deletePost,
    setPhotoList,
    setNewForm,
    setPhotoListFromServer,
  });
  const dispatch = useDispatch();
  let MoreActionSheet;
  const prodType = route?.params?.prodType ?? undefined;
  const [localActionItems, setActionItems] = useState([
    'Report Listing',
    'Report Seller',
    'Cancel',
  ]);
  const prevCompletedOrderList = usePrevious(completedOrderList);
  useEffect(() => {
    if (
      actionItems?.length === 0 &&
      Object.keys(completedOrderList.data).length > 0 &&
      prevCompletedOrderList &&
      Object.keys(prevCompletedOrderList.data).length === 0
    ) {
      if (prodType === 'SELL') {
        const actionItems1 =
          ACTION_ITEMS_STATUS[prodType][prodStatus].secondary;
        setActionItems(actionItems1);
      }
    }
  }, []);
  useEffect(() => {
    if (
      prodType &&
      prodType === 'SELL' &&
      SELL_STATUS.includes(prodStatus) &&
      actionItems?.length === 0
    ) {
      const actionItems1 =
        ACTION_ITEMS_STATUS[prodType][prodStatus][actionType];
      setActionItems(actionItems1);
    }

    if (prodType && prodType === 'BUY' && BUY_STATUS.includes(prodStatus)) {
      const actionItems1 =
        ACTION_ITEMS_STATUS[prodType][prodStatus][actionType];
      setActionItems(actionItems1);
    }
  }, []);

  useEffect(() => {
    if (
      actionItems?.length === 0 &&
      userInfo.id === postDetail.userId &&
      !SELL_STATUS.includes(prodStatus) &&
      !BUY_STATUS.includes(prodStatus)
    ) {
      setActionItems(['Help', 'Cancel']);
    } else if (
      actionItems?.length === 0 &&
      userInfo.id !== postDetail.userId &&
      !SELL_STATUS.includes(prodStatus) &&
      !BUY_STATUS.includes(prodStatus)
    ) {
      setActionItems(['Message Seller', 'Share Item', 'Cancel']);
    }
  }, []);

  const openShareItemOptions = async () => {
    let message = `Checkout this ${postDetail.Product.title} for $${
      postDetail?.initialPrice
    }  I found on Homitag. ${postDetail?.description || ''}`;
    const link = await getProductShareLink(
      `?postId=${postDetail?.id}`,
      postDetail?.Product?.ProductImages?.[0]?.urlImage,
      'Checkout this product',
      message,
    );
    message = `${message} \n ${link}`;
    const shareOptions = {
      title: 'Share item',
      message,
    };
    await Share.share(shareOptions);
  };
  /* Methods */
  const handleGoBack = () => {
    goBack();
  };

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogData, setDialogData] = useState({
    code: '',
    title: '',
    message: '',
    mainBtTitle: '',
    secondaryBtTitle: '',
    onPress: () => {},
    stage: 'START',
  });

  useEffect(() => {
    if (dialogData.stage === 'DO') {
      setDialogVisible(true);
    }
  }, [dialogData]);

  const onModalTouchOutside = () => {
    setDialogVisible(false);
  };

  const onSecondaryButtonPressed = () => {
    setDialogVisible(false);
  };

  const onDeletePressed = () => {
    actions.deletePost({
      postId,
      productId,
      userId: userInfo.id,
    });

    setTimeout(() => {
      setDialogVisible(false);
      setDialogData({
        code: '',
        title: '',
        message: '',
        mainBtTitle: '',
        secondaryBtTitle: '',
        onPress: () => {},
        stage: 'START',
      });
      loadDashboardData();
      navigation.goBack();
    }, 2500);
  };

  const onMainRepostButtonPressed = async (
    postStatusId,
    availableQuantity,
    rediecrtParam = null,
  ) => {
    dispatch(
      updatePostStatus({
        params: {postStatusId, availableQuantity},
        postId,
        rediecrtParam,
      }),
    );
    loadDashboardData();
    setDialogVisible(false);
  };

  const onMainButtonPressed = async (postStatusId, rediecrtParam = null) => {
    dispatch(
      updatePostStatus({
        params: {postStatusId},
        postId,
        rediecrtParam,
      }),
    );
    setDialogVisible(false);
    setTimeout(() => {
      loadDashboardData();
      navigation.goBack();
    }, 2000);
  };

  const loadDashboardData = () => {
    dispatch(
      getUserBuyList(
        {
          type: 'buy',
          userId: userInfo.id,
          page: 1,
        },
        1,
      ),
    );
    dispatch(
      getUserSellList(
        {
          type: 'sell',
          userId: userInfo.id,
          page: 1,
          isDashBoard: false,
        },
        1,
      ),
    );
  };

  const onMoreAction = index => {
    const options =
      actionItems === null || actionItems.length === 0
        ? localActionItems
        : actionItems;
    const selectItem = options[index];
    if (actionItems !== null) {
      onMoreActionForDashboardRedirectedProducts(selectItem);
      return;
    }
    switch (selectItem) {
      case 'Boost':
        showBoostModal();
        break;
      case 'Mark as Sold':
        navigation.navigate('MarkAsSold', {
          data: postDetail,
          buyerList: interestedBuyers,
          ordersList,
          postId,
          key: `detail${postId}`,
        });
        break;
      case 'Make Listing Inactive':
        setDialogData({
          code: 'draft_available',
          title: 'Deactivate Listing',
          message:
            'Deactivating this listing will delist it from the marketplace immediately. You can always reactivate it though your profile.',
          mainBtTitle: 'Deactivate Listing',
          secondaryBtTitle: 'Cancel',
          stage: 'DO',
          onPress: () => {
            onMainButtonPressed('3efb5c11-d55c-40f5-9cb7-1b61e1da4738');
          },
        });
        break;
      case 'Repost Listing':
        setDialogData({
          code: 'draft_available',
          title: 'Repost Listing',
          message:
            'Reposting this listing will make it go live immediately on the marketplace. Please cofirm below',
          mainBtTitle: 'Repost Listing',
          secondaryBtTitle: 'Cancel',
          stage: 'DO',
          onPress: () => {
            const productStatus = _.get(
              postDetail,
              'PostStatus.name',
              'Undefined',
            );
            const deliveryMethod = _.get(postDetail, 'DeliveryMethods', []);
            let actionType2 = 'primary';
            if (productStatus?.toUpperCase() === 'ACTIVE') {
              if (deliveryMethod.length > 1) {
                actionType2 = 'secondary';
              } else if (
                deliveryMethod.length === 1 &&
                deliveryMethod[0].code === 'pickup'
              ) {
                actionType2 = 'primary';
              } else {
                actionType2 = 'secondary';
              }
            }
            const availableQuantity = 1;
            const rediecrtParam = {
              postId,
              isFromDashboard: true,
              status: null,
              statusColor: Colors.primary,
              prodStatus: 'ACTIVE',
              actionType: actionType2,
              acType: 'reposted',
              postName: postDetail.title,
            };

            onMainRepostButtonPressed(
              '3c50efb7-419a-4446-8cb8-c8f45e1bcb8c',
              availableQuantity,
              rediecrtParam,
            );
            navigation.goBack();
          },
        });
        break;
      case 'Use Listing as a Template':
        loadData(postDetail, 'SellMain');
        break;
      case 'Edit Listing':
        loadData(postDetail, 'PostEditorProfile');
        break;
      case 'Help':
        navigation.navigate('HelpFeedback');
        break;
      case 'Reactivate Listing':
        setDialogData({
          code: 'draft_available',
          title: 'Reactivate Listing',
          message:
            'Reactivating this listing will make it go live immediately on the marketplace. Please cofirm below',
          mainBtTitle: 'Reactivate Listing',
          secondaryBtTitle: 'Cancel',
          stage: 'DO',
          onPress: () => {
            const productStatus = _.get(
              postDetail,
              'PostStatus.name',
              'Undefined',
            );
            const deliveryMethod = _.get(postDetail, 'DeliveryMethods', []);
            let actionType2 = 'primary';
            if (productStatus?.toUpperCase() === 'ACTIVE') {
              if (deliveryMethod.length > 1) {
                actionType2 = 'secondary';
              } else if (
                deliveryMethod.length === 1 &&
                deliveryMethod[0].code === 'pickup'
              ) {
                actionType2 = 'primary';
              } else {
                actionType2 = 'secondary';
              }
            }
            const rediecrtParam = {
              postId,
              isFromDashboard: true,
              status: null,
              statusColor: Colors.primary,
              prodStatus: 'ACTIVE',
              actionType: actionType2,
              acType: 'reactivated',
              postName: postDetail.title,
            };
            onMainButtonPressed(
              '3c50efb7-419a-4446-8cb8-c8f45e1bcb8c',
              rediecrtParam,
            );
          },
        });
        break;
      case 'Delete Listing':
        setDialogData({
          code: 'draft_available',
          title: 'Delete Listing',
          message:
            'This will delete this listing from the marketplace immediately. Are you sure you want to do this?',
          secondaryBtTitle: 'Cancel',
          mainBtTitle: 'Delete Listing',
          stage: 'DO',
          onPress: () => onDeletePressed(),
        });
        break;
      case 'Report Seller':
        navigation.navigate('ReportScreen', {
          type: 'Report Seller',
          name: `${userProductDetail.data.name}`,
          reportedUserId: postDetail.userId,
        });
        break;
      case 'Report Listing':
        navigation.navigate('ReportScreen', {
          type: 'Report Listing',
          reportedUserId: postDetail.userId,
          userProductDetail,
          screenDetails: postDetail,
        });
        break;
      case 'Share Item':
        openShareItemOptions();
        break;
      case 'Message Seller':
        chatAction();
        break;
      case 'View Order Status':
        redirectToOrderStatus();
        break;
      case 'Leave seller a review':
        navigation.navigate('ProductReviews', {
          productId: postDetail?.productId,
        });
        break;
      case 'Message Buyer':
        let newProductDetailsBuyer = postDetail;
        newProductDetailsBuyer.conversationId =
          completePostFromDashboard?.orderData?.conversationId;
        handleGotoChatScreen({
          navigation,
          sellerDetails: {
            id: completePostFromDashboard.buyerId,
            firstName:
              completePostFromDashboard?.postDetail?.sellerName?.split(
                ' ',
              )?.[0] || completePostFromDashboard?.postDetail?.sellerName,
            lastName:
              completePostFromDashboard?.postDetail?.sellerName?.split(
                ' ',
              )?.[1] || '',
          },
          postDetail: newProductDetailsBuyer,
        });
        break;
      default:
        break;
    }
  };

  const loadData = (data, screen) => {
    const newFormData = {};
    const newPhotosList = [];

    for (let i = 1; i < data.Product.ProductImages.length; i++) {
      newPhotosList.push({
        type: 'from-server',
        image: data.Product.ProductImages[i].urlImage,
        uri: data.Product.ProductImages[i].urlImage,
        id: data.Product.ProductImages[i].id,
      });
    }

    actions.setPhotoList(newPhotosList);
    actions.setPhotoListFromServer(newPhotosList);
    if (screen === 'SellMain') {
      newFormData.postStatus = {
        id: 'a0a6d994-e31a-4cd7-a107-7c630e5e1c90',
        name: 'Draft',
      };
      newFormData.productStatus = {
        id: 'a6d85682-c1f5-408f-8ef9-fffb6f0ddb48',
        name: 'Draft',
      };
    } else {
      newFormData.postId = data.id;
      newFormData.postStatus = data.PostStatus;
      newFormData.productId = data.Product.id;
    }

    // listing types:
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
      newFormData.category = categoriesList.find(
        item => item.id === data.Product.customProperties.category.id,
      );
    }

    // subCategory:
    if (data.Product.Category && data.Product.Category.id) {
      const subCat = newFormData.category?.childCategory.find(
        item => item.id === data.Product.Category.id,
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
      default:
        break;
    }

    if (data.initialPrice !== null) {
      newFormData.price = data.initialPrice;
    } else {
      newFormData.price = '';
    }

    newFormData.isNegotiable = data?.isNegotiable;

    newFormData.customProperties = data?.Product?.customProperties;

    newFormData.deliveryMethodsSelected = data?.DeliveryMethods;

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

    newFormData.paymentMethodsSelected = data?.PaymentMethods;

    newFormData.shareOnFacebook = data?.shareOnFacebook;

    actions.setPhotoList(newPhotosList);
    actions.setNewForm(newFormData);

    navigation.navigate(
      screen,
      newFormData?.listingType?.name === 'Vehicle'
        ? {
            'category-type': 'Vehicle',
            screen: 'profile',
            isDashboard: isDashboard,
          }
        : {
            screen: 'profile',
            isDashboard: isDashboard,
          },
    );
  };

  const onMoreActionForDashboardRedirectedProducts = async selectedOption => {
    switch (selectedOption) {
      case 'Mark as Sold':
        navigation.navigate('MarkAsSold', {
          data: postDetail,
          buyerList: interestedBuyers,
          ordersList: ordersList.data,
          postId,
          key: `detail${postId}`,
        });
        break;
      case 'Boost':
        showBoostModal();
        break;
      case 'Reactivate item':
        const postStatusId = postDetail?.PostStatus?.id;
        dispatch(
          updatePostStatus({
            params: {postStatusId, availableQuantity: 1},
            postId,
          }),
        );
        setTimeout(() => {
          loadDashboardData();
          navigation.goBack();
        }, 2000);
        break;
      case 'Make Listing Inactive':
        // setType('DEACTIVATE');
        setDialogData({
          code: 'draft_available',
          title: 'Deactivate Listing',
          message:
            'Deactivating this listing will delist it from the marketplace immediately. You can always reactivate it though your profile.',
          mainBtTitle: 'Deactivate Listing',
          secondaryBtTitle: 'Cancel',
          stage: 'DO',
          onPress: () => {
            onMainButtonPressed('3efb5c11-d55c-40f5-9cb7-1b61e1da4738');
          },
        });
        break;
      case 'Cancel Claim':
        // setShowClaimCancelPopup(true);
        break;
      case 'Repost Listing':
        // setType('REPOST');
        setDialogData({
          code: 'draft_available',
          title: 'Repost Listing',
          message:
            'Reposting this listing will make it go live immediately on the marketplace. Please cofirm below',
          mainBtTitle: 'Repost Listing',
          secondaryBtTitle: 'Cancel',
          stage: 'DO',
          onPress: async () => {
            await repostItem({postId});
            loadDashboardData();
            navigation.goBack();
          },
        });
        break;
      case 'Post Listing':
      case 'Use Listing as a Template':
        loadData(postDetail, 'SellMain');
        break;
      case 'Reactivate item':
        await repostItem({postId});
        loadDashboardData();
        navigation.goBack();
        break;
      case 'Edit Listing':
        loadData(postDetail, 'PostEditorProfile');
        break;
      case 'Help':
        navigation.navigate('HelpFeedback');
        break;
      case 'Reactivate Listing':
        // setType('REACTIVATE');
        setDialogData({
          code: 'draft_available',
          title: 'Reactivate Listing',
          message:
            'Reactivating this listing will make it go live immediately on the marketplace. Please cofirm below',
          mainBtTitle: 'Reactivate Listing',
          secondaryBtTitle: 'Cancel',
          stage: 'DO',
          onPress: () => {
            const productStatusNew = postDetail?.PostStatus?.name;
            const deliveryMethod = postDetail.DeliveryMethods;
            let actionType2 = 'primary';
            if (productStatusNew?.toUpperCase() === 'ACTIVE') {
              if (deliveryMethod.length > 1) {
                actionType2 = 'secondary';
              } else if (
                deliveryMethod.length === 1 &&
                deliveryMethod[0].code === 'pickup'
              ) {
                actionType2 = 'primary';
              } else {
                actionType2 = 'secondary';
              }
            }
            const rediecrtParam = {
              postId,
              isFromDashboard: true,
              status: null,
              statusColor: Colors.primary,
              prodStatus: 'ACTIVE',
              actionType: actionType2,
              acType: 'reactivated',
              postName: completePostFromDashboard.title,
              postImage: completePostFromDashboard?.images,
            };
            onMainButtonPressed(
              '3c50efb7-419a-4446-8cb8-c8f45e1bcb8c',
              rediecrtParam,
            );
          },
        });
        break;
      case 'Delete Listing':
        // setType('DELETE');
        setDialogData({
          code: 'draft_available',
          title: 'Delete Listing',
          message:
            'This will delete this listing from the marketplace immediately. Are you sure you want to do this?',
          secondaryBtTitle: 'Cancel',
          mainBtTitle: 'Delete Listing',
          stage: 'DO',
          onPress: () => {
            onDeletePressed();
          },
        });
        break;
      case 'Report Seller':
        //  setType('DELETE');
        navigation.navigate('ReportScreen', {
          type: 'Report Seller',
          name: `${completePostFromDashboard.postDetail.sellerName}`,
          reportedUserId: completePostFromDashboard.postDetail.userId,
        });
        break;
      case 'Report Listing':
        //  setType('DELETE');
        navigation.navigate('ReportScreen', {
          type: 'Report Listing',
          reportedUserId: postDetail.userId,
          userProductDetail,
          screenDetails: postDetail,
        });
        break;
      case 'Share Item':
        openShareItemOptions();
        break;
      case 'Message Seller':
        let newProductDetails = completePostFromDashboard.postDetail;
        newProductDetails.conversationId =
          completePostFromDashboard?.orderData?.conversationId;
        handleGotoChatScreen({
          navigation,
          sellerDetails: {
            id: completePostFromDashboard?.sellerId,
            firstName:
              completePostFromDashboard?.postDetail?.sellerName?.split(
                ' ',
              )?.[0] || completePostFromDashboard?.postDetail?.sellerName,
            lastName:
              completePostFromDashboard?.postDetail?.sellerName?.split(
                ' ',
              )?.[1] || '',
          },
          postDetail: newProductDetails,
        });
        break;
      case 'View Offer':
        const order = completePostFromDashboard?.order;
        const item = Object.entries(chatInfo).find(chatArr => {
          const chatOrder = chatArr?.[1]?.customInfo?.order;

          return chatOrder?.id === order?.id;
        });

        navigation.navigate('ChatScreen', {
          item: item[1],
          conversationId: item[0],
        });

        break;
      case 'Leave product review':
        navigation.navigate('LeaveProductReview', {
          productId: postDetail?.productId,
          productDetail: postDetail,
          orderId: postDetail?.orderId,
          productItem: postDetail,
        });
        break;
      case 'Leave seller a review':
        const sellerReview = completePostFromDashboard?.reviewInfo?.filter(
          item =>
            item?.type == 'reviewToSeller' || item?.type == 'reviewToSupplier',
        );
        navigation.navigate('LeaveReview', {
          orderId: completePostFromDashboard?.orderId,
          postId: postId,
          sellerName: postDetail?.sellerName,
          // reviewed: completePostFromDashboard?.buyerReviewed,
          reviewed: !sellerReview[0]?.enabled,
          sellerId: completePostFromDashboard?.sellerId,
        });
        break;
      case 'Leave buyer a review':
        navigation.navigate('LeaveBuyerReview', {
          orderId: completePostFromDashboard?.orderId,
          postId: completePostFromDashboard?.postId,
          buyerName: completePostFromDashboard?.orderData?.buyerInfo?.name,
          reviewed: completePostFromDashboard?.buyerReviewed,
          buyerId: completePostFromDashboard?.orderData?.buyerId,
        });
        break;
      case 'Ship Now':
      case 'View Order Status':
        let type = 'BUYER';
        if (completePostFromDashboard.postDetail.userId === userInfo.id) {
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
        chatItem.post.id = completePostFromDashboard.postDetail.id;
        chatItem.urlImage = userInfo.profilepictureurl;

        let sellerOrderData;
        if (type === 'SELLER') {
          sellerOrderData = await getOrderById({
            orderId: completePostFromDashboard?.orderId,
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
          sellerOrderData = await getOrderById({
            orderId: completePostFromDashboard?.orderId,
          });
          // Need to call getOrderById API to get correct details for sellerInfo
          chatItem.post.id = completePostFromDashboard.postId;
          chatItem.title = `${userInfo.firstName} ${userInfo.lastName}`;
          chatItem.sellerId = sellerOrderData.sellerId;
          chatItem.senderId = sellerOrderData.sellerId;
          chatItem.sellerFirstName = sellerOrderData.sellerInfo.firstName;
          chatItem.sellerLastName = sellerOrderData.sellerInfo.lastName;
          chatItem.receiver.userId = userInfo.id;
          chatItem.receiver.firstName = userInfo.firstName;
          chatItem.receiver.lastName = userInfo.lastName;
          chatItem.receiver.pictureUrl = userInfo.profilepictureurl;
        }

        if (completePostFromDashboard.postDetail.Product) {
          chatItem.post.urlImage =
            completePostFromDashboard.postDetail.Product.ProductImages[0]?.urlImage;
          chatItem.post.title =
            completePostFromDashboard.postDetail.Product.title;
        } else if (completePostFromDashboard.postDetail.productInfo) {
          chatItem.post.urlImage =
            completePostFromDashboard.postDetail.productInfo.ProductImages[0]?.urlImage;
          chatItem.post.title =
            completePostFromDashboard.postDetail.productInfo.title;
        }
        navigation.navigate('OrderStatus', {
          data: completePostFromDashboard.postDetail,
          type,
          chatItem,
          conversationId: null,
          orderId: completePostFromDashboard?.orderId,
        });
        break;
      case 'Message Buyer':
        let newProductDetailsBuyer = completePostFromDashboard?.postDetail;
        newProductDetailsBuyer.conversationId =
          completePostFromDashboard?.orderData?.conversationId;
        handleGotoChatScreen({
          navigation,
          sellerDetails: {
            id: completePostFromDashboard.buyerId,
            firstName:
              completePostFromDashboard?.postDetail?.sellerName?.split(
                ' ',
              )?.[0] || completePostFromDashboard?.postDetail?.sellerName,
            lastName:
              completePostFromDashboard?.postDetail?.sellerName?.split(
                ' ',
              )?.[1] || '',
          },
          postDetail: newProductDetailsBuyer,
        });
        break;
      default:
        break;
    }
  };

  const options =
    actionItems === null || actionItems.length === 0
      ? localActionItems
      : actionItems;
  const userOptions =
    userInfo.id == postDetail.userId
      ? options.filter(function (item) {
          if (item !== 'Report Listing' && item !== 'Report Seller') {
            return item;
          }
        })
      : options;

  const handleMoreButton = () => {
    if (!userInfo?.id) {
      MainAuthStackNavigation(navigation);
    } else {
      MoreActionSheet.show();
    }
  };

  return (
    <View
      style={{
        ...styles.header,
      }}>
      <View style={styles.innerView}>
        <TouchableOpacity onPress={handleGoBack} style={{padding: 16}}>
          {Platform.OS === 'ios' && <Icon icon="chevron-left-outline" />}
          {Platform.OS === 'android' && <Icon icon="back-outline" />}
        </TouchableOpacity>

        {(!isPostedByCurrentUser ||
          (isPostedByCurrentUser && actionItems !== null)) && (
          <TouchableOpacity onPress={handleMoreButton} style={{padding: 16}}>
            <Icon icon="more-outline" style={{width: 30, height: 30}} />
          </TouchableOpacity>
        )}
      </View>

      <Animated.View style={[styles.headerActive, {opacity: headerOpacity}]}>
        <TouchableOpacity onPress={handleGoBack} style={{padding: 16}}>
          {Platform.OS === 'ios' && <Icon icon="chevron-left_grey" />}
          {Platform.OS === 'android' && <Icon icon="back_grey" />}
        </TouchableOpacity>
        {(!isPostedByCurrentUser ||
          (isPostedByCurrentUser && actionItems !== null)) && (
          <TouchableOpacity onPress={handleMoreButton} style={{padding: 16}}>
            <Icon icon="more_grey" style={{width: 30, height: 30}} />
          </TouchableOpacity>
        )}
      </Animated.View>

      <ActionSheet
        ref={o => {
          MoreActionSheet = o;
        }}
        options={userOptions}
        destructiveButtonIndex={userOptions.length - 1}
        cancelButtonIndex={userOptions.length - 1}
        onPress={index => {
          onMoreAction(index);
          // loadData(postDetail);
        }}
      />

      <SweetDialog
        title={dialogData.title}
        message={dialogData.message}
        type="two"
        mainBtTitle={dialogData.mainBtTitle}
        secondaryBtTitle={dialogData.secondaryBtTitle}
        dialogVisible={dialogVisible}
        onTouchOutside={onModalTouchOutside}
        onMainButtonPressed={dialogData.onPress}
        onSecondaryButtonPressed={onSecondaryButtonPressed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    width,
    top: 0,
    left: 0,
    zIndex: 99,
    backgroundColor: 'transparent',
  },
  innerView: {
    paddingHorizontal: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width,
  },
  headerActive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width,
  },
});

export default HeaderProductDetail;
