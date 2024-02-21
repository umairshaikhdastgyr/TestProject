import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions,
  Modal,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import ActionSheet from "react-native-actionsheet";
import DocumentPicker from "react-native-document-picker";
import { useFocusEffect } from "@react-navigation/native";
import usePrevious from "#utils/usePrevious";
import ConfirmAlert from "../ReturnDeclineScreen/confirmAlert";

import ImageResizer from "@bam.tech/react-native-image-resizer";
import RNFS from "react-native-fs";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  safeAreaViewWhite,
  safeAreaNotchHelper,
  style,
} from "#styles/utilities";
import ProductDetail from "../ReturnRequestScreen/product-detail";
import {
  setReturnAddress,
  getCheapestRate,
  setReturnLabel,
  returnOrderUpdate as returnOrderUpdateApi,
  getOrderById,
} from "#modules/Orders/actions";
import { useActions } from "#utils";
import { selectOrderData } from "#modules/Orders/selectors";
import ScreenLoader from "#components/Loader/ScreenLoader";
import {
  getAddressList,
  postBuyerDetail as postBuyerDetailApi,
} from "#modules/User/actions";
import { Colors, Fonts } from "#themes";
import { FooterAction } from "#components";
import DeliveryItem from "./DeliveryItem";
import { getPostDetail } from "#modules/Posts/actions";
import { selectPostsData } from "#modules/Posts/selectors";
import {
  updatePostStatus as updatePostStatusAction,
  setPhotoList,
} from "#modules/Sell/actions";
import { selectSellData } from "#modules/Sell/selectors";
import fonts from "#themes/fonts";
import { selectUserData, userSelector } from "#modules/User/selectors";

const DELIVERY_TYPES = ["homitagshipping", "shipindependently"];

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 35;
const styles = StyleSheet.create({
  transaction_label: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#313334",
    lineHeight: 18,
  },
  transaction_id: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#313334",
    lineHeight: 18,
    fontWeight: "600",
  },
  horizontal_line: {
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    width: width - 40,
    marginVertical: 20,
  },
  detail_text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#313334",
    lineHeight: 18,
    marginHorizontal: 20,
    textAlign: "center",
  },
  text_head: {
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
    color: "#313334",
    lineHeight: 18,
    marginHorizontal: 20,
    fontWeight: "600",
    // textAlign: 'center',
  },
  text_head_container: {
    width,
    marginVertical: 32,
  },
  activeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.active,
    backgroundColor: Colors.active,
    marginRight: 12,
  },
  reason_conatiner: {
    flexDirection: "row",
    width: width - 40,
  },
  reason_detail_conatiner: {
    flexDirection: "row",
    width: width - 40,
    marginTop: 12,
    backgroundColor: "#EDEDED",
    padding: 10,
  },
  reason_container_text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
    fontWeight: "600",
    color: "#313334",
    lineHeight: 18,
  },
  reason_detail_text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#767676",
  },
  contentItemConainer: {
    width: CARD_WIDTH,
    // borderWidth: 2,
    // borderColor: '#00BDAA',
    height: 236,
    borderRadius: 8,
    flexDirection: "column",
    margin: 7.5,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { height: 0, width: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  contentItemHeader: {
    paddingVertical: 12,
    backgroundColor: "#00BDAA",
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  itemHeaderText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#FFF",
    textAlign: "center",
    fontWeight: "600",
  },
  contentIconContainer: {
    paddingVertical: 15,
    alignItems: "center",
  },
  iconStyle: {
    width: 24,
    height: 28.06,
  },
  itemDetailContainer: {
    paddingHorizontal: 10,
  },
  itemDetailText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#969696",
    fontWeight: "500",
    lineHeight: 18,
    textAlign: "center",
  },
  buttonContainer: {
    marginHorizontal: 20,
    flex: 1,
    marginTop: 10,
  },
  order_detail_link: {
    lineHeight: 18,
    textDecorationLine: "underline",
    color: "#000000",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 12,
  },
});

const DELIVERY_METHODS = [
  {
    id: 1,
    name: "Prepaid shipping labels",
    description: "Easiest way to ship your item",
    isSelected: false,
    code: "homitagshipping",
  },
  {
    id: 2,
    name: "Supply Own Labels",
    description: "Upload your own label to share with the buyer",
    isSelected: false,
    code: "shipindependently",
  },
];

const ACTION_BUTTONS = ["Upload an Image", "Upload a File", "Cancel"];

const counter = { value: 0 };

const ReturnAcceptScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const sellerName = route?.params?.sellerName ?? null;
  const post = route?.params?.post ?? null;
  const chatItem = route?.params?.chatItem ?? null;
  const orderData = route?.params?.orderData ?? null;
  const returnId = route?.params?.returnId ?? null;

  const { returnRequest, orderDetail, returnLabel, returnOrderUpdate } =
    useSelector(selectOrderData());
  const { addressListState } = useSelector(selectUserData());

  const { postDetail, isFetchingPostDetail } = useSelector(selectPostsData());
  const { user } = useSelector(userSelector);
  const [isReturnUpdate, setIsReturnUpdate] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const prevReturnOrderUpdate = usePrevious(returnOrderUpdate);

  const actions = useActions({
    getPostDetail,
    setReturnAddress,
    updatePostStatusAction,
    getCheapestRate,
    setReturnLabel,
    postBuyerDetailApi,
    returnOrderUpdateApi,
    setPhotoList,
    getOrderById,
  });
  const handleCloseActionLocal = () => {
    // navigation.navigate('OrderStatus');
    navigation.goBack();
  };

  const { photosList } = useSelector(selectSellData());
  // const selectedOption = homitagShipping?.DeliveryMethodPerPost?.customProperties?.optionsAvailable?.find((item) => item.selected === true);
  useEffect(() => {
    setDeliverMethod([
      {
        id: 1,
        name: "Prepaid shipping labels",
        description: "Easiest way to ship your item",
        isSelected: false,
        code: "homitagshipping",
      },
      {
        id: 2,
        name: "Supply Own Labels",
        description: "Upload your own label to share with the buyer",
        isSelected: false,
        code: "shipindependently",
      },
    ]);
    setReturnAddress([]);
    actions.getPostDetail({
      postId: returnRequest?.data?.Order?.postId,
    });
    actions.setReturnLabel({
      deliveryType: "",
      trackingNumber: "",
      shippingCost: "",
      providerName: "",
      homitagReturnAddress: null,
      instruction: "",
      selectedCarrierItem: "",
    });
    actions.postBuyerDetailApi({
      userId: returnRequest?.data?.Order?.buyerId,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ handleCloseAction: handleCloseActionLocal });
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (
        isReturnUpdate &&
        returnOrderUpdate.data &&
        prevReturnOrderUpdate &&
        !prevReturnOrderUpdate.data
      ) {
        setIsReturnUpdate(false);
        setShowAlert(true);
        actions.setReturnLabel({
          deliveryType: "",
          trackingNumber: "",
          shippingCost: "",
          providerName: "",
          homitagReturnAddress: null,
          instruction: "",
          selectedCarrierItem: "",
        });
      }
      if (
        isReturnUpdate &&
        returnOrderUpdate.errorMsg &&
        prevReturnOrderUpdate &&
        !prevReturnOrderUpdate.errorMsg
      ) {
        setIsReturnUpdate(false);
        // setAlertContent({
        //   title: 'Oops...',
        //   message: returnOrderUpdate.errorMsg,
        //   type: 'error',
        //   visible: true,
        // });
      }
    }, [returnOrderUpdate])
  );

  useEffect(() => {
    const deliveryTypes = ["homitagshipping", "shipindependently"];
    const homitagShipping = postDetail?.DeliveryMethods?.find((item) =>
      deliveryTypes.includes(item.code)
    );
    const returnAddList = homitagShipping?.DeliveryMethodPerPost
      ?.customProperties?.returnAddresses
      ? homitagShipping?.DeliveryMethodPerPost?.customProperties
          ?.returnAddresses
      : [];

    actions.setReturnAddress(returnAddList || []);
    const selRetAdd = returnAddList?.find(
      (item) => item.defaultAddress === true
    );
    actions.setReturnLabel({
      ...returnLabel,
      homitagReturnAddress: selRetAdd || null,
    });
    //  setSelectedReturnAddress(selRetAdd || {});
  }, [postDetail]);

  const onActionSheetMore = () => {
    navigation.navigate("OrderReceipt", {
      data: post,
      orderData: orderData,
      type: "SELLER",
    });
  };

  const goToOrderDetailScreen = () => {
    navigation.navigate("ViewOrderDetails", {
      type: "SELLER",
      orderData: orderData,
      onViewReceipt: () => onActionSheetMore(),
    });
  };

  const goToOrderStatusScreen = () => {
    const { orderId } = returnRequest?.data;
    actions.getOrderById({ orderId });
    setShowAlert(false);
    navigation.navigate("OrderStatus", {
      orderData: returnRequest?.data?.Order,
      type: "SELLER",
      chatItem,
      orderId: returnRequest?.data?.Order.id,
    });
  };

  const pickFIle = async () => {
    try {
      let resizeImage = null;
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      if (Platform.OS === "ios") {
        resizeImage = await ImageResizer.createResizedImage(
          res.uri,
          720,
          1280,
          "JPEG",
          60
        );
      } else if (Platform.OS === "android") {
        resizeImage = { uri: res.uri };
      }
      const photoBase64 = await RNFS.readFile(resizeImage.uri, "base64");
      actions.setPhotoList([
        {
          type: "taken-photo",
          image: photoBase64,
          uri: resizeImage.uri,
          ext: "jpeg",
        },
      ]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const [deliverMethods, setDeliverMethod] = useState(DELIVERY_METHODS);
  const [showAlert, setShowAlert] = useState(false);

  const updatePost = () => {
    const addressObj = addressListState?.data?.map((item) => {
      const itemObj = { ...item };
      // delete itemObj.defaultAddress;
      return itemObj;
    });
    postDetail.deliveryMethods = postDetail.DeliveryMethods;
    for (let i = 0; i < postDetail.deliveryMethods.length; i++) {
      postDetail.deliveryMethods[i].deliveryCustomProperties = {};
      postDetail.deliveryMethods[i].deliveryCustomProperties =
        postDetail.deliveryMethods[i].DeliveryMethodPerPost.customProperties;
      if (DELIVERY_TYPES.includes(postDetail.deliveryMethods[i].code)) {
        postDetail.deliveryMethods[i].deliveryCustomProperties.returnAddresses =
          addressObj;
      }
    }
    actions.updatePostStatusAction({
      params: { deliveryMethods: postDetail.deliveryMethods },
      postId: postDetail.id,
    });
  };

  const [selectedItem, setSelectedItem] = useState(null);

  useFocusEffect(
    useCallback(() => {
      onSetDefaultAddress();
    }, [dispatch, addressListState])
  );

  const onSetDefaultAddress = useCallback(() => {
    let userAddress = {};
    if (
      addressListState?.data == undefined ||
      addressListState?.data?.length == 0
    ) {
      const splitUserAddress =
        user?.information?.location?.formatted_address?.split(",");
      if (splitUserAddress?.length > 0) {
        userAddress = {
          address_line_1: splitUserAddress[0] || "",
          address_line_2: "",
          city: splitUserAddress[1] || "",
          country: splitUserAddress[3] || "",
          defaultAddress: true,
          name: user?.information?.name || "",
          phoneNumber: user?.information?.phonenumber || "",
          state: splitUserAddress[2].split(" ")[1] || "",
          zipcode: splitUserAddress[2].split(" ")[2] || "",
        };
      }
    }
    const returnAddList =
      addressListState?.data && addressListState?.data?.length > 0
        ? addressListState?.data
        : [];
    if (returnAddList?.length == 0) {
      setSelectedItem({ ...userAddress, selectedIndex: 0 });
      actions.setReturnAddress([userAddress] || []);
    } else {
      const returnAddress = addressListState?.data?.find(
        (returnAddress) => returnAddress?.default
      );
      const returnAddressIndex = addressListState?.data?.findIndex(
        (returnAddress) => returnAddress?.default
      );
      setSelectedItem({ ...returnAddress, selectedIndex: returnAddressIndex });
      actions.setReturnAddress(returnAddList || []);
    }
    const selRetAdd =
      returnAddList?.length == 0
        ? [userAddress]?.find((item) => item.defaultAddress === true)
        : returnAddList?.find((item) => item.default === true);
    const findIndex =
      returnAddList?.length == 0
        ? [userAddress]?.map((item, index) => {
            if (item == selRetAdd) {
              return index;
            }
          })
        : returnAddList?.map((item, index) => {
            if (item == selRetAdd) {
              return index;
            }
          });
    const getIndex = findIndex?.filter((item) => item != undefined);
    const addressData = {
      ...selRetAdd,
      selectedIndex: getIndex[0],
    };
    setSelectedItem(addressData);
    const getSelectedLabel = deliverMethods.filter((item) => item?.isSelected);
    if (getSelectedLabel[0]?.code == "homitagshipping") {
      actions.setReturnLabel({
        ...returnLabel,
        code: getSelectedLabel[0]?.code,
        deliveryType: getSelectedLabel[0]?.code,
        homitagReturnAddress: selRetAdd || null,
      });
    }
    //  setSelectedReturnAddress(selRetAdd || {});
  }, [postDetail, addressListState]);

  const getCheapRate = () => {
    const address = returnRequest?.data?.Order?.deliveryMethod;
    const homitagShipping = postDetail?.DeliveryMethods?.find((item) =>
      DELIVERY_TYPES.includes(item.code)
    );
    const selectedOption =
      homitagShipping?.DeliveryMethodPerPost?.customProperties?.optionsAvailable?.find(
        (item) => item.selected === true
      );
    const weight = selectedOption?.weightRange?.split(" ")[2];
    const { homitagReturnAddress } = returnLabel;
    const params = {
      // const
      buyer: {
        AddressLine: address?.addressline1,
        AddressCity: address?.city,
        AddressState: address?.state,
        AddressZIP: address?.zipcode,
        AddressCountry: "US",
      },
      seller: {
        AddressLine: homitagReturnAddress?.addressLine1,
        AddressCity: homitagReturnAddress?.city,
        AddressState: homitagReturnAddress?.state,
        AddressZIP: homitagReturnAddress?.zipCode,
        AddressCountry: "US",
      },
      package: {
        Weight: weight || "1",
        Length: "0",
        Width: "0",
        Height: "0",
      },
    };

    actions.getCheapestRate({ params });
  };
  // create our ref
  let actionSheet;
  const onPressActionSheet = (index) => {
    switch (index) {
      case 0:
        setShowMoreMenu(false);
        navigation.navigate("SellPhotos", { screen: "return" });
        break;
      case 1:
        setShowMoreMenu(false);
        pickFIle();
        break;
      default:
        setShowMoreMenu(false);
        break;
    }
  };

  const goToNextScreen = () => {
    if (returnLabel.deliveryType === "homitagshipping") {
      getCheapRate();
      updatePost();
      navigation.navigate("ReturnConfirmation", {
        post,
        chatItem,
        sellerName,
        orderData,
      });
      return;
    }
    onSendSellerRequest();
  };

  const onSetLabel = () => {
    setShowMoreMenu(true);
  };

  const onSendSellerRequest = () => {
    //   const returnLabelImage = `data:image/${photosList[0].ext};base64,${photosList[0].image}`;
    const params = {
      statusCode: "labelShared",
      sellerComment: returnLabel?.instruction,
      labelData: {
        code: "shipindependently",
        carrier: returnLabel?.selectedCarrierItem,
        trackingId: returnLabel?.trackingNumber,
        labelData: photosList[0].image,
        otherCarrier: returnLabel?.provider,
        shippingCost: returnLabel?.shippingCost,
      },
    };
    const { orderId } = returnRequest?.data;
    setIsReturnUpdate(true);
    actions.returnOrderUpdateApi({ params, orderId, action: "sellerRequest" });
  };

  const disableMainButton = () => {
    if (returnLabel.deliveryType) {
      if (returnLabel.deliveryType === "homitagshipping") {
        if (returnLabel.homitagReturnAddress && returnLabel.provider) {
          return false;
        }
      }
      if (returnLabel.deliveryType === "shipindependently") {
        if (
          (returnLabel.provider || returnLabel.selectedCarrierItem) &&
          returnLabel.trackingNumber &&
          photosList?.length > 0
        ) {
          return false;
        }
      }
    }
    return true;
  };
  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, { flex: 1 }]}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ alignItems: "center" }}
        >
          <ProductDetail sellerName={sellerName} postDetail={post} />

          <TouchableOpacity onPress={goToOrderDetailScreen}>
            <Text style={styles.order_detail_link}>VIEW ORDER DETAIL</Text>
          </TouchableOpacity>

          <View style={styles.horizontal_line} />
          <Text style={styles.detail_text}>
            Select a way to share the return label. The cost will be deducted
            from the buyers refund.
          </Text>
          <View style={styles.buttonContainer}>
            {deliverMethods.map((item, index) => (
              <DeliveryItem
                key={index}
                itemData={item}
                setDeliverMethod={setDeliverMethod}
                onSetDefaultAddress={onSetDefaultAddress}
                deliverMethods={deliverMethods}
                index={index}
                returnAddressList={addressListState?.data}
                navigation={navigation}
                postDetail={postDetail}
                actions={actions}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                onSetLabel={onSetLabel}
                // setSelectedReturnAddress={setSelectedReturnAddress}
                returnLabel={returnLabel}
                isFetchingPostDetail={isFetchingPostDetail}
              />
            ))}

            {/* <MyList counter={counter} items={deliverMethods} /> */}
          </View>
        </KeyboardAwareScrollView>
        <FooterAction
          mainButtonProperties={{
            label: "Next",
            subLabel: "CONFIRMATION",
            disabled: disableMainButton(),
            onPress: () => {
              // ] navigation.navigate('ReturnOption', {
              //   post, sellerName, returnId, chatItem,
              // });
              //
              goToNextScreen();
            },
          }}
        />
      </SafeAreaView>
      {(returnOrderUpdate.isFetching || orderDetail.isFetching) && (
        <ScreenLoader />
      )}
      {(returnRequest.isFetching ||
        orderDetail.isFetching ||
        postDetail.isFetching) && <ScreenLoader />}
      <SafeAreaView style={safeAreaNotchHelper} />
      <Modal
        animationType="fade"
        visible={showMoreMenu ? true : false}
        onRequestClose={() => {
          setShowMoreMenu(false);
        }}
        transparent
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000080",
            justifyContent: "flex-end",
          }}
        >
          {ACTION_BUTTONS.map((opt, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onPressActionSheet(index)}
              style={{
                width: "100%",
                padding: 20,
                backgroundColor:
                  opt.toLowerCase() == "cancel" ? "#FF5656" : "#fff",
                borderBottomWidth: 1,
                borderBottomColor: "#efefef",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: fonts.family.semiBold,
                  color: opt.toLowerCase() == "cancel" ? "white" : "black",
                }}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
      <ConfirmAlert
        isVisible={showAlert}
        message="Now just wait for the buyer to send back your item. You can check for updates on the Order Status page in the mean time"
        secButtonText="Done"
        title="Refund Label Shared !"
        prButtonText="Go to Order Status Page"
        onMainButtonPress={() => {
          // getOrderList();
          const { orderId } = returnRequest?.data;
          actions.getOrderById({ orderId });
          const returnObj = returnOrderUpdate.data.data;
          goToOrderStatusScreen({
            returnObj,
            postItem: post,
            seller: sellerName,
            screen: "OrderStatus",
          });
        }}
        onTouchOutside={() => {
          setShowAlert(false);
          goToOrderStatusScreen();
        }}
        messageStyle={{
          lineHeight: 18,
        }}
      />
      {/* <ActionSheet
        ref={(o) => { actionSheet = o; }}

        options={ACTION_BUTTONS}
        cancelButtonIndex={ACTION_BUTTONS.length - 1}
          // destructiveButtonIndex={1}
        onPress={onPressActionSheet}
      /> */}
    </>
  );
};

export default ReturnAcceptScreen;
