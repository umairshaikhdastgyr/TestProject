/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  Share,
  SafeAreaView,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import {Colors, Fonts} from '#themes';
import {Icon, SweetDialog} from '#components';
import {SweetAlert} from '#components';
import {
  updatePostStatus,
  getPostsDraft,
  getPostsDraftNextPage,
  deletePost,
  setPhotoList,
  setNewForm,
  setPhotoListFromServer,
  setCopyPhotoList,
  setCopyFormData,
} from '#modules/Sell/actions';
import {
  useActions,
  getMapObjectFromGoogleObj,
  getProductShareLink,
} from '#utils';
import {selectCategoriesData} from '#modules/Categories/selectors';
import {selectUserData} from '#modules/User/selectors';
import {selectOrderData} from '#modules/Orders/selectors';
import {selectChatData} from '#modules/Chat/selectors';
import {handleGotoChatScreen} from '#screens/Common/helper-functions';
import {getOrderById} from '#services/apiOrders';
import {ORDER_STATUS} from '#utils/enums';
import ClaimCancelPopup from '#screens/Sell/OrderStatusScreen/components/CancelClaimPopup';
import moment from 'moment';
import {repostItem, reactivateItem, getPostDetail} from '#services/apiPosts';
import {getFirebaseLink} from '#utils';
import RNFetchBlob from 'rn-fetch-blob';
import {ActivityIndicator} from 'react-native';
import colors from '#themes/colors';

const fs = RNFetchBlob.fs;

const MoreButton = ({
  navigation,
  productItem,
  postId,
  sellProductId,
  loadSellData,
  showBoost,
  reloadList,
  actions: moreMenuOptions = [],
  successCount,
  isDashboard,
  prodStatus,
  actionType,
  prodType,
  postStatus,
  productStatus,
}) => {
  const [postDetail, setPostDetail] = useState({});
  const [interestedBuyers, setInterestedBuyers] = useState([]);
  const [showClaimCancelPopup, setShowClaimCancelPopup] = useState(false);
  const [isInitializedProductDetail, setIsInitializedProductDetail] =
    useState(false);
  const [productLoader, setProductLoader] = useState(false);
  const {ordersList, completedOrderList} = useSelector(selectOrderData());
  const {information: userInfo, userProductDetail} = useSelector(
    selectUserData(),
  );

  useEffect(() => {
    getProductDetail();
  }, []);

  const getProductDetail = async (isInitialized = true) => {
    try {
      setIsInitializedProductDetail(true);
      const payload = {
        postId: postId,
        params: {
          lat: 0,
          lng: 0,
          userId: userInfo.id,
        },
      };
      const PostDetails = await getPostDetail(payload);
      if (
        PostDetails?.status != 400 ||
        PostDetails?.error != 'Product not found'
      ) {
        if (Object.keys(PostDetails?.data).length > 0) {
          setPostDetail(PostDetails?.data);
          if (isInitialized == false) {
            setShowMoreMenu(true);
            setProductLoader(false);
          }
        }
      }
      setIsInitializedProductDetail(false);
    } catch (error) {
      setIsInitializedProductDetail(false);
      setProductLoader(false);
    }
  };

  const {categoriesList} = useSelector(selectCategoriesData());
  const {chatInfo} = useSelector(selectChatData());

  const actions = useActions({
    getPostsDraft,
    getPostsDraftNextPage,
    deletePost,
    setPhotoList,
    setNewForm,
    setPhotoListFromServer,
    setCopyPhotoList,
    setCopyFormData,
  });

  const dispatch = useDispatch();
  /**
   * 1. Create one useEffect & on that basis create the moreMenu options.
   * 2. Inside the event of pressing the more menu option, verify that all of them are working correctly.
   */

  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const openShareItemOptions = async () => {
    let message = `Checkout this ${productItem.title} for ${postDetail?.initialPrice} I found on Homitag.`;
    const link = await getProductShareLink(
      `?postId=${productItem.postId}`,
      productItem?.images,
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
  const [alertStatus, setAlertStatus] = useState({
    title: '',
    visible: false,
    message: '',
    type: '',
    alertType: '',
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

  const onDeletePressed = async () => {
    setDialogVisible(false);
    await actions.deletePost({
      postId,
      productId: sellProductId,
      userId: userInfo.id,
    });
    setTimeout(() => loadSellData(), 2000);
    successCount(1);
  };

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

  const onMainButtonPressed = async (postStatusId, rediecrtParam = null) => {
    dispatch(
      updatePostStatus({
        params: {postStatusId},
        postId,
        rediecrtParam,
      }),
    );
    setDialogVisible(false);
    setTimeout(() => loadSellData(), 2000);
  };

  const onMoreAction = async selectedOption => {
    if (selectedOption !== 'View Order Status') {
      setShowMoreMenu(false);
    }
    switch (selectedOption) {
      case 'Mark as Sold':
        // setType('SOLD');
        navigation.navigate('MarkAsSold', {
          data: postDetail,
          buyerList: interestedBuyers,
          ordersList: ordersList.data,
          postId,
          key: `detail${postId}`,
        });
        break;
      case 'Boost':
        showBoost();
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
        setShowClaimCancelPopup(true);
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
            loadSellData();
          },
        });
        break;
      case 'Post Listing':
        loadDataDraft(postDetail, 'd');
        break;
      case 'Use Listing as a Template':
        loadDataDraft(postDetail, 't');
        break;
      case 'Reactivate item':
        await reactivateItem({postId});
        loadSellData();
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
            const deliveryMethod = postDetail?.DeliveryMethods;
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
              postName: productItem.title,
              postImage: productItem?.images,
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
          name: `${postDetail.sellerName}`,
          reportedUserId: postDetail.userId,
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
        let newProductDetails = postDetail;
        newProductDetails.conversationId =
          productItem?.orderInfo?.conversationId;
        handleGotoChatScreen({
          navigation,
          sellerDetails: {
            id: productItem?.sellerId,
            firstName:
              postDetail?.sellerName?.split(' ')?.[0] || postDetail?.sellerName,
            lastName: postDetail?.sellerName?.split(' ')?.[1] || '',
          },
          postDetail: newProductDetails,
        });
        break;
      case 'Message Buyer':
        let newProductDetailsBuyer = postDetail;
        newProductDetailsBuyer.conversationId =
          productItem?.orderInfo?.conversationId;
        handleGotoChatScreen({
          navigation,
          sellerDetails: {
            id: productItem?.orderInfo?.buyerId,
            firstName:
              postDetail?.sellerName?.split(' ')?.[0] || postDetail?.sellerName,
            lastName: postDetail?.sellerName?.split(' ')?.[1] || '',
          },
          postDetail: newProductDetailsBuyer,
        });
        break;
      case 'View Offer':
        const order = productItem?.order;
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
          orderId: productItem?.orderId,
          productItem: productItem,
        });
        break;
      case 'Leave seller a review':
        const sellerReview = productItem?.reviewInfo?.filter(
          item =>
            item?.type == 'reviewToSeller' || item?.type == 'reviewToSupplier',
        );
        navigation.navigate('LeaveReview', {
          orderId: productItem?.orderId,
          postId: productItem?.postId,
          sellerName: postDetail?.sellerName,
          // reviewed: productItem?.buyerReviewed,
          reviewed: !sellerReview[0]?.enabled,
          sellerId: productItem?.sellerId,
          buyerId: productItem?.orderInfo?.buyerId,
        });
        break;
      case 'Leave buyer a review':
        navigation.navigate('LeaveBuyerReview', {
          orderId: productItem?.orderId,
          postId: productItem?.postId,
          buyerName: productItem?.orderInfo?.buyerInfo?.name,
          reviewed: productItem?.buyerReviewed,
          buyerId: productItem?.orderInfo?.buyerId,
          sellerId: productItem?.sellerId,
        });
        break;
      case 'Ship Now':
      case 'View Order Status':
        let type = 'BUYER';
        if (postDetail?.userId === userInfo.id) {
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
        chatItem.post.id = postDetail.id;
        chatItem.urlImage = userInfo.profilepictureurl;
        let sellerOrderData;
        if (productItem?.orderId == null) {
          setShowMoreMenu(false);
          setTimeout(() => {
            Alert.alert('Oops!', 'Order ID is not available.', [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
          }, 1000);
          return;
        }
        if (type === 'SELLER') {
          sellerOrderData = await getOrderById({
            orderId: productItem?.orderId,
          });
          chatItem.title = `${userInfo.firstName} ${userInfo.lastName}`;
          chatItem.sellerId = sellerOrderData?.sellerId;
          chatItem.senderId = sellerOrderData?.id;
          chatItem.sellerFirstName = sellerOrderData?.sellerInfo?.firstName;
          chatItem.sellerLastName = sellerOrderData?.sellerInfo?.lastName;
          chatItem.receiver.userId = sellerOrderData?.buyerId;
          chatItem.receiver.firstName = sellerOrderData?.sellerInfo?.firstName;
          chatItem.receiver.lastName = sellerOrderData?.sellerInfo?.lastName;
          chatItem.receiver.pictureUrl = sellerOrderData?.productInfo?.image;
        } else if (type === 'BUYER') {
          sellerOrderData = await getOrderById({
            orderId: productItem?.orderId,
          });
          // Need to call getOrderById API to get correct details for sellerInfo
          chatItem.post.id = productItem.postId;
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

        if (postDetail.Product) {
          chatItem.post.urlImage =
            postDetail.Product.ProductImages[0]?.urlImage;
          chatItem.post.title = postDetail.Product.title;
        } else if (postDetail.productInfo) {
          chatItem.post.urlImage =
            postDetail.productInfo.ProductImages[0]?.urlImage;
          chatItem.post.title = postDetail.productInfo.title;
        }
        setShowMoreMenu(false);
        navigation.navigate('OrderStatus', {
          data: postDetail,
          type,
          chatItem,
          conversationId: null,
          orderId: productItem?.orderId,
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
      // newFormData.postStatus = {
      //   id: "a0a6d994-e31a-4cd7-a107-7c630e5e1c90",
      //   name: "Draft",
      // };
      // newFormData.productStatus = {
      //   id: "a6d85682-c1f5-408f-8ef9-fffb6f0ddb48",
      //   name: "Draft",
      // };
      // newFormData.postId = data.id;
      // newFormData.productId = data.Product.id;
      newFormData.postTitle = data?.Product?.title;
      newFormData.postDescription = data?.Product?.description;
      if (data.location) {
        newFormData.location = getMapObjectFromGoogleObj(data.location);
      }
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
    let lastScreen;
    if (
      data.Product.customProperties &&
      data.Product.customProperties.lastScreen
    ) {
      lastScreen = data.Product.customProperties.lastScreen;
    }

    if (screen === 'PostEditorProfile') {
      navigation.navigate(
        screen,
        newFormData?.listingType?.name === 'Vehicle'
          ? {
              'category-type': 'Vehicle',
              screen: 'profile',
              overrideSave: true,
            }
          : {
              screen: 'profile',
              overrideSave: true,
            },
      );
    } else if (lastScreen && screen === 'SellMain') {
      navigation.navigate(
        lastScreen,
        newFormData?.listingType?.name === 'Vehicle'
          ? {
              'category-type': 'Vehicle',
              screen: 'profile',
            }
          : {
              screen: 'profile',
            },
      );
    } else {
      navigation.navigate(
        screen,
        newFormData?.listingType?.name === 'Vehicle'
          ? {
              'category-type': 'Vehicle',
              screen: 'profile',
            }
          : {
              screen: 'profile',
            },
      );
    }
  };
  const loadDataDraft = (data, typeOfClick) => {
    const newFormData = {};
    const newPhotosList = [];
    let lastScreen = null;
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
    if (typeOfClick == 'd') {
      newFormData.postId = data.id;
      newFormData.productId = data.Product.id;
    }
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
      newFormData.category = categoriesList.find(
        item => item.id === data.Product.customProperties.category.id,
      );
    }

    // subCategory:
    if (data.Product.Category && data.Product.Category.id) {
      const subCat = newFormData?.category?.childCategory?.find(
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
    if (typeOfClick == 'd') {
      newFormData.postStatus = data.PostStatus;
    }
    newFormData.shareOnFacebook = data.shareOnFacebook;

    actions.setPhotoList(newPhotosList);
    actions.setNewForm(newFormData);
    actions.setCopyPhotoList(newPhotosList);
    actions.setCopyFormData(newFormData);
    if (typeOfClick == 'd') {
      if (lastScreen) {
        navigation.navigate(lastScreen, {
          'category-type':
            newFormData?.listingType?.name === 'Vehicle' ? 'Vehicle' : 'Goods',
          isDraft: true,
          isDashboard: isDashboard,
        });
      } else {
        navigation.navigate('SellMain', {
          'category-type':
            newFormData?.listingType?.name === 'Vehicle' ? 'Vehicle' : 'Goods',
          isDraft: true,
          isDashboard: isDashboard,
        });
      }
    } else if (typeOfClick == 't') {
      navigation.navigate('SellMain', {
        'category-type':
          newFormData?.listingType?.name === 'Vehicle' ? 'Vehicle' : 'Goods',
        isDraft: true,
        isDashboard: isDashboard,
      });
    } else {
      // navigation.goBack();
    }
  };

  const onPressMoreButton = async () => {
    try {
      if (!isInitializedProductDetail) {
        setShowMoreMenu(true);
      } else {
        setProductLoader(true);
        getProductDetail(false);
      }
    } catch (error) {}
  };

  return (
    <>
      <ClaimCancelPopup
        isVisible={showClaimCancelPopup}
        onHide={() => {
          setShowClaimCancelPopup(false);
          setAlertStatus({
            title: `Your claim for ${productItem.title} has been successfully cancelled.`,
            visible: true,
            message: 'We’ll notify the seller of your cancellation too.',
            type: 'success',
          });
          setTimeout(reloadList, 1500);
        }}
        orderData={productItem?.orderInfo}
        orderId={productItem?.orderId}
      />
      <Modal
        animationType="fade"
        visible={showMoreMenu}
        onRequestClose={() => {
          setShowMoreMenu(false);
        }}
        transparent>
        <SafeAreaView
          style={{
            flex: 1,
            zIndex: 22,
            backgroundColor: '#00000080',
            justifyContent: 'flex-end',
          }}>
          {moreMenuOptions?.length > 0 &&
            moreMenuOptions?.map((opt, index) => (
              <TouchableOpacity
                onPress={() => {
                  if (opt.toLowerCase() == 'cancel') {
                    setShowMoreMenu(false);
                  } else {
                    onMoreAction(opt);
                  }
                }}
                style={{
                  width: '100%',
                  padding: 20,
                  backgroundColor:
                    opt.toLowerCase() == 'cancel' ? '#FF5656' : '#fff',
                  borderTopWidth: 0.7,
                  // borderBottomWidth: 0.3,
                  borderBottomColor: '#efefef',
                  borderTopColor: '#efefef',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Fonts.family.semiBold,
                    color: opt.toLowerCase() == 'cancel' ? 'white' : 'black',
                  }}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
        </SafeAreaView>
      </Modal>
      <View
        style={{
          position: 'absolute',
          right: 20,
          top: 10,
          zIndex: 20,
          elevation: 20,
        }}>
        <TouchableOpacity onPress={onPressMoreButton}>
          {productLoader ? (
            <View style={{width: 30, height: 30, padding: 5, right: -4}}>
              <ActivityIndicator size={'small'} color={colors.active} />
            </View>
          ) : (
            <Icon
              icon="more-outline"
              style={{width: 30, height: 30, padding: 5}}
            />
          )}
        </TouchableOpacity>

        <SweetAlert
          title={alertStatus.title}
          message={alertStatus.message}
          type={alertStatus.type}
          dialogVisible={alertStatus.visible}
          onTouchOutside={onAlertModalTouchOutside}
          iconWidth={120}
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
    </>
  );
};

export default MoreButton;
