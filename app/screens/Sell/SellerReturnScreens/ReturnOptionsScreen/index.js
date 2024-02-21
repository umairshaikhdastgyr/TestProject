import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  safeAreaViewWhite,
  safeAreaNotchHelper,
  style,
} from "#styles/utilities";
import ProductDetail from "../ReturnRequestScreen/product-detail";
import { getOrderById, getReturnOrder } from "#modules/Orders/actions";
import { useActions } from "#utils";
import { selectOrderData } from "#modules/Orders/selectors";
import usePrevious from "#utils/usePrevious";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { Colors } from "#themes";
import { Icon, FooterAction } from "#components";
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
    elevation: 6,
  },
  contentItemHeader: {
    paddingVertical: 12,
    backgroundColor: "#00BDAA",
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  itemHeaderText: {
    fontFamily: "Montserrat-Medium",
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
    fontFamily: "Montserrat-SemiBold",
    fontSize: 13,
    color: "#969696",
    fontWeight: "500",
    lineHeight: 18,
    textAlign: "center",
  },
  buttonContainer: {
    marginHorizontal: 20,
    flex: 1,
    marginTop: 20,
    paddingBottom: 40,
  },
  order_detail_link: {
    lineHeight: 18,
    fontWeight: "600",
    textDecorationLine: "underline",
    color: "#000000",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 12,
  },
});

const ReturnOptionsScreen = ({ navigation, route }) => {
  const sellerName = route?.params?.sellerName ?? null;
  const post = route?.params?.post ?? null;
  const chatItem = route?.params?.chatItem ?? null;
  const returnId = route?.params?.returnId ?? null;
  const orderData = route?.params?.orderData ?? null;

  const { returnRequest, orderDetail } = useSelector(selectOrderData());

  const CONTENTS = [
    {
      title: "Accept Return",
      icon: "option_tick_icon",
      detail:
        "Proceed to the return process to send a return label to the buyer",
      iconStyle: {
        width: 36,
        height: 24,
      },
      onPress: () => {
        navigation.navigate("ReturnAccept", {
          post,
          sellerName,
          returnId,
          chatItem,
          orderData,
        });
      },
    },
    {
      title: "Decline Return",
      icon: "option_close_icon",
      detail: "If your item isn’t returnable, please select this option",
      iconStyle: {
        width: 35.31,
        height: 35.31,
      },
      onPress: () => {
        navigation.navigate("ReturnDecline", {
          post,
          sellerName,
          returnId,
          chatItem,
          orderData,
        });
      },
    },
    {
      title: "Chat with Buyer",
      icon: "option_chat_icon",
      detail:
        "You can try to figure this out with the buyer via chat, but please take a concrete action by [date]",
      iconStyle: {
        width: 37.12,
        height: 30.1,
      },
      onPress: () => {
        navigation.navigate("ChatScreen", { item: chatItem });
      },
    },
    {
      title: "Refund the Buyer",
      icon: "option_refund_icon",
      detail:
        "Issue a refund to the buyer if you don’t want this item returned",
      iconStyle: {
        width: 36.2,
        height: 36.75,
      },
      onPress: () => {
        navigation.navigate("ReturnRefund", {
          post,
          sellerName,
          returnId,
          chatItem,
          orderObj: returnRequest?.data?.Order,
          screen: "orderstatus",
        });
      },
    },
  ];

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

  const handleCloseActionLocal = () => {
    // navigation.navigate('OrderStatus');
    navigation.goBack();
  };
  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ handleCloseAction: handleCloseActionLocal });
    }, [])
  );
  const actionDate = moment(returnRequest?.data?.sellerResponseLimit).format(
    "MM/DD/YYYY"
  );
  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.contentItemConainer,
        [0, 1].includes(index) ? { height: 200 } : { height: 230 },
      ]}
    >
      <TouchableOpacity onPress={item.onPress}>
        <View style={styles.contentItemHeader}>
          <Text style={styles.itemHeaderText}>{item.title}</Text>
        </View>
        <View style={styles.contentIconContainer}>
          <Icon icon={item.icon} style={item.iconStyle} />
        </View>
        <View style={styles.itemDetailContainer}>
          <Text style={styles.itemDetailText}>
            {index === 2
              ? `You can try to figure this out with the buyer via chat, but please take a concrete action by ${actionDate}`
              : item.detail}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, { flex: 1 }]}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        >
          <ProductDetail sellerName={sellerName} postDetail={post} />

          <TouchableOpacity onPress={goToOrderStatusScreen}>
            <Text style={styles.order_detail_link}>VIEW ORDER DETAIL</Text>
          </TouchableOpacity>
          {/* <Text>
            <Text style={styles.transaction_label}> TRANSACTION ID:</Text>
            <Text style={styles.transaction_id}>
              {' '}
              {returnRequest?.data?.Order?.orderID}
            </Text>
          </Text> */}

          <View style={styles.horizontal_line} />
          <Text style={styles.detail_text}>
            {`Please take action by ${actionDate} to avoid an automatic refund.`}
          </Text>
          <View style={styles.buttonContainer}>
            <FlatList data={CONTENTS} renderItem={renderItem} numColumns={2} keyExtractor={(item, index) => item + index} />
          </View>
        </ScrollView>
      </SafeAreaView>
      {(returnRequest.isFetching || orderDetail.isFetching) && <ScreenLoader />}
    </>
  );
};

export default ReturnOptionsScreen;
