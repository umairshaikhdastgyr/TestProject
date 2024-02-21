import React, {useEffect, useState, useRef, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Text,
  View,
  SectionList,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Linking,
  Modal,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import * as Progress from 'react-native-progress';
import ActionSheet from 'react-native-actionsheet';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import DeviceInfo from 'react-native-device-info';
import MapView, {Marker} from 'react-native-maps';
import moment from 'moment';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {selectUserData} from '#modules/User/selectors';
import {selectChatData} from '#modules/Chat/selectors';
import {selectOrderData} from '#modules/Orders/selectors';
import {selectPostsData} from '#modules/Posts/selectors';
import {getPostDetail} from '#modules/Posts/actions';
import {clearOrder, getOrders, offerAction} from '#modules/Orders/actions';
import usePrevious from '#utils/usePrevious';
import {clearUserReport, getUserInfo} from '#modules/User/actions';
import {
  sendMessage,
  receiveConversations,
  clearBadges,
  seenConversation,
} from '#modules/Chat/actions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  CachedImage,
  Heading,
  SweetAlert,
  SweetDialog,
  Toast,
} from '#components';
import {Colors} from '#themes';
import {styles} from './styles';
import images from '#assets/images';
import AcceptConfirmationModal from './AcceptConfirmationModal/';
import {orderAction} from '#services/apiOrders';
import fonts from '#themes/fonts';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {apiModels} from '#services/apiModels';
import Config from '#config';
import {getSupplierDataApi} from '#services/apiCatalog';
import useCheckNetworkInfo from '../../../hooks/useCheckNetworkInfo';
import icons from '#assets/icons';
import axios from 'axios';

const {API_URL} = Config;
const isIOS = Platform.OS === 'ios';
let conversationId;
let MoreActionSheet = null;

const ChatScreen = ({navigation, route}) => {
  const {internetAvailable} = useCheckNetworkInfo();
  const statusBarHeight = isIOS ? ifIphoneX(44, 20) : 0;
  const navHeaderHeight = useHeaderHeight();
  const navBarHeight = isIOS ? 44 : navHeaderHeight;
  const headerHeight = statusBarHeight + navBarHeight;
  // const headerHeight = 10;
  const {width, height} = Dimensions.get('window');
  const {chatInfo, errorMsg, isFetching} = useSelector(selectChatData());
  const {
    information: userInfo,
    sendUserReportState,
    userProductDetail,
  } = useSelector(selectUserData());
  const {ordersList} = useSelector(selectOrderData());
  const {postDetail} = useSelector(selectPostsData());
  const receiverFirstName =
    navigation?.state?.params?.item?.receiver?.firstName;
  const receiverLastName = navigation?.state?.params?.item?.receiver?.lastName;
  const receiverFullName = `${receiverFirstName} ${receiverLastName}`;
  const [orderData, setOrderData] = useState(null);
  const [hideChat, setHideChat] = useState(
    receiverFullName.toUpperCase() === 'ADMIN USER' ? true : false,
  );
  const [textMessage, setTextMessage] = useState('');
  const [msgHeight, onChangeHeight] = useState(16);
  const [dataGrouped, setDataGrouped] = useState([]);
  const [messages, setMessages] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loader, setLoader] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const [orderV2Status, setOrderV2Status] = useState({});

  let hasDynamicIsland = DeviceInfo.hasDynamicIsland();

  useEffect(() => {
    if (ordersList?.data?.[0]) {
      const orderToSend = ordersList?.data?.filter(
        order => order.conversationId == route?.params?.conversationId,
      );
      if (!orderToSend?.[0]) {
        setHideChat(true);
      }
      setOrderData(orderToSend?.[0]);
    } else if (ordersList?.success) {
      setHideChat(true);
    }
  }, [ordersList?.data]);
  const dispatch = useDispatch();
  const GetOrders = (data, time) => dispatch(getOrders(data, time));
  const SendMessage = sm => dispatch(sendMessage(sm));
  const ReceiveConversations = rc => dispatch(receiveConversations(rc));
  const ClearBadges = cId => dispatch(clearBadges(cId));
  const SeenConversation = sId => dispatch(seenConversation(sId));
  const GetPostDetail = gData => dispatch(getPostDetail(gData));
  const OfferAction = (data, type) => dispatch(offerAction(data, type));
  const GetUserInfo = user => dispatch(getUserInfo(user));

  const [showAcceptConfirmationModal, setShowAcceptConfirmationModal] =
    useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [cancelOrderAvailable, setCancelOrderAvailable] = useState(false);
  const [showOfferOptions, setShowOfferOptions] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showMeetupInMenu, setShowMeetupInMenu] = useState(false);
  const [heightOption, setHeightOption] = useState(1);
  const [counterAvailable, setCounterAvailable] = useState(true);
  // const [dataOrderFetched, setDataOrderFetched] = useState(false);
  const [countDown, setCountDown] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [imageModalVisible, showImageModal] = useState(false);
  const [offerActionData, setOfferActionData] = useState({
    action: null,
    title: '',
    message: '',
  });
  const [alertStatus, setAlertStatus] = useState({
    title: '',
    visible: false,
    message: '',
    type: '',
    alertType: '',
  });
  const [showPickupChatFillers, setShowPickupChatFillers] = useState(false);
  const item = route?.params?.item ?? {};
  const screenDetails = route?.params?.screenDetails ?? {};

  const postDetailsData =
    Object.keys(screenDetails).length > 0 ? screenDetails : postDetail;

  const rightAction = () => {
    MoreActionSheet.show();
  };
  /**
   * @description Hide accept confirmation modal
   * @return Void
   */
  const hideAcceptConfirmationModal = () => {
    setShowAcceptConfirmationModal(false);
  };

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

  const renderOrderStatus = () => {
    if (isAccepted && orderV2Status) {
      const asSeller = userInfo?.id === item?.sellerId;
      if (asSeller) {
        return item.receiver.userId === orderV2Status?.buyerId;
      } else {
        return userInfo?.id === orderV2Status?.buyerId;
      }
    } else {
      return false;
    }
  };
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

  const makeApiCallsOneByOne = useCallback(
    async (maxIndex, productImages = []) => {
      let i = 1;
      let base64ImageList = [];

      const makeNextApiCall = async () => {
        if (i <= maxIndex) {
          const element = productImages[i - 1];
          try {
            const base64Data = await makeApiCall(element);
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
          } catch (error) {
            i++;
            makeNextApiCall();
          }
        }
      };
      makeNextApiCall();
    },
    [makeApiCall, setUpdatedProductImages],
  );

  useEffect(() => {
    let productImages = postDetailsData?.Product?.ProductImages ?? [];

    makeApiCallsOneByOne(productImages.length, productImages);
  }, []);

  const titleAction = () => {
    const screen = route?.params?.screen ?? 'chat';
    const isSingleItem = !item.post?.id;
    if (screen === 'chat' && !isSingleItem) {
      if (renderOrderStatus()) {
        navigation.push('ProductDetail', {
          postId: item.post?.id,
          orderId: orderV2Status?.id,
          isFromDashboard: true,
          isBuy: true,
        });
      } else {
        const finalProductImages = postDetailsData?.Product?.ProductImages?.map(
          obj => {
            const findObj = updatedProductImages?.find(el => el?.id == obj?.id);
            if (findObj) {
              return findObj;
            } else {
              return obj;
            }
          },
        );
        navigation.push('ProductDetail', {
          postId: item.post?.id,
          postData: {
            ...postDetailsData,
            Product: {
              ...postDetailsData?.Product,
              ProductImages: finalProductImages,
            },
          },
        });
      }
    } else {
      navigation.goBack();
    }
  };

  const isPickup = useCallback(() => {
    if (
      screenDetails?.DeliveryMethods?.find(
        itemDel => itemDel?.code === 'pickup',
      )
    ) {
      return true;
    }
  }, [screenDetails?.DeliveryMethods]);

  /**
   * @description Start the expiration date count down
   * @returns Void
   */

  const action = route?.params?.action ?? null;
  const handleBackButton = useCallback(() => {
    if (action) {
      navigation.navigate('ChatMain');
      return;
    }
    navigation.navigate('ChatMain');
  }, [action]);
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );
    return () => subscription.remove();
  }, [handleBackButton]);

  useEffect(() => {
    conversationId = null;
    if (!userInfo?.id) {
      navigation.navigate('MainAuth');
      return;
    }
    if (chatInfo) {
      const arrayObj = Object.entries(chatInfo);
      arrayObj.sort((a, b) => {
        if (moment(a[1]?.datetime) > moment(b[1]?.datetime)) {
          return -1;
        }
        if (moment(a[1]?.datetime) < moment(b[1]?.datetime)) {
          return 1;
        }
        return 0;
      });
      if (arrayObj.length > 0) {
        ReceiveConversations({
          userId: userInfo?.id,
          lightMode: false,
          datetime: moment.utc(arrayObj[0][1]?.datetime).format(),
          origin: 'app',
        });
      } else {
        ReceiveConversations({
          userId: userInfo?.id,
          lightMode: false,
          origin: 'app',
        });
      }
    }
    const isSingleItem = !item.post?.id;
    if (!route?.params?.screenDetails && !isSingleItem) {
      // must load post details
      GetPostDetail({
        postId: item?.post?.id,
        params: {
          lat: 0,
          lng: 0,
          ...(userInfo?.id && {userId: userInfo?.id}),
        },
      });
      GetUserInfo({
        userId: item?.sellerId,
        params: {light: true},
      });
    }
  }, []);

  const _startCountdown = useCallback(() => {
    const orderDate = moment(orderV2Status?.createdAt);
    const currentData = moment();
    const limitData = orderDate.add(1, 'days');
    const timeLeft = limitData.diff(currentData, 'minutes');
    const timeDifference = currentData.diff(orderDate, 'hours', true);
    if (timeDifference < 24) {
      const hours = parseInt(timeLeft / 60, 10);
      const minutes = timeLeft % 60;
      setCountDown(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}`,
      );
      const timer = setInterval(() => {
        const currentDataA = moment();
        const timeLeftA = limitData.diff(currentDataA, 'minutes');
        const hoursA = parseInt(timeLeftA / 60, 10);
        const minutesA = timeLeftA % 60;
        setCountDown(
          `${hoursA.toString().padStart(2, '0')}:${minutesA
            .toString()
            .padStart(2, '0')}`,
        );
      }, 10000);
      return () => clearInterval(timer);
    }
  }, [orderV2Status?.createdAt]);

  useEffect(() => {
    dispatch(clearOrder());
  }, [dispatch]);

  const [convObj, setConvObj] = useState();

  useEffect(() => {
    if (chatInfo !== null) {
      const arrayObj = Object.entries(chatInfo);
      let convObjTemp = [];
      if (route?.params?.conversationId) {
        convObjTemp = arrayObj.find(
          conversation => conversation[0] === route?.params?.conversationId,
        );
      } else {
        if (!item?.post?.id) {
          convObjTemp = arrayObj.find(
            conversation =>
              !conversation[1]?.post?.id &&
              conversation[1]?.receiver?.userId === item?.sellerId,
          );
        } else {
          convObjTemp = arrayObj.find(
            conversation =>
              conversation[1]?.post?.id === item?.post?.id &&
              conversation[1]?.receiver?.userId === item?.receiver?.userId,
          );
        }
      }
      setConvObj(convObjTemp);
      if (convObjTemp?.[1]?.datetime) {
        // 3. check updates on orders
        const dataToSend = {
          postId: item?.post?.id,
          sellerId: item?.sellerId || navigation?.state?.params?.item?.sellerId,
          sort: 'createdAt-desc',
          page: 1,
          perPage: 20,
          buyerId: null,
        };
        if (item.sellerId === item.receiver.userId) {
          dataToSend.buyerId = userInfo?.id;
        } else {
          dataToSend.buyerId = item.receiver.userId;
        }
        GetOrders(dataToSend, moment());
      }
    }
  }, [
    chatInfo,
    item?.post?.id,
    item?.receiver?.userId,
    route?.params?.conversationId,
    navigation?.state?.params?.item?.sellerId,
    item?.sellerId,
    userInfo?.id,
  ]);
  const getOrderStatus = useCallback(async () => {
    setLoader(true);
    const getMessageData = messages?.map(item => item?.data);
    const flattenedArray = getMessageData.flat();
    const getAllOrderId = flattenedArray?.map(
      item => item?.customInfo?.order?.orderId,
    );
    const filterOrderId = getAllOrderId?.filter(item => item != undefined);
    const getOriginalOrderId = filterOrderId?.filter(item => item?.length > 15);
    const getOrderId =
      getOriginalOrderId?.length != 0
        ? getOriginalOrderId[0]
        : messages[messages?.length - 1]?.data[
            messages[messages?.length - 1]?.data?.length - 1
          ].customInfo?.order?.orderId;

    const v2OrderData = await apiModels(
      `${API_URL}/orders/v2/orders/${getOrderId}`,
      'GET',
      null,
      null,
      true,
    );
    setOrderV2Status(v2OrderData);
    if (!v2OrderData) {
      setLoader(false);
      return;
    }
    if (v2OrderData) {
      const {deliveryMethod, paymentMethod, sellerId} = v2OrderData;
      const isSeller = sellerId === userInfo?.id;
      const isPickupDeliveryMethod = deliveryMethod?.type === 'pickup';
      const isInPersonPaymentMethod = paymentMethod?.type === 'inperson';
      const isCreditPaymentMethod = paymentMethod?.type === 'creditcard';
      const isApplePaymentMethod = paymentMethod?.type === 'applepay';
      const isGooglePaymentMethod = paymentMethod?.type === 'googlepay';
      switch (v2OrderData?.order_status?.toLowerCase()) {
        case 'created':
          if (isPickupDeliveryMethod && isInPersonPaymentMethod) {
            setShowOfferOptions(false);
            setShowTime(false);
            if (userInfo?.id !== item?.sellerId) {
              setHeightOption(2);
            }
            setShowMeetupInMenu(true);
            if (item?.sellerId !== userInfo?.id) {
              setCancelOrderAvailable(true);
            }
          } else if (isPickupDeliveryMethod) {
            if (item?.sellerId !== userInfo?.id) {
              setCancelOrderAvailable(true);
            }
            setCounterAvailable(true);
            setShowOfferOptions(isSeller);
            setShowTime(true);
            setHeightOption(isSeller ? 3 : 2);
            setShowMeetupInMenu(false);
            _startCountdown();
          }
          setLoader(false);
          break;
        case 'accepted':
        case 'pending':
        case 'partialyshipped':
          setIsAccepted(true);
          setShowOfferOptions(false);
          setShowTime(false);
          setHeightOption(1);
          if (orderV2Status?.deliveryMethod?.type === 'pickup') {
            setShowMeetupInMenu(true);
          }
          if (item?.sellerId !== userInfo?.id) {
            setCancelOrderAvailable(true);
          }
          setLoader(false);
          break;
        case 'pendingbuyerconfirmation':
          setIsAccepted(true);
          setShowOfferOptions(false);
          setShowTime(false);
          setHeightOption(2);
          setShowMeetupInMenu(false);
          if (item?.sellerId !== userInfo?.id) {
            setCancelOrderAvailable(true);
          }
          setLoader(false);
          break;
        case 'return_accepted':
        case 'return_declined':
        case 'return_closed':
        case 'return_shipped':
        case 'return_completed':
        case 'return_returned':
        case 'return_cancelled':
        case 'claim_filed':
        case 'claim_accepted':
        case 'claim_denied':
        case 'claim_disputed':
        case 'claim_closed':
        case 'shipped':
        case 'cancelled':
        case 'cancellation_denied':
        case 'cancellation_requested':
        case 'buyaccepted':
          setIsAccepted(true);
          setShowOfferOptions(false);
          setShowTime(false);
          setHeightOption(2);
          setShowMeetupInMenu(false);
          if (item?.sellerId !== userInfo?.id) {
            setCancelOrderAvailable(true);
          }
          setLoader(false);
          break;
        case 'inTransit':
        case 'intransit':
          setIsAccepted(true);
          setShowOfferOptions(false);
          setShowTime(false);
          setHeightOption(2);
          setShowMeetupInMenu(false);
          if (item?.sellerId !== userInfo?.id) {
            setCancelOrderAvailable(true);
          }
          setLoader(false);
          break;
        case 'delivered':
          setIsAccepted(true);
          setShowOfferOptions(false);
          setShowTime(false);
          setHeightOption(2);
          setShowMeetupInMenu(false);
          setCancelOrderAvailable(false);
          setLoader(false);
          break;
        case 'requestreturn':
          setIsAccepted(true);
          setShowOfferOptions(false);
          setShowTime(false);
          setHeightOption(2);
          setShowMeetupInMenu(false);
          setCancelOrderAvailable(false);
          setLoader(false);
          break;
        case 'return_requested':
          setIsAccepted(true);
          setShowOfferOptions(false);
          setShowTime(false);
          setHeightOption(2);
          setShowMeetupInMenu(false);
          setCancelOrderAvailable(false);
          setLoader(false);
          break;
        case 'refunded':
          setIsAccepted(true);
          setShowOfferOptions(false);
          setShowTime(false);
          setHeightOption(2);
          setShowMeetupInMenu(false);
          setCancelOrderAvailable(false);
          setLoader(false);
          break;
        case 'transactioncomplete':
          setIsAccepted(true);
          setShowOfferOptions(false);
          setShowTime(false);
          setHeightOption(2);
          setShowMeetupInMenu(false);
          setCancelOrderAvailable(false);
          setLoader(false);
          break;
        case 'declined':
          setShowOfferOptions(false);
          setShowTime(false);
          setHeightOption(0);
          setShowMeetupInMenu(false);
          setCancelOrderAvailable(false);
          setLoader(false);
          break;
        case 'pendingexchange':
        case 'transactioncancelled':
          setIsAccepted(true);
          if (
            isPickupDeliveryMethod &&
            (isCreditPaymentMethod ||
              isApplePaymentMethod ||
              isGooglePaymentMethod)
          ) {
            setShowOfferOptions(false);
            setShowTime(false);
            setHeightOption(1);
            setShowMeetupInMenu(false);
          }
          setLoader(false);
          break;
        case 'counteredseller':
          _startCountdown();
          if (
            isPickupDeliveryMethod &&
            (isCreditPaymentMethod ||
              isApplePaymentMethod ||
              isGooglePaymentMethod)
          ) {
            setIsAccepted(false);
            setShowOfferOptions(!isSeller);
            setCounterAvailable(!isSeller);
            setShowTime(true);
            setHeightOption(isSeller ? 2 : 3);
            setShowMeetupInMenu(false);
          }
          if (item?.sellerId !== userInfo?.id) {
            setCancelOrderAvailable(true);
          }
          setLoader(false);
          break;
        case 'counteredbuyer':
          _startCountdown();
          if (
            isPickupDeliveryMethod &&
            (isCreditPaymentMethod ||
              isApplePaymentMethod ||
              isGooglePaymentMethod)
          ) {
            setIsAccepted(false);
            setCounterAvailable(false);
            setShowOfferOptions(isSeller);
            setShowTime(true);
            setHeightOption(isSeller ? 3 : 2);
            setShowMeetupInMenu(false);
          }
          setLoader(false);
          break;
        default:
          setLoader(false);
          break;
      }
    } else {
      // no orders
      if (userInfo?.id !== item?.sellerId) {
        // buyer
        setIsAccepted(false);
        setShowOfferOptions(false);
        setShowTime(false);
        setHeightOption(2);
        setShowMeetupInMenu(false);
        setLoader(false);
      } else {
        // seller
        setIsAccepted(false);
        setShowOfferOptions(false);
        setShowTime(false);
        setHeightOption(1);
        setShowMeetupInMenu(false);
        setLoader(false);
      }
    }
  }, [_startCountdown, orderData, item?.sellerId, userInfo?.id, messages]);
  const convObjRef = useRef();
  useEffect(() => {
    setLoader(true);
    if (convObj?.[1]?.datetime) {
      convObjRef.current = convObj;
      conversationId = convObj[0];
      console.log('convObj[1]?.conversation?.sections[0].data.lengthll');
      // setDataGrouped(convObj[1]?.conversation?.sections);
      setMessages(convObj[1]?.conversation?.sections);
      // 1. clear badge in state
      ClearBadges({
        conversationId,
      });
      // 2. call seen method in socket with params: conversationId and userId
      SeenConversation({
        conversationId,
      });
      setLoader(false);
    } else {
      setLoader(false);
      // setDataGrouped([]);
      setMessages([]);
    }
  }, [
    convObj,
    item?.post?.id,
    item?.receiver?.userId,
    item?.sellerId,
    userInfo?.id,
  ]);
  // useEffect(() => {
  //   setMessages(dataGrouped)
  //   return () => {
  //   }
  // }, [dataGrouped])
  useEffect(() => {
    getOrderStatus();
  }, [_startCountdown, item?.sellerId, userInfo?.id, orderData, messages]);

  useEffect(() => {
    if (
      (errorMsg?.errorMsg == 500 || errorMsg?.errorMsg == 503) &&
      errorMsg.type === 'SEND_MESSAGE_FAIL'
    ) {
      setSendFailed(true);
    } else {
      setSendFailed(false);
    }
    return () => {};
  }, [errorMsg]);

  const handleSendMessage = msgToSend => {
    if (msgToSend.trim()) {
      if (messages.length > 0 && !sendFailed) {
        if (
          moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSSZ') ===
          moment(messages[0]?.datetime)
            .startOf('day')
            .format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
        ) {
          let sections = messages;
          let lastSection = messages[0];
          let lastSectionData = lastSection.data;
          let m = {};
          m.message = msgToSend;
          m.senderId = userInfo?.id;
          m.datetime = moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ');
          m.datetimeSeen = moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ');
          lastSectionData.unshift(m);
          // lastSectionData.push(m)
          lastSection.data = lastSectionData;
          sections[0] = lastSection;
          setMessages(sections);
          setRefresh(!refresh);
        } else {
          console.log('here 2');
          let sections = messages;
          let lastSection = {};
          let m = {};
          m.message = msgToSend;
          m.senderId = userInfo?.id;
          m.datetime = moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ');
          m.datetimeSeen = moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ');
          lastSection.data = [m];
          lastSection.datetime = moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ');
          lastSection.title = moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ');
          sections.unshift(lastSection);
          // lastSectionData.push(m)
          setMessages(sections);
          setRefresh(!refresh);
        }
      }
      setSendFailed(false);
      const paramsToAPI = {};
      paramsToAPI.message = msgToSend;
      paramsToAPI.senderId = userInfo?.id;
      if (conversationId) {
        paramsToAPI.conversationId = conversationId;
      } else {
        paramsToAPI.senderFirstName = userInfo.firstName;
        paramsToAPI.senderLastName = userInfo.lastName;
        paramsToAPI.senderPictureUrl = userInfo.profilepictureurl;
        paramsToAPI.receiverId = item.sellerId;
        // paramsToAPI.userToVerifyId = item.sellerId;
        paramsToAPI.receiverFirstName = item.sellerFirstName;
        paramsToAPI.receiverLastName = item.sellerLastName;
        paramsToAPI.receiverPictureUrl = item.urlImage;
        paramsToAPI.postId = item.post?.id;
        paramsToAPI.sellerId = item.sellerId;
        paramsToAPI.sellerFirstName = item.sellerFirstName;
        paramsToAPI.sellerLastName = item.sellerLastName;
        paramsToAPI.urlImage = item.urlImage;
        paramsToAPI.postTitle = item.post.title;
        paramsToAPI.postUrlImage = item.post.urlImage;
        paramsToAPI.postOfferAvailable = true;
      }
      SendMessage({
        params: {
          ...paramsToAPI,
        },
      });
      if (messages?.length == 0) {
        const data = {
          title: moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ'),
          datetime: moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ'),
          data: [
            {
              datetime: moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ'),
              message: msgToSend,
              senderId: userInfo?.id,
              customInfo: {},
              datetimeSeen: moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ'),
            },
          ],
        };
        setMessages([data]);
      }
      setTextMessage('');
    }
  };
  const itemRenderer = (itemRend, index, secIndex) => {
    const isMine = itemRend.senderId == userInfo?.id;
    const {customInfo, message} = itemRend;
    const name = isMine
      ? 'You'
      : `${route?.params?.item?.receiver?.firstName} ${route?.params?.item?.receiver?.lastName}`;
    if (!itemRend.message && !itemRend.senderId) {
      return null;
    }
    let body = <Text style={styles.bubbleMsgText}>{itemRend.message}</Text>;
    if (customInfo) {
      const {type} = customInfo;
      switch (type) {
        case 'attachment_message':
          return (
            <View
              style={isMine ? styles.mineContainer : styles.externalContainer}>
              {!isMine && (
                <View style={{alignSelf: 'flex-start'}}>
                  <CachedImage
                    source={
                      // Backend is returning a string with content "null" for empty pictureUrl property
                      item?.receiver?.pictureUrl === null ||
                      item?.receiver?.pictureUrl === undefined ||
                      item?.receiver?.pictureUrl === 'null'
                        ? item?.post?.urlImage === null ||
                          item?.post?.urlImage === 'null'
                          ? images.userPlaceholder
                          : {uri: item?.post?.urlImage}
                        : {uri: item?.receiver?.pictureUrl || ''}
                    }
                    style={styles.externalImg}
                    indicator={Progress.Pie}
                    indicatorProps={{
                      size: 30,
                      borderWidth: 0,
                      color: Colors.primary,
                      unfilledColor: Colors.white,
                    }}
                  />
                </View>
              )}
              <TouchableOpacity
                onPress={() => {
                  if (
                    customInfo?.metadata?.key
                      ?.split('.')
                      ?.pop()
                      ?.match(/(jpg|jpeg|png|gif)$/i)
                  ) {
                    showImageModal(customInfo?.url);
                  } else {
                    Linking.openURL(customInfo?.url);
                  }
                }}
                style={
                  isMine
                    ? styles.mineBubbleContainer
                    : styles.externalBubbleContainer
                }>
                {itemRend.message ? (
                  <Text style={[styles.bubbleMsgText]}>{itemRend.message}</Text>
                ) : null}
                {customInfo?.metadata?.key
                  ?.split('.')
                  ?.pop()
                  ?.match(/(jpg|jpeg|png|gif)$/i) ? (
                  <Image
                    source={{uri: customInfo?.url}}
                    style={{width: 180, height: 180, marginTop: 10}}
                  />
                ) : (
                  <View
                    style={{
                      paddingVertical: 10,
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      backgroundColor: '#B50706',
                      marginTop: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <AntDesign name="pdffile1" color="white" size={20} />
                    <Text
                      style={[
                        styles.bubbleMsgText,
                        {
                          color: Colors.white,
                          marginLeft: 5,
                        },
                      ]}>
                      {customInfo?.metadata?.key}
                    </Text>
                  </View>
                )}
                <Text style={styles.bubbleTimeText}>
                  {moment(itemRend.datetime).format('HH:mm')}
                </Text>
              </TouchableOpacity>
            </View>
          );
        case 'offer':
          body = <Text style={styles.bubbleMsgText}>{message}</Text>;
          break;
        case 'countered':
          body = <Text style={styles.bubbleMsgText}>{message}</Text>;
          break;
        case 'meetup':
          const {data} = customInfo;
          body = (
            <View>
              <Text style={styles.bubbleMsgText}>
                {name} proposed a meeting at
              </Text>
              <TouchableOpacity
                style={styles.mapToTap}
                onPress={() =>
                  navigation.navigate('LocationMap', {
                    location: data?.address,
                    marker: true,
                  })
                }
              />
              <MapView
                style={styles.mapContainer}
                zoomEnabled={false}
                scrollEnabled={false}
                cacheEnabled={false}
                region={{
                  latitude: data?.address?.latitude,
                  longitude: data?.address?.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}>
                <Marker
                  coordinate={{
                    latitude: data?.address?.latitude,
                    longitude: data?.address?.longitude,
                  }}
                  image={require('#assets/icons/map/Subtract.png')}
                  style={{width: 30, height: 30}}
                />
              </MapView>
              <Text style={styles.bubbleMsgText}>
                {data?.address?.formattedAddress}
                {'\n'}
                {moment(data?.scheduledTime).format('lll')}.
              </Text>
            </View>
          );
          break;
        case 'item_purchased':
          return (
            <>
              <View style={styles.offerStatusContainer}>
                <View style={styles.line} />
                <Text style={styles.offerStatusText}>
                  {`ITEM PURCHASED-[ID:${customInfo?.order?.orderId}]`}
                </Text>
                <View style={styles.line} />
              </View>
              <View
                style={
                  isMine ? styles.mineContainer : styles.externalContainer
                }>
                {!isMine && (
                  <View style={{alignSelf: 'flex-start'}}>
                    <CachedImage
                      source={
                        // Backend is returning a string with content "null" for empty pictureUrl property
                        item?.receiver?.pictureUrl === null ||
                        item?.receiver?.pictureUrl === undefined ||
                        item?.receiver?.pictureUrl === 'null'
                          ? item?.post?.urlImage === null ||
                            item?.post?.urlImage === 'null'
                            ? images.userPlaceholder
                            : {uri: item?.post?.urlImage}
                          : {uri: item?.receiver?.pictureUrl || ''}
                      }
                      style={styles.externalImg}
                      indicator={Progress.Pie}
                      indicatorProps={{
                        size: 30,
                        borderWidth: 0,
                        color: Colors.primary,
                        unfilledColor: Colors.white,
                      }}
                    />
                  </View>
                )}
                <View
                  style={
                    isMine
                      ? styles.mineBubbleContainer
                      : styles.externalBubbleContainer
                  }>
                  {body}
                  <Text style={styles.bubbleTimeText}>
                    {item.datetime
                      ? moment(item?.datetime).format('HH:mm')
                      : moment().format('HH:mm')}
                  </Text>
                </View>
              </View>
            </>
          );
        case 'offer_accepted':
          break;
        case 'offer_declined':
          body = (
            <Text style={styles.bubbleMsgText}>
              {isMine ? 'You declined the offer' : message}
            </Text>
          );
          break;
        case 'offer_cancelled':
          return (
            <View style={styles.offerStatusContainer}>
              <View style={styles.line} />
              <Text style={[styles.offerStatusText, {textAlign: 'center'}]}>
                {`offer cancelled-[ID:${orderV2Status?.orderID}]-[${
                  orderV2Status?.productInfo?.title
                }]-[${moment(orderData?.updatedAt).format('MM/DD/YY')}]`}
              </Text>
              <View style={styles.line} />
            </View>
          );
        case 'complete_exchange':
          return (
            <View style={styles.offerStatusContainer}>
              <View style={styles.line} />
              <Text style={styles.offerStatusText}>
                {type.split('_').join(' ')}
              </Text>
              <View style={styles.line} />
            </View>
          );
      }
    }
    return (
      <View
        style={
          isMine
            ? [
                styles.mineContainer,
                {flexDirection: 'row', justifyContent: 'flex-end'},
              ]
            : styles.externalContainer
        }>
        {!isMine ? (
          <View style={{alignSelf: 'flex-start'}}>
            <CachedImage
              source={
                // Backend is returning a string with content "null" for empty pictureUrl property
                item?.receiver?.pictureUrl === null ||
                item?.receiver?.pictureUrl === undefined ||
                item?.receiver?.pictureUrl === 'null'
                  ? item?.post?.urlImage === null ||
                    item?.post?.urlImage === 'null'
                    ? images.userPlaceholder
                    : {uri: item?.post?.urlImage}
                  : {uri: item?.receiver?.pictureUrl || ''}
              }
              style={styles.externalImg}
              indicator={Progress.Pie}
              indicatorProps={{
                size: 30,
                borderWidth: 0,
                color: Colors.primary,
                unfilledColor: Colors.white,
              }}
            />
          </View>
        ) : (
          <View style={{alignSelf: 'center'}}>
            {!(
              sendFailed &&
              index == 0 &&
              messages[0]?.data[0]?.message === itemRend.message &&
              messages[0]?.data[0]?.datetime === itemRend.datetime
            ) && <Fontisto name="check" size={10} color={Colors.primary} />}
          </View>
        )}
        <TouchableOpacity
          disabled={
            !(
              index == 0 &&
              messages[0]?.data[0]?.message === itemRend.message &&
              messages[0]?.data[0]?.datetime === itemRend.datetime
            )
          }
          onPress={() => {
            if (sendFailed) {
              let lastMessage = messages[0]?.data[0]?.message;
              handleSendMessage(lastMessage);
              setSendFailed(false);
              let sections = messages;
              let lastSection = messages[0];
              let lastSectionData = lastSection.data;
              lastSectionData.splice(0, 1);
              lastSection.data = lastSectionData;
              sections[0] = lastSection;
              setMessages(sections);
              setRefresh(!refresh);
            }
            // setTextMessage(itemRend.message)
            // handleSendMessage(itemRend.message)
          }}
          style={
            isMine ? styles.mineBubbleContainer : styles.externalBubbleContainer
          }>
          {body}
          <Text style={styles.bubbleTimeText}>
            {moment(itemRend.datetime).format('HH:mm')}
          </Text>
          {sendFailed &&
            index == 0 &&
            messages[0]?.data[0]?.message === itemRend.message &&
            messages[0]?.data[0]?.datetime === itemRend.datetime && (
              <Text style={{fontSize: 12, color: 'red', marginTop: 2}}>
                failed, tap to send again
              </Text>
            )}
        </TouchableOpacity>
        {!isMine &&
          !(
            sendFailed &&
            index == 0 &&
            messages[0]?.data[0]?.message === itemRend.message &&
            messages[0]?.data[0]?.datetime === itemRend.datetime
          ) && (
            <View style={{alignSelf: 'center'}}>
              <Fontisto name="check" size={10} color={Colors.primary} />
            </View>
          )}
      </View>
    );
  };
  const itemHeader = header => {
    let dateText = '';
    const today = moment(new Date()).startOf('day');
    const yesterday = today.clone().subtract(1, 'days').startOf('day');
    const momentDate = moment(header.datetime);
    if (momentDate.isSame(today, 'd')) {
      dateText = 'Today';
    } else if (momentDate.isSame(yesterday, 'd')) {
      dateText = 'Yesterday';
    } else {
      dateText = momentDate.format('ddd, D MMM');
    }
    return (
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>{dateText}</Text>
      </View>
    );
  };
  const renderHeaderHeader = () => <View style={{height: 15}} />;
  const isSeller = item?.sellerId === userInfo?.id;
  const sheetOptions = isSeller
    ? ['Report Buyer', 'Cancel']
    : ['Report Seller', 'Report Listing', 'Cancel'];
  if (showMeetupInMenu) {
    sheetOptions.splice(1, 0, 'Schedule meet up');
  }
  if (cancelOrderAvailable) {
    // sheetOptions.splice(1, 0, 'Cancel order');
  }
  const [toastError, setToastError] = useState({
    isVisible: false,
    message: '',
  });
  const prevSendUserReportState = usePrevious(sendUserReportState);
  useEffect(() => {
    if (
      sendUserReportState?.failure &&
      prevSendUserReportState &&
      !prevSendUserReportState?.failure
    ) {
      setToastError({
        isVisible: true,
        message: JSON.stringify(sendUserReportState.failure),
      });
    }
  }, [sendUserReportState]);

  const goToAction = index => {
    const name = `${item.receiver.firstName} ${item.receiver.lastName}`;
    switch (sheetOptions[index]) {
      case 'Report Buyer':
      case 'Report Seller':
        const reportTitle = sheetOptions[0];
        if (reportTitle === 'Report Seller') {
          navigation.navigate('ReportScreen', {
            type: 'Report Seller',
            reportedUserId: item.sellerId,
            name,
          });
        } else if (reportTitle === 'Report Buyer') {
          navigation.navigate('ReportScreen', {
            type: 'Report Buyer',
            reportedUserId: item?.receiver?.userId,
            name,
          });
        }
        break;
      case 'Cancel offer':
        setDialogVisible(true);
        setOfferActionData({
          title: 'Cancel Offer',
          message:
            'You’re able to cancel your offer before the seller accepts it without penalty.',
          action: 'cancel',
          mainBtTitle: 'Yes',
          secondaryBtTitle: 'No',
          onSecondaryButtonPressed: () => setDialogVisible(false),
        });
        break;
      case 'Schedule meet up':
        ordersList.data.length > 0 &&
          navigation.navigate('Meetup', {
            orderId: orderV2Status?.id,
            screenDetails: route?.params.screenDetails,
            item,
          });
        break;
      case 'Help':
        navigation.navigate('HelpFeedback');
        break;
      case 'Report Listing':
        //  setType('DELETE');
        navigation.navigate('ReportScreen', {
          type: 'Report Listing',
          reportedUserId: postDetailsData.userId,
          userProductDetail,
          screenDetails: postDetailsData,
        });
        break;
      default:
        break;
    }
  };

  const onModalTouchOutside = () => {
    setDialogVisible(false);
  };

  const onMainButtonPressed = () => {
    const payload = {
      orderId: orderV2Status?.id,
      action: offerActionData.action,
      user: {
        id: userInfo?.id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
      },
    };
    if (cancelOrderAvailable) {
      payload.userId = userInfo?.id;
      payload.cancelReason = 'otherreason';
      payload.cancelStatus = 'requested';
      payload.comment = 'aaa';
    }
    if (offerActionData.action === 'cancel') {
      OfferAction({...payload, cancelReason: 'changed_my_mind'});
      setDialogVisible(false);
      navigation.navigate('ExploreMain', {
        popUpMessage: `You successfully canceled your offer for ${item?.post?.title}`,
      });
      return;
    }
    OfferAction(payload);
    if (payload.action === 'accept') {
      const acceptedPostId = orderData?.postId;
      const acceptedOrderId = payload?.orderId;
      const chatWithOffers = Object.values(chatInfo).filter(
        chatDetail => chatDetail?.post?.id === acceptedPostId,
      );
      chatWithOffers.forEach(chatWithOffer => {
        const chatOrder = chatWithOffer?.customInfo?.order;
        if (chatOrder?.id !== acceptedOrderId) {
          const cancelPayload = {
            ...payload,
            action: 'decline',
            orderId: chatOrder?.id,
          };
          const orderActionResult = orderAction(cancelPayload);
        }
      });
    }
    if (isSeller && offerActionData.action === 'accept') {
      setTimeout(() => {
        setShowAcceptConfirmationModal(true);
      }, 1500);
    }
    setDialogVisible(false);
  };

  const goToOrderStatus = () => {
    const {sellerId, id} = orderV2Status;
    let type = '';
    switch (orderV2Status?.order_status?.toLowerCase()) {
      case 'accepted':
      case 'pending':
      case 'partialyshipped':
        if (sellerId === userInfo?.id) {
          type = 'SELLER';
        } else {
          type = 'BUYER';
        }
        break;
      case 'pendingbuyerconfirmation':
        if (sellerId === userInfo?.id) {
          type = 'SELLER';
        } else {
          type = 'BUYER';
        }
        break;
      case 'transactioncomplete':
        if (sellerId === userInfo?.id) {
          type = 'SELLER';
        } else {
          type = 'BUYER';
        }
        break;
      case 'return_accepted':
      case 'return_declined':
      case 'return_closed':
      case 'return_shipped':
      case 'return_completed':
      case 'return_returned':
      case 'return_cancelled':
      case 'claim_filed':
      case 'claim_accepted':
      case 'claim_denied':
      case 'claim_disputed':
      case 'claim_closed':
      case 'shipped':
      case 'cancelled':
      case 'cancellation_requested':
      case 'cancellation_denied':
      case 'buyaccepted':
        if (sellerId === userInfo?.id) {
          type = 'SELLER';
        } else {
          type = 'BUYER';
        }
        break;
      case 'intransit':
        if (sellerId === userInfo?.id) {
          type = 'SELLER';
        } else {
          type = 'BUYER';
        }
        break;
      case 'inTransit':
        if (sellerId === userInfo?.id) {
          type = 'SELLER';
        } else {
          type = 'BUYER';
        }
        break;
      case 'delivered':
        if (sellerId === userInfo?.id) {
          type = 'SELLER';
        } else {
          type = 'BUYER';
        }
        break;
      case 'requestreturn':
        if (sellerId === userInfo?.id) {
          type = 'SELLER';
        } else {
          type = 'BUYER';
        }
        break;
      case 'return_requested':
        if (sellerId === userInfo?.id) {
          type = 'SELLER';
        } else {
          type = 'BUYER';
        }
        break;
      case 'refunded':
        if (sellerId === userInfo?.id) {
          type = 'SELLER';
        } else {
          type = 'BUYER';
        }
        break;
      case 'transactioncancelled':
        if (sellerId === userInfo?.id) {
          type = 'SELLER';
        } else {
          type = 'BUYER';
        }
        break;
      default:
        break;
    }
    const conversationId = route?.params?.conversationId;
    navigation.navigate('OrderStatus', {
      data: postDetailsData,
      type,
      chatItem: item,
      conversationId,
      orderId: id,
    });
  };

  useEffect(() => {
    if (
      postDetailsData?.userId !== userInfo?.id &&
      !isAccepted &&
      !showOfferOptions &&
      isPickup() &&
      !ordersList.isFetching &&
      !ordersList.data
    ) {
      setShowPickupChatFillers(true);
    }
  }, [
    isAccepted,
    isPickup,
    ordersList.data,
    ordersList.isFetching,
    postDetailsData,
    showOfferOptions,
    userInfo,
  ]);
  const sectionListElement = useRef(null);

  const from = route.params?.from ?? null;
  const isSingleItem = !item.post?.id;

  const headerTitle = () => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => titleAction()}>
        {!isSingleItem && (
          <CachedImage
            source={{
              uri: item?.post?.urlImage,
            }}
            style={styles.headerImg}
            indicator={Progress.Pie}
            indicatorProps={{
              size: 30,
              borderWidth: 0,
              color: Colors.primary,
              unfilledColor: Colors.black,
            }}
          />
        )}
        <View>
          {!isSingleItem && (
            <Text numberOfLines={1} style={styles.headerTitleText}>
              {item?.post?.title?.length > 20
                ? `${item?.post?.title?.slice(0, 20)}...`
                : item?.post?.title}
            </Text>
          )}

          {postDetailsData &&
            Object.keys(postDetailsData).length > 0 &&
            postDetailsData?.customProperties?.origin !== 'suppliers' && (
              <Text
                numberOfLines={1}
                style={
                  !isSingleItem
                    ? styles.headerSubTitleText
                    : styles.headerSubTitleTextSecond
                }>
                {item?.receiver?.firstName?.toUpperCase() ?? ''}{' '}
                {item?.receiver?.lastName?.toUpperCase() ?? ''}
              </Text>
            )}

          {postDetailsData &&
            Object.keys(postDetailsData).length > 0 &&
            postDetailsData?.customProperties?.origin === 'suppliers' && (
              <Text
                numberOfLines={1}
                style={
                  !isSingleItem
                    ? styles.headerSubTitleText
                    : styles.headerSubTitleTextSecond
                }>
                {postDetailsData?.additionalPosts[0]?.storeInfo?.name?.toUpperCase() ??
                  ''}
              </Text>
            )}
        </View>
      </TouchableOpacity>
    );
  };

  const headerRight = () => (
    <TouchableOpacity onPress={() => rightAction()}>
      <CachedImage
        source={icons['more_grey']}
        style={{width: 25, height: 25}}
      />
    </TouchableOpacity>
  );

  const headerLeft = () => (
    <TouchableOpacity
      onPress={() => {
        if (from || action) {
          navigation.navigate('ChatMain');
          return;
        }
        navigation.goBack();
      }}
      style={{marginLeft: -15}}>
      <FeatherIcon name="chevron-left" size={37} color={Colors.darkGrey3} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.chatHeader}>
        {headerLeft()}
        {headerTitle()}
        {headerRight()}
        <Toast
          isVisible={internetAvailable === false}
          message="Please, check your internet connection."
        />
      </View>
      <Modal
        onRequestClose={() => showImageModal(false)}
        visible={imageModalVisible ? true : false}
        transparent>
        <TouchableOpacity
          onPress={() => showImageModal(false)}
          style={{
            flex: 1,
            backgroundColor: '#000000bb',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            resizeMode="contain"
            source={{uri: imageModalVisible}}
            style={{width: '90%', marginBottom: 20, height: height * 0.75}}
          />
          <Ionicons.Button
            onPress={() => {
              Linking.openURL(imageModalVisible);
            }}
            name="cloud-download"
            style={{marginTop: 0}}
            size={20}
            color="#ffffff"
            backgroundColor={Colors.primary}>
            Download
          </Ionicons.Button>
        </TouchableOpacity>
      </Modal>
      <Toast isVisible={toastError.isVisible} message={toastError.message} />
      {postDetailsData?.PostStatus?.name == 'Inactive (Sold out)' ? (
        <View
          style={{
            backgroundColor: Colors.primary,
            justifyContent: 'center',
            padding: 7.5,
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: fonts.family.regular,
              textAlign: 'center',
            }}>
            Item is sold
          </Text>
        </View>
      ) : null}
      {postDetailsData?.PostStatus?.name == 'Deactivated' ||
      postDetailsData?.PostStatus?.name == 'Inactive' ? (
        <View
          style={{
            backgroundColor: Colors.primary,
            justifyContent: 'center',
            padding: 7.5,
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: fonts.family.regular,
              textAlign: 'center',
            }}>
            Item is unavailable
          </Text>
        </View>
      ) : null}
      <KeyboardAvoidingView
        enabled
        style={styles.MainContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={hasDynamicIsland ? 90 : headerHeight}>
        <SectionList
          ref={sectionListElement}
          stickySectionHeadersEnabled={false}
          // sections={dataGrouped}
          sections={messages}
          renderItem={(section, index) =>
            itemRenderer(section.item, section.index, index)
          }
          keyExtractor={section => section?.item?.datetime + section.index}
          inverted
          // extraData={isFetching}
          style={styles.ChatListContainer}
          renderSectionFooter={({section}) => itemHeader(section)}
          ListFooterComponent={renderHeaderHeader}
          onScrollToIndexFailed={() => {}}
        />
        <View style={styles.msgSendContainer}>
          <View style={{paddingTop: 10}}>
            {/* {showTime && !showOfferOptions && (
              <View style={styles.offerTextContainer}>
                <Heading
                  type="inactive"
                  style={{
                    fontSize: 13,
                    textAlign: "left",
                    marginBottom: 30,
                    color: "#969696",
                  }}
                >
                  Offer expires in 24h | ({countDown} h)
                </Heading>
              </View>
            )} */}
            {showOfferOptions && orderV2Status && (
              <View style={styles.offerActionsContainer}>
                <View style={styles.offerOptionsContainer}>
                  <TouchableOpacity
                    style={styles.hintButtonOffer}
                    onPress={() => {
                      if (isSeller) {
                        setDialogVisible(true);
                        setOfferActionData({
                          title: 'Accept Offer',
                          message: 'You will accept the offer for this item?',
                          action: 'accept',
                          mainBtTitle: 'Yes',
                        });
                      } else {
                        const address =
                          orderV2Status?.deliveryMethod.type !== 'pickup'
                            ? {
                                ...orderV2Status?.deliveryMethod,
                                address_line_1:
                                  orderV2Status?.deliveryMethod.addressline1,
                                address_line_2:
                                  orderV2Status?.deliveryMethod.addressline2,
                              }
                            : null;
                        navigation.navigate('PaymentConfirmationScreen', {
                          data: {
                            ...postDetailsData,
                            offerValue: parseFloat(
                              orderData?.OrderPrices?.pop()?.offerValue,
                            ),
                          },
                          address,
                          orderObj: orderV2Status,
                        });
                      }
                    }}>
                    <Text style={styles.textHintButton}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.hintButtonOffer}
                    onPress={() => {
                      setDialogVisible(true);
                      setOfferActionData({
                        title: 'Decline Offer',
                        message:
                          'You are going to decline the offer for this item?',
                        action: 'decline',
                        mainBtTitle: 'Yes',
                      });
                    }}>
                    <Text style={styles.textHintButton}>Decline</Text>
                  </TouchableOpacity>
                  {counterAvailable && orderData?.isNegotiable && (
                    <TouchableOpacity
                      style={styles.hintButtonOffer}
                      onPress={() => {
                        navigation.navigate('MakeOfferScreen', {
                          title: 'Make Counter',
                          data: postDetailsData,
                          counter: true,
                        });
                      }}>
                      <Text style={styles.textHintButton}>Counter</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.offerTextContainer}>
                  <Heading
                    type="inactive"
                    style={{
                      fontSize: 13,
                      textAlign: 'left',
                      marginBottom: 30,
                      color: '#969696',
                    }}>
                    Offer expires in 24h | ({countDown}
                    h)
                  </Heading>
                </View>
              </View>
            )}
          </View>
          {renderOrderStatus() ? (
            <View style={styles.offerActionsContainer}>
              <View style={[styles.offerOptionsContainer, {paddingBottom: 25}]}>
                <TouchableOpacity
                  style={styles.hintButtonOffer}
                  onPress={goToOrderStatus}>
                  <Text style={styles.textHintButton}>Order Status</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : loader ||
            (convObj?.[1]?.datetime &&
              !hideChat &&
              route?.params?.conversationId) ? (
            <View
              style={[
                styles.externalContainer,
                {
                  marginBottom: 50,
                  marginTop: 0,
                  marginLeft: 20,
                },
              ]}>
              <CachedImage
                source={images.userPlaceholder}
                style={[styles.externalImg]}
                indicator={Progress.Pie}
                indicatorProps={{
                  size: 30,
                  borderWidth: 0,
                  color: Colors.primary,
                  unfilledColor: Colors.white,
                }}
              />
              <View
                style={[
                  styles.externalBubbleContainer,
                  {paddingVertical: 0, alignItems: 'center', width: '20%'},
                ]}>
                <Image
                  source={{uri: 'https://i.imgur.com/IYg2bC8.gif'}}
                  style={{width: 60, height: 40}}
                  resizeMode="contain"
                />
              </View>
            </View>
          ) : null}
          {showPickupChatFillers && (
            <View style={styles.offerActionsContainer}>
              <View style={[styles.offerOptionsContainer, {paddingBottom: 25}]}>
                <TouchableOpacity
                  style={styles.hintButtonOffer}
                  onPress={() => {
                    setTextMessage('Is this still available?');
                  }}>
                  <Text style={styles.textHintButton}>
                    Is this still available?
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.hintButtonOffer}
                  onPress={() => {
                    setTextMessage('What condition is it in?');
                  }}>
                  <Text style={styles.textHintButton}>
                    What condition is it in?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={styles.msgBoxContainer}>
            <View style={styles.msgTextContainer}>
              <TextInput
                placeholderTextColor={'#999999'}
                multiline
                onFocus={() => {}}
                underlineColorAndroid="transparent"
                style={[styles.textInput]}
                placeholder="Send Message"
                onChangeText={text => setTextMessage(text)}
                onContentSizeChange={event => {
                  if (Platform.OS === 'android') {
                    if (
                      !(
                        event.nativeEvent.contentSize.height === 28 &&
                        msgHeight === 17.5
                      )
                    ) {
                      onChangeHeight(event.nativeEvent.contentSize.height);
                    }
                  } else {
                    onChangeHeight(event.nativeEvent.contentSize.height);
                  }
                }}
                value={textMessage}
                blurOnSubmit={false}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                handleSendMessage(textMessage);
              }}
              style={styles.msgSendButton}>
              <Image source={require('../../../assets/images/sendArrow.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <ActionSheet
        ref={o => {
          MoreActionSheet = o;
        }}
        options={sheetOptions}
        onPress={goToAction}
        destructiveButtonIndex={sheetOptions.length - 1}
        cancelButtonIndex={sheetOptions.length - 1}
        tintColor="#313334"
        styles={{
          buttonText: styles.actionSheetButtonText,
        }}
      />
      <AcceptConfirmationModal
        dialogVisible={showAcceptConfirmationModal}
        orderData={orderV2Status}
        onTouchOutside={hideAcceptConfirmationModal}
      />

      <SweetDialog
        title={offerActionData.title}
        message={offerActionData.message}
        dialogVisible={dialogVisible}
        onTouchOutside={onModalTouchOutside}
        mainBtTitle={offerActionData.mainBtTitle}
        secondaryBtTitle={offerActionData.secondaryBtTitle}
        onSecondaryButtonPressed={offerActionData.onSecondaryButtonPressed}
        onMainButtonPressed={onMainButtonPressed}
      />
      <SweetAlert
        title={alertStatus.title}
        message={alertStatus.message}
        type={alertStatus.type}
        dialogVisible={alertStatus.visible}
        onTouchOutside={onAlertModalTouchOutside}
        iconWidth={120}
      />
    </SafeAreaView>
  );
};
export default ChatScreen;
