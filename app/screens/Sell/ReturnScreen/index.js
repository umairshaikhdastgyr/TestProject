import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Platform,
  Keyboard,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import ProductDetail from "#screens/Sell/OldOrderStatusScreen/product-detail";
import { selectUserData } from "#modules/User/selectors";
import {
  getReturnReason,
  returnRequest as requestReturn,
  getOrderById,
} from "#modules/Orders/actions";
import {
  FooterAction,
  Label,
  RadioInputs,
  InputText,
  Button,
  SweetAlert,
} from "#components";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { Colors } from "#themes";
import SelectedPhotos from "./section/selected-photos";
import { useActions } from "#utils";
import { selectOrderData } from "#modules/Orders/selectors";
import usePrevious from "#utils/usePrevious";
import BuyNowSuccessAlert from "#screens/Buy/PaymentConfirmationScreen/buynowSuccessAlert";
import {
  setReturnPhotoList,
  addClaimPhotoToList,
  setClaimPhotoList,
} from "#modules/User/actions";
import { setPhotoList } from "#modules/Sell/actions";

// const reasons = [
//   { label: 'Item is damaged', value: 'damaged' },
//   { label: 'Incorrect item / Missing Parts', value: 'incorrect' },
//   { label: 'Wrong Item delivered', value: 'wrong_delivered' },
//   { label: 'Item not as described', value: 'not_as_described' },
//   { label: 'Item not received', value: 'not_received' },
//   { label: 'Item doesn’t fit', value: 'not_fit' },
//   { label: 'Changed my Mind', value: 'change_mind' },
//   { label: 'Found same item at a lower price', value: 'lower_price' },
// ];

const ReturnScreen = ({ navigation, route }) => {
  let keyboardDidShowListener = null;
  let keyboardDidHideListener = null;
  const screenDetails = route?.params?.data ?? {};
  const order = route?.params?.order ?? {};
  const storeName = route?.params?.storeName;

  const [returnReasonCode, setReturnReasonCode] = useState("");
  const [buyerComment, setBuyerComment] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [alertContent, setAlertContent] = useState({
    title: "",
    message: "",
    type: "",
    visible: false,
  });
  const { userProductDetail, photosList } = useSelector(selectUserData());
  const { returnReason, returnRequest } = useSelector(selectOrderData());
  const prevRequestRequest = usePrevious(returnRequest);
  const actions = useActions({
    getReturnReason,
    requestReturn,
    getOrderById,
    setReturnPhotoList,
    addClaimPhotoToList,
    setClaimPhotoList,
    setPhotoList,
  });

  /* Effetcs */
  useEffect(() => {
    actions.getReturnReason({ action: "reasonsReturn" });
  }, []);

  const goToOrderStatus = () => {
    actions.getOrderById({ orderId: order.id });
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      const keyboardDidShow = () => {
        setShowKeyboard(true);
      };

      const keyboardDidHide = () => {
        setShowKeyboard(false);
      };
      keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        keyboardDidShow
      );
      keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        keyboardDidHide
      );

      if (
        returnRequest.data &&
        prevRequestRequest &&
        !prevRequestRequest.data
      ) {
        setAlertContent({
          title: `You’ve successfully filed a claim for ${screenDetails.title}`,
          message:
            "We’ll send you notifications once there are updates with this claim.\n\nYou can always check on updates through order status",
          type: "success",
          visible: true,
        });
      }
      if (
        returnRequest.failure &&
        prevRequestRequest &&
        !prevRequestRequest.failure
      ) {
        setAlertContent({
          title: "Oops...",
          message: JSON.stringify(returnRequest.failure),
          type: "error",
          visible: true,
        });
      }

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, [returnRequest, prevRequestRequest])
  );

  const onAlertModalTouchOutside = () => {
    setAlertContent({
      title: "",
      message: "",
      type: "",
      visible: false,
    });
    actions.getOrderById({ orderId: order.id });
    navigation.goBack();
  };

  const handleSubmit = async () => {
    await actions.requestReturn({
      orderId: order.id,
      params: {
        returnReasonCode,
        buyerComment,
        images: photosList,
      },
    });
    await actions.setPhotoList([]);
    await actions.setClaimPhotoList([]);
    await actions.setReturnPhotoList([]);
  };

  const isSubmitEnable = () => {
    return !!returnReasonCode && !!buyerComment;
  };
  const returnReasonList = returnReason?.data?.data;
  return (
    <>
      <SafeAreaView style={safeAreaViewWhite}>
        <View enabled style={{ flex: 1 }}>
          {screenDetails.id && (
            <ProductDetail
              screenDetails={screenDetails}
              userProductDetail={userProductDetail}
              storeName={storeName}
            />
          )}
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            extraHeight={250}
          >
            <View style={{ marginHorizontal: 20 }}>
              <Label bold type="large">
                Please select a return reason
              </Label>
              <Label type="medium" style={{ marginTop: 21, marginBottom: 40 }}>
                For returns that aren’t the seller’s fault, the shipping cost
                will be deducted from your refund.
              </Label>
              <RadioInputs
                options={
                  returnReasonList?.map((item) => ({
                    label: item.name,
                    value: item.code,
                  })) || []
                }
                name="reason"
                value={returnReasonCode}
                onChange={(name, value) => setReturnReasonCode(value)}
              />
            </View>
            <View
              style={{
                justifyContent: "center",
                backgroundColor: "#F5F5F5",
                padding: 10,
              }}
            >
              <InputText
                placeholder="Add a comment here"
                placeholderTextColor={Colors.inactiveText}
                bottomLineColor={"#DADADA"}
                fullWidth
                multiline
                textAlign="left"
                value={buyerComment}
                onChangeText={(value) => setBuyerComment(value)}
                onSubmitEditing={() => Keyboard.dismiss()}
                returnKeyType="done"
                style={{ fontSize: 15, flex: 1, padding: 10 }}
                maxLength={500}
                numberOfLines={5}
              />
            </View>
            <View style={{ paddingVertical: 30 }}>
              <SelectedPhotos />
              <Button
                label="Attach Photo"
                icon="camera"
                theme="secondary-rounded"
                style={{ marginHorizontal: 60 }}
                onPress={() => navigation.navigate("ReturnPhotos", { order })}
              />
            </View>
          </KeyboardAwareScrollView>
          <FooterAction
            mainButtonProperties={{
              label: "Submit Return Request",
              onPress: handleSubmit,
              disabled: !isSubmitEnable(),
            }}
          />
        </View>
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
      <BuyNowSuccessAlert
        dialogVisible={alertContent.type == "success"}
        onDone={onAlertModalTouchOutside}
        onCTAClick={() => {
          goToOrderStatus();
        }}
        goTo={() => {
          goToOrderStatus();
        }}
        orderData={order}
        module={"returnscreen"}
      />
      <SweetAlert
        title={alertContent.title}
        message={alertContent.message}
        type={alertContent.type}
        dialogVisible={alertContent.visible && alertContent.type != "success"}
        onTouchOutside={onAlertModalTouchOutside}
      />
      {(returnReason.isFetching || returnRequest.isFetching) && (
        <ScreenLoader />
      )}
    </>
  );
};

export default ReturnScreen;
