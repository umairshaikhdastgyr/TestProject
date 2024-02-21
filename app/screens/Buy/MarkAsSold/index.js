import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FooterAction, ItemSellObj, Toast } from "#components";

import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import { orderExchange } from "#modules/Orders/actions";
import { selectOrderData } from "#modules/Orders/selectors";
import { updatePostStatus } from "#modules/Sell/actions";
import { selectSellData } from "#modules/Sell/selectors";
import usePrevious from "#utils/usePrevious";

import ScreenLoader from "#components/Loader/ScreenLoader";
import BuyerList from "./buyer-list";
import { Fonts } from "#themes";

const { height } = Dimensions.get("window");

const OrderStatus = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const buyerList = route?.params?.buyerList ?? [];
  const ordersList = route?.params?.ordersList ?? [];
  const postId = route?.params?.postId ?? [];

  const [buyerName, setBuyerName] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [screenDetails, setScreenDetails] = useState({});
  const [buyerArray, setBuyerArray] = useState([]);
  const [toastMessage, setToastMessage] = useState({
    isVisible: false,
    message: "",
  });
  const [postUpdate, setPostUpdate] = useState(false);

  const orderState = useSelector(selectOrderData());
  const sellState = useSelector(selectSellData());
  const updatePostStatusState = sellState.updatePostStatus;
  const prevUpdatePostStatus = usePrevious(updatePostStatusState);

  useEffect(() => {
    if (
      updatePostStatusState.data &&
      prevUpdatePostStatus &&
      !prevUpdatePostStatus.data &&
      postUpdate
    ) {
      navigation.navigate("Dashboard", {
        from: "MarkAsSold",
        success: true,
      });
      return;
    }
  }, [updatePostStatusState]);

  useEffect(() => {
    if (
      orderState &&
      orderState?.orderExchange?.failure &&
      updatePostStatusState?.failure
    ) {
      setToastMessage({
        isVisible: true,
        message: "Sorry, something went wrong, try again in a moment.",
      });
    }
  }, [updatePostStatusState, orderState]);

  useEffect(() => {
    setScreenDetails(route?.params?.data ?? []);
    const newOrderList = [];
    ordersList.map((order) => {
      buyerList.map((buyer) => {
        if (order.buyerId === buyer[1].receiver.userId) {
          newOrderList.push({ ...buyer[1], orderId: order.id });
        }
      });
    });

    setBuyerArray(newOrderList);
    setPostUpdate(true);
  }, []);

  const pressAction = () => {
    if (selectedOrderId !== "NA") {
      dispatch(orderExchange({ orderId: selectedOrderId }));
    }
    dispatch(
      updatePostStatus({
        params: { postStatusId: "005e6330-fcc3-4211-be2c-fd99c0bd87f6" },
        postId,
        rediecrtParam: null,
      })
    );
  };

  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, { flex: 1 }]}>
        <Toast
          isVisible={toastMessage.isVisible}
          message={toastMessage.message}
        />
        <KeyboardAvoidingView
          style={{ flex: 1, minHeight: height - 150 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              {screenDetails.id && (
                <ItemSellObj
                  screenDetails={screenDetails}
                  buyerName={buyerName}
                />
              )}
              <Text
                style={{
                  fontFamily: Fonts.family.semiBold,
                  fontSize: 15,
                  marginTop: 20,
                  marginHorizontal: 18,
                  marginBottom: 25,
                  color: "black",
                }}
              >
                Who Bought This Item?
              </Text>
              <BuyerList
                setSelectedOrderId={setSelectedOrderId}
                buyerList={buyerArray}
                buyerName={buyerName}
                setBuyerName={setBuyerName}
              />
            </View>
          </View>
          <FooterAction
            mainButtonProperties={{
              label: "Mark as Sold",
              disabled: !selectedOrderId,
              onPress: () => {
                pressAction();
              },
            }}
          />
        </KeyboardAvoidingView>
        {updatePostStatusState.isFetching && <ScreenLoader />}
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default OrderStatus;
