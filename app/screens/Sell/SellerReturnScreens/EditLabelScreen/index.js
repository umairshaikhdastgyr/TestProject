import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";

import ActionSheet from "react-native-actionsheet";
import DocumentPicker from "react-native-document-picker";

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
  updateReturn as updateReturnAction,
  getReturnOrder,
} from "#modules/Orders/actions";

import { useActions } from "#utils";
import { selectOrderData } from "#modules/Orders/selectors";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { postBuyerDetail as postBuyerDetailApi } from "#modules/User/actions";
import { Colors } from "#themes";
import { FooterAction, SweetAlert } from "#components";

import { getPostDetail } from "#modules/Posts/actions";
import { selectPostsData } from "#modules/Posts/selectors";
import {
  updatePostStatus as updatePostStatusAction,
  setPhotoList,
} from "#modules/Sell/actions";
import { selectSellData } from "#modules/Sell/selectors";
import IndDelivery from "../ReturnAcceptScreen/DeliveryItem/indDelivery";
import usePrevious from "#utils/usePrevious";
import { useFocusEffect } from "@react-navigation/native";

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
    marginVertical: 25,
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
    // marginTop: 10,
    width,
  },
  order_detail_link: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "#313334",
    lineHeight: 18,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

const DELIVERY_METHODS = [
  {
    id: 1,
    name: "Homitag Label",
    description: "Generate and pay for a return label the in the app",
    isSelected: false,
    code: "homitagshipping",
  },
  {
    id: 2,
    name: "Supply Own Label",
    description: "Upload your own label to share with the buyer",
    isSelected: false,
    code: "shipindependently",
  },
];

const ACTION_BUTTONS = ["Upload an Image", "Upload a File", "Cancel"];

const DEFAULT_CARRIERS = ["usps", "fedex", "ups", "dhl"];
const counter = { value: 0 };

const EditLabelScreen = ({ navigation, route }) => {
  const sellerName = route?.params?.sellerName ?? null;
  const post = route?.params?.post ?? null;
  const chatItem = route?.params?.chatItem ?? null;
  const returnObj = route?.params?.returnObj ?? null;

  const {
    returnRequest,

    returnLabel,
    updateReturn,
  } = useSelector(selectOrderData());
  const { postDetail } = useSelector(selectPostsData());

  const actions = useActions({
    getPostDetail,
    setReturnAddress,
    updatePostStatusAction,
    getCheapestRate,
    setReturnLabel,
    postBuyerDetailApi,
    setPhotoList,
    updateReturnAction,
    getReturnOrder,
  });

  const [shProvider, setShProvider] = useState("");

  const setValuesToInput = () => {
    const returnObj1 = returnRequest?.data;
    actions.setReturnLabel({
      deliveryType: "shipindependently",
      trackingNumber: returnObj1?.labelData?.tracking,
      shippingCost: returnObj1?.labelData?.shippingCost,
      providerName: returnObj1?.labelData?.carrier,
      provider: DEFAULT_CARRIERS.includes(returnObj1?.labelData?.carrier)
        ? ""
        : returnObj1?.labelData?.carrier,
      selectedCarrierItem: DEFAULT_CARRIERS.includes(
        returnObj1?.labelData?.carrier
      )
        ? returnObj1?.labelData?.carrier
        : "",
      homitagReturnAddress: null,
      instruction: "",
    });

    actions.setPhotoList([
      {
        type: "selected-photo",
        image: returnObj1?.labelData?.labelData,
        uri: "",
        ext: "jpeg",
      },
    ]);
    setShProvider(returnObj1?.labelData?.carrier?.toUpperCase());
  };

  const handleCloseActionLocal = () => {
    // navigation.navigate('OrderStatus');
    navigation.goBack();
  };

  const { photosList } = useSelector(selectSellData());
  // const selectedOption = homitagShipping?.DeliveryMethodPerPost?.customProperties?.optionsAvailable?.find((item) => item.selected === true);

  useEffect(() => {
    setReturnAddress([]);
    actions.getPostDetail({
      postId: returnRequest?.data?.Order?.postId,
    });
    actions.getReturnOrder({ returnId: returnObj?.id });
    setValuesToInput();
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ handleCloseAction: handleCloseActionLocal });
    }, [])
  );

  useEffect(() => {
    setShProvider(
      (returnLabel.provider && returnLabel.provider.toUpperCase()) ||
        (returnLabel.selectedCarrierItem &&
          returnLabel.selectedCarrierItem.toUpperCase())
    );
  }, [returnLabel]);

  useEffect(() => {
    setValuesToInput();
  }, [returnRequest]);

  const actionUpdateReturn = () => {
    const returnId = returnObj.id;
    const params = {
      labelData: {
        code: "shipindependently",
        carrier: returnLabel?.selectedCarrierItem,
        tracking: returnLabel?.trackingNumber,
        labelData: photosList[0].image,
        otherCarrier: returnLabel?.provider,
        shippingCost: returnLabel?.shippingCost,
      },
    };
    actions.updateReturnAction({ params, returnId });
  };
  const goToOrderStatusScreen = () => {
    navigation.navigate("OrderStatus", {
      orderData: returnRequest?.data?.Order,
      type: "SELLER",
      chatItem,
      orderId: returnRequest?.data?.Order.id,
    });
  };

  const prevUpdateReturn = usePrevious(updateReturn);

  const [alertContent, setAlertContent] = useState({
    title: "",
    message: "",
    type: "success",
    visible: false,
  });

  const onAlertModalTouchOutside = () => {
    setAlertContent({
      title: "",
      message: "",
      type: "",
      visible: false,
    });
  };

  useEffect(() => {
    if (updateReturn.data && prevUpdateReturn && !prevUpdateReturn.data) {
      actions.getReturnOrder({ returnId: returnObj?.id });
      navigation.goBack();
    }
    if (updateReturn.failure && prevUpdateReturn && !prevUpdateReturn.failure) {
      setAlertContent({
        title: "Oops...",
        message: JSON.stringify(updateReturn.failure),
        type: "error",
        visible: true,
      });
    }
  }, [updateReturn]);

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
      const returnLabelImage = `data:image/jpeg;base64,${photoBase64}`;
      actions.setPhotoList([
        {
          type: "selected-photo",
          image: returnLabelImage,
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

  // create our ref
  let actionSheet;
  const onPressActionSheet = (index) => {
    switch (index) {
      case 0:
        navigation.navigate("SellPhotos", { screen: "return" });
        break;
      case 1:
        pickFIle();
        break;
      default:
        break;
    }
  };

  const onSetLabel = () => {
    actionSheet.show();
  };

  const disableMainButton = () => {
    if (
      (returnLabel.provider || returnLabel.selectedCarrierItem) &&
      returnLabel.shippingCost &&
      returnLabel.trackingNumber &&
      photosList?.length > 0
    ) {
      return false;
    }
    return true;
  };

  const [errAmount, setErrAmount] = useState("");

  const moneyChecker = (value1) => {
    const value = value1.replace(",", ".");
    const seprator = ".";
    const pattern = /^\s*-?[0-9]\d*(\.\d{1,3})?\s*$/;
    if (!pattern.test(value) && value) {
      if (value[value.length - 1] === seprator) {
        if (pattern.test(value.split(seprator)[0])) {
          if (seprator === ",") {
            const sepCount = (value.match(/,/g) || []).length;
            if (sepCount === 1) {
              actions.setReturnLabel({ ...returnLabel, shippingCost: value });

              setErrAmount("Enter valid amount");
            }
          } else if (seprator === ".") {
            const sepCount = (value.match(/\./g) || []).length;
            if (sepCount === 1) {
              actions.setReturnLabel({ ...returnLabel, shippingCost: value });
              setErrAmount("Enter valid amount");
            }
          }
        } else {
          actions.setReturnLabel({ ...returnLabel });
          // setErrAmount('Enter valid amount');
        }
      } else {
        actions.setReturnLabel({ ...returnLabel });
        // setErrAmount('Enter valid amount');
      }
    } else {
      actions.setReturnLabel({ ...returnLabel, shippingCost: value });
      setErrAmount("");
    }
    // setAmount('');
  };

  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, { flex: 1 }]}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ alignItems: "center" }}
        >
          <ProductDetail sellerName={sellerName} postDetail={post} />

          <TouchableOpacity onPress={goToOrderStatusScreen}>
            <Text style={styles.order_detail_link}>View Order Detail</Text>
          </TouchableOpacity>

          <View style={styles.horizontal_line} />

          <View style={styles.buttonContainer}>
            {/* <MyList counter={counter} items={deliverMethods} /> */}

            <IndDelivery
              onSetLabel={onSetLabel}
              actions={actions}
              errAmount={errAmount}
              moneyChecker={moneyChecker}
              navigation={navigation}
              returnLabel={returnLabel}
              shProvider={shProvider}
              type="edit"
            />
          </View>
        </KeyboardAwareScrollView>
        <FooterAction
          mainButtonProperties={{
            label: "Save Changes",
            disabled: disableMainButton(),
            onPress: () => {
              actionUpdateReturn();
            },
          }}
        />
      </SafeAreaView>
      <SweetAlert
        title={alertContent.title}
        message={alertContent.message}
        type={alertContent.type}
        dialogVisible={alertContent.visible}
        onTouchOutside={onAlertModalTouchOutside}
      />
      {updateReturn.isFetching && <ScreenLoader />}
      <SafeAreaView style={safeAreaNotchHelper} />
      <ActionSheet
        ref={(o) => {
          actionSheet = o;
        }}
        options={ACTION_BUTTONS}
        cancelButtonIndex={ACTION_BUTTONS.length - 1}
        // destructiveButtonIndex={1}
        onPress={onPressActionSheet}
      />
    </>
  );
};

export default EditLabelScreen;
