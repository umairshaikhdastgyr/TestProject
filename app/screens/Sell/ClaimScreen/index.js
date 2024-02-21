import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import ProductDetail from "#screens/Sell/OldOrderStatusScreen/product-detail";
import { selectUserData } from "#modules/User/selectors";
import {
  claimRequest as requestClaim,
  getOrderById,
} from "#modules/Orders/actions";
import {
  FooterAction,
  Label,
  RadioInputs,
  InputText,
  Button,
  Currency,
  SweetAlert,
} from "#components";
import { Colors } from "#themes";
import SelectedPhotos from "./section/selected-photos";
import { useActions } from "#utils";
import { selectOrderData } from "#modules/Orders/selectors";
import usePrevious from "#utils/usePrevious";
import BuyNowSuccessAlert from "#screens/Buy/PaymentConfirmationScreen/buynowSuccessAlert";

const reasons = [
  {
    label: "Item not received",
    value: "item_not_received_at_time",
  },
  { label: "Wrong Item delivered", value: "item_not_as_described" },
  { label: "Item not as described", value: "wrong_item_delivered" },
  {
    label: "Didn’t receive refund on returned item",
    value: "didnt_receive_refund_on_returned_item",
  },
];

const ClaimScreen = ({ navigation, route }) => {
  let keyboardDidShowListener = null;
  let keyboardDidHideListener = null;
  const screenDetails = route?.params?.data ?? {};
  const order = route?.params?.order ?? {};
  const [claimReason, setClaimReason] = useState("");
  const [comment, setComment] = useState("");
  const [submitLoading, showSubmitLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [alertContent, setAlertContent] = useState({
    title: "",
    message: "",
    type: "",
    visible: false,
  });
  const { userProductDetail, claimPhotosList } = useSelector(selectUserData());
  const { claimRequest } = useSelector(selectOrderData());
  const prevClaimRequest = usePrevious(claimRequest);
  const actions = useActions({ requestClaim, getOrderById });

  /* Effetcs */
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
      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, [claimRequest])
  );

  useEffect(() => {
    if (claimRequest.data && prevClaimRequest && !prevClaimRequest.data) {
      showSubmitLoading(false);
      setAlertContent({
        title: `You’ve successfully filed a claim for ${screenDetails.title}`,
        message:
          "We’ll send you notifications once there are updates with this claim.\n\nYou can always check on updates through order status",
        type: "success",
        visible: true,
      });
    }
    if (
      claimRequest.errorMsg &&
      prevClaimRequest &&
      !prevClaimRequest.errorMsg
    ) {
      showSubmitLoading(false);
      setAlertContent({
        title: "Oops...",
        message: JSON.stringify(claimRequest.errorMsg),
        type: "error",
        visible: true,
      });
    }
  }, [claimRequest]);

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

  const isSubmitEnable = () => {
    return !!claimReason && !!comment;
  };

  const handleSubmit = () => {
    showSubmitLoading(true);
    actions.requestClaim({
      orderId: order.id,
      params: {
        claimReason,
        comment,
        amountRequested: order?.partialInfo?.availableRefund,
        images: claimPhotosList,
      },
    });
  };

  const goToOrderStatus = () => {
    actions.getOrderById({ orderId: order.id });
    navigation.goBack();
  };

  return (
    <>
      <SafeAreaView style={safeAreaViewWhite}>
        <KeyboardAvoidingView
          enabled
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {screenDetails.id && (
            <ProductDetail
              screenDetails={screenDetails}
              userProductDetail={userProductDetail}
            />
          )}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {!showKeyboard && (
              <View style={{ marginTop: 20 }}>
                <Label
                  bold
                  type="large"
                  style={{ fontSize: 16, textAlign: "center" }}
                >
                  Refund Amount Requested
                </Label>
                <View
                  style={{
                    backgroundColor: Colors.lightGrey,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                    paddingVertical: 30,
                    marginTop: 20,
                    marginBottom: 30,
                  }}
                >
                  <Currency
                    value={order?.partialInfo?.availableRefund}
                    style={{ color: Colors.black, fontSize: 16 }}
                  />
                </View>
                <View style={{ marginHorizontal: 20 }}>
                  <Label bold type="large" style={{ marginBottom: 20 }}>
                    Please select a reason for filling a claim
                  </Label>
                  <RadioInputs
                    options={reasons}
                    name="reason"
                    value={claimReason}
                    onChange={(name, value) => setClaimReason(value)}
                  />
                </View>
              </View>
            )}
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.lightGrey,
                justifyContent: "center",
                paddingBottom: 40,
                padding: 20,
              }}
            >
              <InputText
                placeholder="Add a coment here"
                placeholderTextColor={Colors.inactiveText}
                bottomLineColor={Colors.black}
                fullWidth
                multiline
                numberOfLines={3}
                textAlign="center"
                value={comment}
                onChangeText={(value) => setComment(value)}
                maxLength={500}
                returnKeyType="done"
                style={{ fontSize: 15 }}
              />
            </View>
            {!showKeyboard && (
              <View style={{ paddingVertical: 30 }}>
                <SelectedPhotos />
                <Button
                  label="Attach Photo"
                  icon="camera"
                  theme="secondary-rounded"
                  style={{ marginHorizontal: 60 }}
                  onPress={() => navigation.navigate("ClaimPhotos", { order })}
                />
              </View>
            )}
          </ScrollView>
          <FooterAction
            mainButtonProperties={{
              label: "Submit Claim",
              showLoading: submitLoading,
              onPress: handleSubmit,
              disabled: !isSubmitEnable(),
            }}
          />
        </KeyboardAvoidingView>
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
        module={"claimscreen"}
      />

      <SweetAlert
        title={alertContent.title}
        message={alertContent.message}
        type={alertContent.type}
        dialogVisible={alertContent.visible && alertContent.type != "success"}
        onTouchOutside={onAlertModalTouchOutside}
      />
    </>
  );
};

export default ClaimScreen;
