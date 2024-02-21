import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Text,
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import {Heading, FooterAction, Toast, Loader} from '#components';
import {safeAreaViewWhite, safeAreaNotchHelper} from '#styles/utilities';
import styles from './styles';
import {selectUserData, userSelector} from '#modules/User/selectors';
import {selectOrderData} from '#modules/Orders/selectors';
import {selectSellData} from '#modules/Sell/selectors';
import {
  createOffer,
  setPaymentDefault,
  getCardDetail,
  getOrders,
  offerAction,
  clearOrders,
  clearOrder,
} from '#modules/Orders/actions';
import {seenConversation, receiveConversations} from '#modules/Chat/actions';

import {getUserInfo, getAddressList} from '#modules/User/actions';
import {useActions, getMapObjectFromGoogleObj} from '#utils';
import ProductDetail from './product-detail';
import ItemElement from './item-element';
import ProtectionElement from './protection-element';
import ProtectionModal from './protection-modal';
import PaymentMethodElement from './payment-method-element';
import AddressElement from './address-element';
import usePrevious from '#utils/usePrevious';
import ScreenLoader from '#components/Loader/ScreenLoader';
import {getChatData} from '#modules/Chat/actions';
import {getShipRate} from '#modules/Sell/actions';
import BuyNowSuccessAlert from './buynowSuccessAlert';
import {getContent} from '#modules/General/actions';
import {generalSelector} from '#modules/General/selectors';
import {getTaxEstimation} from '../../../services/apiOrders';
import {selectChatData} from '#modules/Chat/selectors';

import QuantityElement from './QuantityElement';
import QuantityModal from './QuantityElement/QuantityModal';
import {useFocusEffect} from '@react-navigation/native';
import stripe from 'tipsi-stripe';

const PaymentConfirmationScreen = ({navigation, route}) => {
  const {chatInfo, isFetching} = useSelector(selectChatData());

  const screenDetails = route?.params?.data;
  const orderObj = route?.params?.orderObj ?? null;
  const quantitySelected = route?.params?.quantitySelected ?? 1;
  const returnAddress = route?.params?.address ?? null;

  const dispatch = useDispatch();

  /* Selectors */
  const {shippingRate} = useSelector(selectSellData());
  const {order, paymentDefault, cardDetail} = useSelector(selectOrderData());

  const {
    information: userInfo,
    userProductDetail,
    paymentMethodDefault,
    addressListState,
  } = useSelector(selectUserData());
  const addressList = addressListState?.data?.find(
    item => item.default === true,
  );
  const {
    user: {paymentCardList},
  } = useSelector(userSelector);
  const {general} = useSelector(generalSelector);
  /* Actions */
  const actions = useActions({
    createOffer,
    getUserInfo,
    setPaymentDefault,
    getChatData,
    getShipRate,
    // getContent,
    getCardDetail,
    getOrders,
    offerAction,
    receiveConversations,
    getAddressList,
  });
  const prevShippingRate = usePrevious(shippingRate);
  const prevOrder = usePrevious(order);

  const [transactionType, settransactionType] = useState('MakeOffer');
  const [isBuyNowVisible, setIsBuyNowVisible] = useState(false);
  const [taxEstimate, setTaxEstimate] = useState({data: null});
  const [quantitySelectedState, setQuantitySelectedState] = useState(
    quantitySelected || 1,
  );
  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false);
  const [prModalVisible, setPrModalVisible] = useState(false);
  const [isOfferAction, setIsOfferAction] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    message: '',
    isVisible: false,
  });
  const [cardList, setCardList] = useState([]);
  const [address, setUserAddress] = useState(null);

  useEffect(() => {
    setUserAddress(addressList);
  }, [addressList]);

  const updateAddress = addr => {
    setUserAddress(addr);
    navigation.setOptions({
      address: addr,
    });
  };

  // if(orderObj)
  const locationParsed = getMapObjectFromGoogleObj(screenDetails.location);
  const {state, city, country, postalCode, formattedAddress} = locationParsed;
  // //  # PROTECTION MODAL # ////
  const prModalVisibleAction = value => setPrModalVisible(value);

  const pickupDlryMethod = screenDetails.DeliveryMethods.find(
    item => item.code === 'pickup',
  );

  const hShippingDlryMethod = screenDetails.DeliveryMethods.find(
    item => item.code === 'homitagshipping',
  );

  const sIndependentlyDlryMethod = screenDetails.DeliveryMethods.find(
    item => item.code === 'shipindependently',
  );

  const selectedOption =
    hShippingDlryMethod?.DeliveryMethodPerPost?.customProperties?.optionsAvailable?.find(
      item => item.selected === true,
    );

  const selectedCarrier = selectedOption?.providers?.find(
    item => item.selected === true,
  );

  const carrier = selectedCarrier && selectedCarrier?.provider?.toLowerCase();

  const estimateStartDays = 1;

  const estimateEndDays = 3;

  /**
   * @description Extract suppliers return address from screenDetails object
   * @return Object | Null
   */
  const _getSupplierReturnAddress = () => {
    let returnAddress = null;

    if (screenDetails && screenDetails?.DeliveryMethods) {
      const {DeliveryMethodPerPost} = screenDetails?.DeliveryMethods.find(
        item => item?.DeliveryMethodPerPost,
      );
      if (
        DeliveryMethodPerPost &&
        DeliveryMethodPerPost?.customProperties &&
        DeliveryMethodPerPost?.customProperties.returnAddresses
      ) {
        returnAddress =
          DeliveryMethodPerPost?.customProperties?.returnAddresses[0];
      }
    }
    return returnAddress;
  };

  useEffect(() => {
    if (!paymentCardList.isFetching) {
      setCardList(paymentCardList.data.data);
      return;
    }
    setCardList([]);
  }, [paymentCardList, addressListState?.data]);

  useEffect(() => {
    actions.getAddressList();
  }, []);

  /**
   * @description Verify if post is from suppliers origin
   * @return Boolean
   */
  const _isSupplier = useCallback(() => {
    if (screenDetails?.customProperties?.origin === 'suppliers') {
      return true;
    }
    return false;
  }, [screenDetails]);

  const getShippingRate = () => {
    const {customProperties} = screenDetails;
    let params = {};
    switch (carrier?.toLowerCase()) {
      case 'ups':
        params = {
          service: {
            Code: '003',
            Description: 'UPS Ground',
          },
          buyer: {
            Name: 'NA',
            AddressLine: address?.address_line_1,
            AddressCity: address?.city,
            AddressState: address?.state,
            AddressZIP: address?.zipcode,
            AddressCountry: 'US',
          },
          seller: {
            Name: 'NA',
            AddressLine: city,
            AddressCity: city,
            AddressState: state,
            AddressZIP: postalCode,
            AddressCountry: country,
          },
          package: {
            PackagingCode: '00',
            PackagingDescription: 'NA',
            Weight: customProperties?.weight?.toString() || '0',
            Length: customProperties?.length?.toString() || '0',
            Width: customProperties?.width?.toString() || '0',
            Height: customProperties?.height?.toString() || '0',
          },
        };
        break;
      case 'fedex':
        params = {
          buyer: {
            AddressLine: address?.address_line_1,
            AddressCity: address?.city,
            AddressState: address?.state,
            AddressZIP: address?.zipcode,
            AddressCountry: address?.country,
          },
          seller: {
            AddressLine: formattedAddress.split(',')[0],
            AddressCity: city,
            AddressState: state,
            AddressZIP: postalCode,
            AddressCountry: country,
          },
          package: {
            Weight: customProperties?.weight?.toString() || '0',
            Length: customProperties?.length?.toString() || '0',
            Width: customProperties?.width?.toString() || '0',
            Height: customProperties?.height?.toString() || '0',
          },
        };

        break;
      case 'usps':
        // zipOrigin: postalCode,
        // zipDestination: address.zipcode,
        // weight: customProperties?.weight || 0,
        // service: "Priority",
        // container: "VARIABLE",
        // length: customProperties?.length?.toString() || "0",
        // width: customProperties?.width?.toString() || "0",
        // height: customProperties?.height?.toString() || "0",

        params = {
          buyer: {
            AddressLine: address?.address_line_1,
            AddressCity: address?.city,
            AddressState: address?.state,
            AddressZIP: address?.zipcode,
            AddressCountry: address?.country,
          },
          seller: {
            AddressLine: formattedAddress.split(',')[0],
            AddressCity: city,
            AddressState: state,
            AddressZIP: postalCode,
            AddressCountry: country,
          },
          package: {
            Weight: customProperties?.weight?.toString() || '0',
            Length: customProperties?.length?.toString() || '0',
            Width: customProperties?.width?.toString() || '0',
            Height: customProperties?.height?.toString() || '0',
          },
        };
        break;
      default:
        break;
    }
    carrier && actions.getShipRate({params, provider: carrier});
  };

  const setShippingCostToAddress = shipCost => {
    setUserAddress({...address, shippingCost: shipCost});
  };

  const goToPaymentScreen = () => {
    actions.setPaymentDefault({...paymentDefault});
    navigation.navigate('PaymentScreen', {
      data: screenDetails,
      from: 'confirm',
      address,
      orderObj,
    });
  };

  const goToChatScreen = async fromOrderSuccess => {
    const sellerDetails = userProductDetail?.data;

    setIsBuyNowVisible(false);
    if (orderObj) {
      navigation.goBack();
      return;
    }
    if (fromOrderSuccess) {
      let chatItem = null;
      let navconversationId = null;
      chatInfo &&
        Object.keys(chatInfo).forEach(chat => {
          let chatdata = chatInfo[chat];
          let convOrderId = chatdata?.customInfo?.order?.orderId;
          let orderId = order?.id;
          if (convOrderId && orderId && orderId == convOrderId) {
            chatItem = chatInfo[chat];
            navconversationId = chat;
          }
        });
      if (chatItem && navconversationId) {
        navigation.navigate('ChatScreen', {
          item: chatItem,
          conversationId: navconversationId,
          action: 'ProductDetail',
        });
      }

      return;
    }
    const item = {
      id: null,
      message: '',
      sellerId: screenDetails?.userId,
      sellerFirstName: sellerDetails?.firstName,
      sellerLastName: sellerDetails?.lastName,
      urlImage: sellerDetails?.profilepictureurl,
      receiver: {
        firstName: sellerDetails?.firstName,
        lastName: sellerDetails?.lastName,
        pictureUrl: sellerDetails?.profilepictureurl,
        userId: sellerDetails?.id,
      },
      datetime: null,
      badgeCount: 0,
      post: {
        id: screenDetails?.id,
        title: screenDetails?.Product?.title,
        urlImage: screenDetails?.Product?.ProductImages[0]?.urlImage,
      },
      title: null,
    };

    if (sellerDetails?.firstName) {
      item.title = `${sellerDetails?.firstName} ${sellerDetails?.lastName}`;
    }

    const offerData = {
      offeredValue: screenDetails?.offerValue,
      requireMessage: true,
    };

    // actions.getChatData();
    navigation.navigate('ChatScreen', {
      item,
      screenDetails,
      offerData,
      action: 'ProductDetail',
    });
  };

  const onPressReceipt = () => {
    const {type, data, orderData} = {
      type: 'BUYER',
      data: screenDetails,
      orderData: {...order},
    };
    setIsBuyNowVisible(false);

    if (orderObj) {
      navigation.navigate('Receipt', {
        data,
        orderData,
        type,
        from: 'buynow',
        quantitySelected: quantitySelectedState,
      });
    } else {
      navigation.navigate('Receipt', {
        data,
        orderData,
        type,
        quantitySelected: quantitySelectedState,
      });
    }
  };

  const onTouchOutsideOfBuyerSucces = async () => {
    await setIsBuyNowVisible(false);
    if (orderObj) {
      navigation.goBack();
    } else {
      navigation.navigate('ExploreMain');
    }
  };

  const getShippingRateForSuppliers = () => {
    const returnAddress = _getSupplierReturnAddress();
    const {customProperties} = screenDetails;
    let params = {};

    if (returnAddress) {
      switch (carrier?.toLowerCase()) {
        case 'ups':
          params = {
            service: {
              Code: '003',
              Description: 'UPS Ground',
            },
            buyer: {
              Name: 'NA',
              AddressLine: address?.address_line_1,
              AddressCity: address?.city,
              AddressState: address?.state,
              AddressZIP: address?.zipcode,
              AddressCountry: 'US',
            },
            seller: {
              Name: 'NA',
              AddressLine: returnAddress.addressLine1,
              AddressCity: returnAddress.city,
              AddressState: returnAddress.state,
              AddressZIP: returnAddress.zipCode,
              AddressCountry: returnAddress.country,
            },
            package: {
              PackagingCode: '00',
              PackagingDescription: 'NA',
              Weight: customProperties?.weight?.toString() || '0',
              Length: customProperties?.length?.toString() || '0',
              Width: customProperties?.width?.toString() || '0',
              Height: customProperties?.height?.toString() || '0',
            },
          };
          break;
        case 'fedex':
          params = {
            buyer: {
              AddressLine: address?.address_line_1,
              AddressCity: address?.city,
              AddressState: address?.state,
              AddressZIP: address?.zipcode,
              AddressCountry: address?.country,
            },
            seller: {
              AddressLine: returnAddress.addressLine1,
              AddressCity: returnAddress.city,
              AddressState: returnAddress.state,
              AddressZIP: returnAddress.zipCode,
              AddressCountry: returnAddress.country,
            },
            package: {
              Weight: customProperties?.weight?.toString() || '0',
              Length: customProperties?.length?.toString() || '0',
              Width: customProperties?.width?.toString() || '0',
              Height: customProperties?.height?.toString() || '0',
            },
          };

          break;
        case 'usps':
          params = {
            buyer: {
              AddressLine: address?.address_line_1,
              AddressCity: address?.city,
              AddressState: address?.state,
              AddressZIP: address?.zipcode,
              AddressCountry: address?.country,
            },
            seller: {
              AddressLine: returnAddress.addressLine1,
              AddressCity: returnAddress.city,
              AddressState: returnAddress.state,
              AddressZIP: returnAddress.zipCode,
              AddressCountry: returnAddress.country,
            },
            package: {
              Weight: customProperties?.weight?.toString() || '0',
              Length: customProperties?.length?.toString() || '0',
              Width: customProperties?.width?.toString() || '0',
              Height: customProperties?.height?.toString() || '0',
            },
          };
          break;
        default:
          break;
      }
      carrier && actions.getShipRate({params, provider: carrier});
    }
  };

  const getShippingBuyerPrice = () => {
    if (address && hShippingDlryMethod) {
      if (
        hShippingDlryMethod?.DeliveryMethodPerPost?.customProperties?.freeOption
          ?.valueSelected === true
      ) {
        return 0;
      }
      return hShippingDlryMethod?.DeliveryMethodPerPost?.customProperties
        ?.optionsAvailable[0]?.providers[0]?.cost
        ? Number(
            hShippingDlryMethod?.DeliveryMethodPerPost?.customProperties
              ?.optionsAvailable[0]?.providers[0]?.cost,
          )
        : 0;
    }
    if (
      sIndependentlyDlryMethod?.DeliveryMethodPerPost?.customProperties
        ?.freeOption?.valueSelected === true
    ) {
      return 0;
    }
    if (
      sIndependentlyDlryMethod?.DeliveryMethodPerPost?.customProperties
        ?.shippingCost
    ) {
      return Number(
        sIndependentlyDlryMethod?.DeliveryMethodPerPost?.customProperties
          ?.shippingCost,
      );
    }

    return 0;
  };

  const getTotalPrice = () =>
    Number(screenDetails.offerValue) * quantitySelectedState +
    getShippingBuyerPrice() * quantitySelectedState;

  /**
   * @description Check if post origin is from suppliers
   * @return Boolean
   */
  const isPostFromSupplier = () => {
    if (
      screenDetails?.customProperties &&
      screenDetails?.customProperties?.origin === 'suppliers'
    ) {
      return true;
    }
    return false;
  };

  /**
   * @description Toggle quantity modal display
   * @return Void
   */
  const toggleQuantityModal = () =>
    setIsQuantityModalVisible(!isQuantityModalVisible);

  /**
   * @description Increment the quantity selected
   * @return Void
   */
  const handleQuantityIncrement = () => {
    setQuantitySelectedState(quantitySelectedState + 1);
    getTaxEstimationPrice(quantitySelectedState + 1);
  };

  /**
   * @description Decrement the quantity selected
   * @return Void
   */
  const handleQuantityDecrement = () => {
    setQuantitySelectedState(quantitySelectedState - 1);
    getTaxEstimationPrice(quantitySelectedState - 1);
  };

  const handleItemRemove = () => {
    Promise.resolve()
      .then(() => {
        setIsQuantityModalVisible(false);
      })
      .then(() => navigation.navigate('ExploreMain'));
  };

  /**
   * @description Render component if the flow comes from the MakeOffer screen
   * @returns ReactNode
   */
  const renderBottomText = () => {
    if (!screenDetails?.buyNowAction) {
      return (
        <View style={styles.bottomContainer}>
          <Heading
            type="inactive"
            style={{
              fontSize: 13,
              textAlign: 'center',
              marginBottom: 20,
              color: '#969696',
            }}>
            You'll be charged once the seller accepts this offer.
          </Heading>
        </View>
      );
    }
  };

  useEffect(() => {
    if (!order.isFetching && order.id) {
      if (transactionType === 'BuyNow') {
        setIsBuyNowVisible(true);
      } else {
        setIsBuyNowVisible(false);
      }
    }
  }, [order.id, order.isFetching, transactionType]);

  useFocusEffect(
    useCallback(() => {
      const handleBackButton = () => {
        setIsQuantityModalVisible(false);
        navigation.goBack();
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
    if (!order.isFetching && order.id) {
      if (transactionType === 'BuyNow') {
        const dataToSend = {};
        dataToSend.postId = screenDetails.id;
        dataToSend.sellerId = screenDetails.userId;
        dataToSend.sort = 'createdAt-desc';
        dataToSend.page = 1;
        dataToSend.perPage = 5;
        dataToSend.buyerId = userInfo.id;
        actions.getOrders(dataToSend);
        return;
      }

      if (orderObj) {
        const payload = {
          orderId: orderObj?.id,
          action: 'accept',
          user: {
            id: userInfo.id,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
          },
        };
        setIsOfferAction(true);
        dispatch(offerAction(payload));
      }

      if (transactionType === 'MakeOffer' && order.orderStatus != 'created') {
        goToChatScreen();
      }
    }
  }, [order.id]);

  const makeOffer = () => {
    let paymentMethodForPayment = paymentDefault?.default
      ? paymentDefault
      : paymentMethodDefault;
    let type = '';
    if (paymentMethodForPayment?.selectedCard?.id) {
      type = 'creditcard';
    } else {
      type = Platform.OS == 'android' ? 'googlepay' : 'applepay';
    }
    let deliveryType = 'pickup';
    if (address && hShippingDlryMethod) {
      deliveryType = 'homitagshipping';
    } else if (address && sIndependentlyDlryMethod) {
      deliveryType = 'shipindependently';
    } else {
      deliveryType = 'pickup';
    }
    if (deliveryType !== 'pickup' && screenDetails.isNegotiable === false) {
      settransactionType('BuyNow');
    }

    if (deliveryType !== 'pickup' && screenDetails.buyNowAction === true) {
      settransactionType('BuyNow');
    }

    if (deliveryType !== 'pickup' && orderObj) {
      settransactionType('BuyNow');
    }

    const offerData = {};
    offerData.params = {};
    offerData.params.quantity = quantitySelectedState;

    if (orderObj) {
      offerData.params.deliveryMethod = {};
      offerData.params.paymentMethod = {};
      offerData.params.paymentMethod.type = type;
      if (paymentMethodForPayment.icon === 'credit-card') {
        offerData.params.paymentMethod.stripeToken =
          paymentMethodForPayment.selectedCard.id;
      }
      offerData.params.deliveryMethod.type = deliveryType;
      offerData.params.deliveryMethod.buyerName =
        address && address.name ? address.name : 'NA';
      offerData.params.deliveryMethod.addressline1 =
        address && address.address_line_1 ? address.address_line_1 : 'NA';
      offerData.params.deliveryMethod.addressline2 =
        address && address.address_line_2 && address?.address_line_2 !== '-'
          ? address.address_line_2
          : '';
      offerData.params.deliveryMethod.city =
        address && address.city ? address.city : 'NA';
      offerData.params.deliveryMethod.state =
        address && address.state ? address.state : 'NA';
      offerData.params.deliveryMethod.zipcode =
        address && address.zipcode ? address.zipcode : 'NA';
      offerData.params.deliveryMethod.country =
        address && address.country ? address.country : 'NA';
      if (carrier) {
        offerData.params.deliveryMethod.carrier = carrier;
      }
      if (address) {
        offerData.params.shipBy = moment().add(1, 'days');
        offerData.params.deliverBy = moment().add(estimateEndDays, 'days');
      }
      offerData.params.labelId = orderObj?.labels?.[0]?.id;
      offerData.method = 'PATCH';
      offerData.orderId = orderObj?.id;
      setIsOfferAction(false);
      dispatch(
        createOffer({
          ...offerData,
          isNegotiable: screenDetails.isNegotiable,
        }),
      );

      return;
    }

    offerData.params = {};
    offerData.params.quantity = quantitySelectedState;
    offerData.params.postId = screenDetails.id;
    offerData.params.price = screenDetails.offerValue;
    offerData.params.buyNowAction = screenDetails.buyNowAction;

    offerData.params.title = screenDetails?.Product?.title;
    offerData.params.unit_price = screenDetails.offerValue;

    offerData.params.buyerId = userInfo.id;
    offerData.params.isNegotiable = screenDetails.isNegotiable || false;
    offerData.params.shippingValue =
      returnAddress?.shippingCost?.value ?? '0.00';
    offerData.params.deliveryMethodSelected = {};
    offerData.params.deliveryMethodSelected.type = deliveryType;

    offerData.params.deliveryMethodSelected.buyerName =
      address && address.name ? address.name : 'NA';
    offerData.params.deliveryMethodSelected.addressline1 =
      address && address.address_line_1 ? address.address_line_1 : 'NA';
    offerData.params.deliveryMethodSelected.addressline2 =
      address && address.address_line_2 && address?.address_line_2 !== '-'
        ? address.address_line_2
        : '';
    offerData.params.deliveryMethodSelected.city =
      address && address.city ? address.city : 'NA';
    offerData.params.deliveryMethodSelected.state =
      address && address.state ? address.state : 'NA';
    offerData.params.deliveryMethodSelected.zipcode =
      address && address.zipcode ? address.zipcode : 'NA';
    offerData.params.deliveryMethodSelected.country =
      address && address.country ? address.country : 'NA';
    if (carrier) {
      offerData.params.deliveryMethodSelected.carrier = carrier;
    }
    if (address) {
      if (hShippingDlryMethod) {
        if (
          hShippingDlryMethod?.DeliveryMethodPerPost?.customProperties
            ?.freeOption?.valueSelected
        ) {
          offerData.params.deliveryMethodSelected.freeOption =
            hShippingDlryMethod?.DeliveryMethodPerPost?.customProperties?.freeOption?.valueSelected;
        }
      } else if (sIndependentlyDlryMethod) {
        if (
          sIndependentlyDlryMethod?.DeliveryMethodPerPost?.customProperties
            ?.freeOption?.valueSelected
        ) {
          offerData.params.deliveryMethodSelected.freeOption =
            sIndependentlyDlryMethod?.DeliveryMethodPerPost?.customProperties?.freeOption?.valueSelected;
        }
      }
      offerData.params.shipBy = moment().add(1, 'days');
      offerData.params.deliverBy = moment().add(estimateEndDays, 'days');
    }
    offerData.params.paymentMethodSelected = {};
    if (paymentMethodForPayment.icon === 'credit-card') {
      offerData.params.paymentMethodSelected.stripeToken =
        paymentMethodForPayment.selectedCard.id;
    }
    offerData.params.paymentMethodSelected.type = type;
    offerData.params.paymentMethodSelected = {
      ...offerData.params.paymentMethodSelected,
      ...paymentMethodDefault.selectedCard,
    };
    offerData.paymentMethod = {
      ...paymentMethodDefault.selectedCard,
      paymentType: type,
    };
    setIsOfferAction(false);
    dispatch(
      createOffer({
        ...offerData,
        isNegotiable: screenDetails.isNegotiable,
      }),
    );
  };

  useEffect(() => {
    if (cardDetail.data) {
      dispatch(
        setPaymentDefault({
          ...paymentDefault,
          selectedCard: cardDetail.data,
          state: cardDetail.data.id,
          default: 'card',
          icon: 'credit-card',
          title: `${cardDetail.data.brand.toUpperCase()} ${
            cardDetail.data.last4
          }`,
        }),
      );
    }
  }, [cardDetail.data]);

  useEffect(() => {
    if (shippingRate.data && prevShippingRate && !prevShippingRate.data) {
      switch (carrier?.toLowerCase()) {
        case 'ups':
          const upsRate = _.get(shippingRate.data, 'rate', null);
          setShippingCostToAddress({
            text: upsRate ? `$ ${parseFloat(upsRate).toFixed(2)}` : 'NA',
            value: upsRate ? `${parseFloat(upsRate).toFixed(2)}` : '0.00',
          });
          break;
        case 'fedex':
          const fedexRate = _.get(shippingRate.data, 'rate', null);
          setShippingCostToAddress({
            text: fedexRate ? `$ ${parseFloat(fedexRate).toFixed(2)}` : 'NA',
            value: fedexRate ? `${parseFloat(fedexRate).toFixed(2)}` : '0.00',
          });
          break;
        case 'usps':
          const uspsRate = _.get(shippingRate.data, 'rate', null);
          setShippingCostToAddress({
            text: uspsRate ? `$ ${parseFloat(uspsRate).toFixed(2)}` : 'NA',
            value: uspsRate ? `${parseFloat(uspsRate).toFixed(2)}` : '0.00',
          });
          break;
        default:
          break;
      }
    } else if (sIndependentlyDlryMethod) {
      const customProperties =
        sIndependentlyDlryMethod?.DeliveryMethodPerPost?.customProperties;
      if (customProperties?.freeOption?.valueSelected) {
        setShippingCostToAddress({text: 'Free', value: '0.00'});
      } else {
        setShippingCostToAddress({
          text: `$ ${parseFloat(customProperties.shippingCost).toFixed(2)}`,
          value: customProperties.shippingCost,
        });
      }
    } else if (
      shippingRate.failure &&
      prevShippingRate &&
      !prevShippingRate.failure
    ) {
      setToastMessage({
        message: shippingRate.failure,
        isVisible: true,
      });
      setShippingCostToAddress({text: 'NA', value: '0.00'});
    }
  }, [shippingRate]);

  const deviceHasNativePaySupport = () => {
    if (stripe.deviceSupportsNativePay()) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const defaultCard = cardList?.map(item => {
      if (item?.metadata?.isDefault == 'true') {
        return item;
      } else {
        return undefined;
      }
    });
    const returnDefaultCard = defaultCard?.filter(item => item != undefined);
    if (returnDefaultCard && returnDefaultCard?.length > 0) {
      actions.setPaymentDefault({
        ...returnDefaultCard,
        state: returnDefaultCard[0].id,
        selectedCard: returnDefaultCard[0],
        default: 'card',
        title: `**** ${returnDefaultCard[0].last4}`,
        icon: returnDefaultCard[0]?.brand.toLowerCase()
          ? returnDefaultCard[0]?.brand.toLowerCase()
          : 'credit-card',
      });
      return;
    } else {
      const paymentMethod =
        Platform.OS === 'android' ? 'Google pay' : 'Apple pay';
      actions.setPaymentDefault({
        ...paymentDefault,
        state: paymentMethod === 'Google pay' ? 'googlePay' : 'applePay',
        selectedCard: {id: null},
        title: paymentMethod === 'Google pay' ? 'Google pay' : 'Apple pay',
        icon: paymentMethod === 'Google pay' ? 'google_pay' : 'apple_pay',
      });
      return;
    }
  }, [cardList]);

  useEffect(() => {
    if (address && sIndependentlyDlryMethod && orderObj) {
      const customProperties =
        sIndependentlyDlryMethod?.DeliveryMethodPerPost?.customProperties;
      if (customProperties?.freeOption?.valueSelected) {
        setShippingCostToAddress({text: 'Free', value: '0.00'});
      } else {
        setShippingCostToAddress({
          text: `$ ${parseFloat(customProperties.shippingCost).toFixed(2)}`,
          value: customProperties.shippingCost,
        });
      }
    }
    if (address) {
      // dispatch(
      //   getContent({ params: `?type=rr_public_policy`, type: "terms" })
      // );
    }
    if (orderObj) {
      if (orderObj.paymentMethod.type === 'creditcard') {
        actions.getCardDetail({
          cardId: orderObj.paymentMethod.stripeToken,
          userId: orderObj.buyerId,
        });
        return;
      }
      actions.setPaymentDefault({
        ...paymentDefault,
        default:
          orderObj.paymentMethod.type === 'applepay' ? 'applePay' : 'googlePay',
        state:
          orderObj.paymentMethod.type === 'applepay' ? 'googlePay' : 'applePay',
        selectedCard: {id: null},
        title:
          orderObj.paymentMethod.type === 'applepay'
            ? 'Apple pay'
            : 'Google pay',
        icon:
          orderObj.paymentMethod.type === 'applepay'
            ? 'apple_pay'
            : 'google_pay',
      });
    }

    const clearOrderData = () => {
      dispatch(clearOrders());
      dispatch(clearOrder());
    };

    const willBlurSubscription = navigation.addListener('blur', clearOrderData);

    return () => {
      willBlurSubscription();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const getShippingRateCallback = () => {
        if (hShippingDlryMethod) {
          if (_isSupplier()) {
            getShippingRateForSuppliers();
            return;
          }
          getShippingRate();
        }
      };

      getShippingRateCallback();
    }, []),
  );

  useEffect(() => {
    if (_isSupplier()) {
      getShippingRateForSuppliers();
      return;
    }
    getShippingRate();
  }, []);

  useEffect(() => {
    dispatch(getContent({params: `?type=buyer_protection`, type: 'terms'}));
  }, []);

  useEffect(() => {
    if (order.errorMsg && prevOrder && !prevOrder.errorMsg) {
      setToastMessage({
        message:
          order.errorMsg === 'Duplicated Order'
            ? "You've already made the offer."
            : order.errorMsg,
        isVisible: true,
      });
    }
  }, [order.errorMsg, prevOrder]);

  const taxValueByQuantity = () => {
    return taxEstimate.data.taxAmount;
  };

  const value = getShippingBuyerPrice();

  const getTaxEstimationPrice = async quantity => {
    const params = {
      country: '',
      state: '',
    };

    if (address && address?.country && address?.state) {
      try {
        params.country = address.country.toUpperCase();
        params.state = address.state.toUpperCase();
        params.quantity =
          quantity == undefined ? quantitySelectedState : quantity;
        params.shippingCost = value;

        const res = await getTaxEstimation(screenDetails.id, params);

        setTaxEstimate({...res});
      } catch (e) {
        console.info('_getTaxEstimationPrice ====> ERROR', e);
      }
      return;
    }

    if (
      address &&
      address?.country &&
      address?.state &&
      sIndependentlyDlryMethod?.DeliveryMethodPerPost?.customProperties
        ?.freeOption?.valueSelected === true
    ) {
      try {
        params.country = address.country;
        params.state = address.state;
        params.quantity =
          quantity == undefined ? quantitySelectedState : quantity;
        params.shippingCost = value;
        const res = await getTaxEstimation(screenDetails.id, params);
        setTaxEstimate({...res});
      } catch (e) {
        console.info('_getTaxEstimationPrice ====> ERROR', e);
      }
    }
  };
  useEffect(() => {
    /**
     * @description Make call to API to get tax estimation
     * @return Void
     */
    getTaxEstimationPrice();
  }, [address]);

  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, {flex: 1}]}>
        <Toast
          onAnimationEnd={() => {
            setToastMessage({
              message: '',
              isVisible: false,
            });
          }}
          autoHideMs={3000}
          message={toastMessage.message}
          isVisible={toastMessage.isVisible}
          linkLabel="Back to Explore"
          linkOnPress={() => navigation.navigate('ExploreMain')}
        />
        <ScrollView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <>
              <View style={{marginHorizontal: 15}}>
                {screenDetails.id && (
                  <ProductDetail
                    screenDetails={screenDetails}
                    userProductDetail={userProductDetail}
                  />
                )}
                <View style={{marginBottom: 30}}>
                  {address && (
                    <AddressElement
                      txtType="bold"
                      title={`${address.address_line_1} ${address.address_line_2} \n${address.city}, ${address.state} ${address.zipcode}`}
                      leftLabel="Ship to"
                      leftLabelTop={address.name}
                      addressListState={addressListState}
                      onPress={() =>
                        navigation.push('ShippingInfo', {
                          from: 'confirmation',
                          data: screenDetails,
                          setAddress: addr => {
                            updateAddress(addr);
                          },
                        })
                      }
                    />
                  )}

                  <PaymentMethodElement
                    icon={
                      paymentMethodDefault.icon
                        ? paymentMethodDefault.icon == 'credit-card'
                          ? paymentMethodDefault?.selectedCard?.brand.toLowerCase()
                          : paymentMethodDefault.icon
                        : paymentDefault.icon
                    }
                    title={
                      paymentMethodDefault.title
                        ? paymentMethodDefault.title
                        : paymentDefault.title
                    }
                    txtType="bold"
                    leftLabel="Payment Method"
                    onPress={goToPaymentScreen}
                  />
                  {isPostFromSupplier() && (
                    <ItemElement
                      leftLabel="Quantity"
                      rightLabel={
                        <QuantityElement
                          quantitySelected={quantitySelectedState}
                        />
                      }
                      rightContainer={TouchableOpacity}
                      rightContainerStyle={{
                        borderWidth: StyleSheet.hairlineWidth,
                        borderRadius: 6,
                        paddingVertical: 6,
                        paddingHorizontal: 16,
                      }}
                      rightContainerOnPress={toggleQuantityModal}
                    />
                  )}
                  {!address && pickupDlryMethod && (
                    <ItemElement leftLabel="Pick up in person" txtType="bold" />
                  )}
                  <ItemElement
                    leftLabel="Item Price"
                    rightLabel={`$ ${parseFloat(
                      screenDetails.buyNowAction
                        ? screenDetails.initialPrice * quantitySelectedState
                        : screenDetails.offerValue,
                    ).toFixed(2)}`}
                  />

                  {address && (
                    <ItemElement
                      leftLabel="Shipping"
                      rightLabel={
                        isNaN(getTotalPrice()) || shippingRate.isFetching
                          ? 'Loading...'
                          : getShippingBuyerPrice() > 0
                          ? `$ ${(
                              getShippingBuyerPrice() * quantitySelectedState
                            ).toFixed(2)}`
                          : 'Free'
                      }
                    />
                  )}
                  {
                    <ItemElement
                      leftLabel="Sales Tax"
                      rightLabel={
                        taxEstimate.data && taxEstimate?.data?.taxAmount
                          ? `$ ${taxValueByQuantity().toFixed(2)}`
                          : `$ 0.00`
                      }
                    />
                  }
                  {taxEstimate.data && taxEstimate?.data?.taxAmount ? (
                    <ItemElement
                      leftLabel="Total to pay"
                      rightLabel={
                        isNaN(getTotalPrice())
                          ? 'Loading...'
                          : `$ ${(
                              getTotalPrice() + taxValueByQuantity()
                            ).toFixed(2)}`
                      }
                      txtType="bold"
                      containerStyle={
                        isPostFromSupplier() ? {paddingTop: 6} : null
                      }
                    />
                  ) : (
                    <ItemElement
                      leftLabel="Total to pay"
                      rightLabel={
                        isNaN(getTotalPrice()) || !taxEstimate.data && !taxEstimate?.data?.taxAmount
                          ? '...'
                          : `$ ${getTotalPrice().toFixed(2)}`
                      }
                      txtType="bold"
                      containerStyle={
                        isPostFromSupplier() ? {paddingTop: 6} : null
                      }
                    />
                  )}
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: '#E8E8E8',
                      marginTop: 20,
                    }}
                  />
                </View>
              </View>
            </>
          </TouchableWithoutFeedback>

          {renderBottomText()}
        </ScrollView>
        {address && (
          <ProtectionElement prModalVisibleAction={prModalVisibleAction} />
        )}
        <Text
          style={{alignSelf: 'center', color: '#969696', paddingVertical: 10}}>
          You’ll be charged once the seller confirms shipment
        </Text>
      </SafeAreaView>
      <FooterAction
        mainButtonProperties={{
          label: 'Place Order',
          disabled:
            shippingRate.isFetching ||
            isNaN(getTotalPrice()) ||
            order.isFetching,
          onPress: () => {
            makeOffer();
          },
        }}
      />
      <SafeAreaView style={safeAreaNotchHelper} />
      {(order.isFetching ||
        shippingRate.isFetching ||
        addressListState?.isFetching ||
        isNaN(getTotalPrice())) && <ScreenLoader />}
      {address && (
        <ProtectionModal
          isVisible={prModalVisible}
          onTouchOutside={prModalVisibleAction}
          contents={general.contentState.data}
        />
      )}

      <QuantityModal
        availableQuantity={screenDetails?.availableQuantity}
        isVisible={isQuantityModalVisible}
        quantitySelected={quantitySelectedState}
        onPress={toggleQuantityModal}
        handleIncrement={handleQuantityIncrement}
        handleDecrement={handleQuantityDecrement}
        handleRemove={handleItemRemove}
      />

      <BuyNowSuccessAlert
        dialogVisible={
          isBuyNowVisible && route.name === 'PaymentConfirmationScreen'
        }
        onDone={onTouchOutsideOfBuyerSucces}
        onCTAClick={onPressReceipt}
        goTo={() => goToChatScreen(true)}
        orderData={order}
        module={'paymentconfirmation'}
      />
    </>
  );
};

export default PaymentConfirmationScreen;
