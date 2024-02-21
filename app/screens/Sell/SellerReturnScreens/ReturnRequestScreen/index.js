import React, { useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import moment from "moment";
import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import ProductDetail from "./product-detail";
import { getOrderById, getReturnOrder } from "#modules/Orders/actions";
import { useActions } from "#utils";
import { selectOrderData } from "#modules/Orders/selectors";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { Colors } from "#themes";
import SelectedPhotos from "./selected-photos";
import { FooterAction, Label } from "#components";

const { width } = Dimensions.get("window");

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
    width: 16,
    height: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.active,
    backgroundColor: Colors.active,
    marginRight: 12,
  },
  reason_conatiner: {
    flexDirection: "row",
    width: width - 40,
    alignItems: "flex-start",
  },
  reason_detail_conatiner: {
    flexDirection: "row",
    width: width - 40,
    marginTop: 12,
    borderRadius: 4,
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
  order_detail_link: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "#313334",
    lineHeight: 18,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

const ReturnRequestScreen = ({ navigation, route }) => {
  const sellerName = route?.params?.sellerName ?? null;
  const post = route?.params?.post ?? null;
  const chatItem = route?.params?.chatItem ?? null;
  const returnId = route?.params?.returnId ?? null;
  const orderData = route?.params?.orderData ?? null;

  const { returnRequest, orderDetail } = useSelector(selectOrderData());
  const actions = useActions({
    getOrderById,
    getReturnOrder,
  });

  useEffect(() => {
    actions.getReturnOrder({ returnId });
  }, []);

  const onActionSheetMore = () => {
    navigation.navigate("OrderReceipt", {
      data: post,
      orderData: orderData,
      type: "SELLER",
    });
  };

  const goToOrderStatusScreen = () => {
    navigation.navigate("ViewOrderDetails", {
      type: "SELLER",
      orderData: orderData,
      onViewReceipt: () => onActionSheetMore(),
    });
  };
  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, { flex: 1 }]}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        >
          <ProductDetail sellerName={sellerName} postDetail={post} />

          <TouchableOpacity onPress={goToOrderStatusScreen}>
            <Label
              size="medium"
              type="underline"
              style={{
                color: "#000000",
                fontFamily: "Montserrat-SemiBold",
                fontSize: 12,
              }}
            >
              VIEW ORDER DETAILS
            </Label>
          </TouchableOpacity>

          <View style={styles.horizontal_line} />
          <Label
            size="medium"
            style={{
              marginHorizontal: 20,
              textAlign: "center",
              lineHeight: 22,
              fontFamily: "Montserrat-Regular",
            }}
          >
            {`${
              returnRequest?.data?.returnReason?.shipByBuyer
                ? "The Buyer will"
                : "This return reason requires that you"
            } pay for the return label. Please take action by ${moment(
              returnRequest?.data?.createdAt
            )
              .add(2, "day")
              .format("MM/DD/YYYY")} to avoid an automatic refund.`}
          </Label>
          <View style={styles.text_head_container}>
            <Label
              size="medium"
              style={{
                marginHorizontal: 20,
                fontFamily: "Montserrat-SemiBold",
                fontSize: 15,
              }}
            >
              Return Details
            </Label>
          </View>
          <View style={styles.reason_conatiner}>
            <View style={styles.activeCircle} />
            <Label size="medium" style={{ fontFamily: "Montserrat-SemiBold" }}>
              {returnRequest?.data?.returnReason?.name}
            </Label>
          </View>
          <View style={styles.reason_detail_conatiner}>
            <Label size="medium">{returnRequest?.data?.buyerComment}</Label>
          </View>
          {returnRequest?.data?.images && returnRequest?.data?.images.length ? (
            <>
              <View style={styles.horizontal_line} />
              <View
                style={[
                  styles.text_head_container,
                  {
                    marginTop: 0,
                    marginBottom: 2,
                  },
                ]}
              >
                <Label
                  size="large"
                  style={{
                    marginHorizontal: 20,
                    fontFamily: "Montserrat-SemiBold",
                  }}
                >
                  Images
                </Label>
              </View>
            </>
          ) : null}

          <SelectedPhotos
            images={returnRequest?.data?.images}
            navigation={navigation}
          />
        </ScrollView>
        <FooterAction
          mainButtonProperties={{
            label: "Next",
            subLabel: "RETURN OPTIONS",
            onPress: () => {
              navigation.navigate("ReturnOption", {
                post,
                sellerName,
                returnId,
                chatItem,
                orderData,
              });
            },
          }}
        />
      </SafeAreaView>
      {returnRequest.isFetching && <ScreenLoader />}
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default ReturnRequestScreen;
