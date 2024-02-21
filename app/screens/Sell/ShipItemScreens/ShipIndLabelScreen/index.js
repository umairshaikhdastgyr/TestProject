import React, { useState, useEffect, useRef, useCallback } from "react";

import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import { Icon, FooterAction } from "#components";
import { flex, safeAreaNotchHelper } from "#styles/utilities";
import { Colors, Fonts } from "#themes";
import { postBuyerDetail as postBuyerDetailApi } from "#modules/User/actions";

import { selectOrderData } from "#modules/Orders/selectors";
import { createOffer, getOrders } from "#modules/Orders/actions";
import { useActions } from "#utils";
import ScreenLoader from "#components/Loader/ScreenLoader";
import usePrevious from "#utils/usePrevious";
import { selectUserData } from "#modules/User/selectors";

const { width, height } = Dimensions.get("window");

const CARD_WIDTH = width / 2 - 40;

const CONTENTS = [
  {
    icon: "usps_icon",
    label: "USPS",
    iconStyle: {
      width: 64,
      height: 28,
    },
  },
  {
    icon: "fedex_icon",
    label: "FEDEX",
    iconStyle: {
      width: 64,
      height: 28,
    },
  },
  {
    icon: "ups_icon",
    label: "UPS",
    iconStyle: {
      width: 64,
      height: 28,
    },
  },
  {
    icon: "dhl_icon",
    label: "DHL",
    iconStyle: {
      width: 64,
      height: 28,
    },
  },
];

const firstIndex = [0, 1];

const ShipIndLabelScreen = ({ navigation, route }) => {
  const actions = useActions({
    postBuyerDetailApi,
    createOffer,
    getOrders,
  });

  const { postBuyerDetail, information } = useSelector(selectUserData());
  const { shippingLabel, order } = useSelector(selectOrderData());

  const handleCloseActionLocal = () => {
    navigation.navigate("OrderStatus");
  };

  const styles = StyleSheet.create({
    detailText: {
      fontFamily: "Montserrat-Regular",
      fontSize: 13,
      color: "#313334",
      // textAlign: 'center',
    },
    detailContainer: {
      marginTop: 20,
      // marginBottom: 50,
      paddingHorizontal: 20,
    },
    contentItemConainer: {
      width: CARD_WIDTH,
      height: 85,
      borderRadius: 8,
      flexDirection: "column",
      marginLeft: 20,
      //   marginVertical: 11,
      backgroundColor: "white",
      shadowColor: "black",
      shadowOffset: {
        height: 0,
        // width: 5,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 10,
      justifyContent: "center",
      alignItems: "center",
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
      paddingBottom: 10,
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
      fontSize: 10,
      color: "#969696",
      fontWeight: "600",
      lineHeight: 18,
      textAlign: "center",
    },
    screenHeaderLabel: {
      fontFamily: "Montserrat-Regular",
      fontSize: 13,
      color: "#313334",
      fontWeight: "bold",
      lineHeight: 18,
      marginBottom: 10,
      // textAlign: 'center',
    },
    inputContainer: {
      marginHorizontal: 20,
      marginVertical: 18,
    },

    inputLabel: {
      fontFamily: "Montserrat-Regular",
      fontSize: 15,
      color: "#313334",
      fontWeight: "600",
      marginBottom: 17,
    },
    inputText: {
      fontSize: 15,
      color: "#000000",
      fontFamily: Fonts.family.regular,
      borderBottomWidth: 1,
      borderBottomColor: "#B9B9B9",
      paddingBottom: 12,
      paddingLeft: 0,
    },
  });
  const [selectedItem, setSelectedItem] = useState("");
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => setSelectedItem(item.label.toLowerCase())}
      style={[
        styles.contentItemConainer,
        firstIndex.includes(index)
          ? { marginTop: 35, marginBottom: 7.5 }
          : { marginTop: 7.5, marginBottom: 35 },
        index % 2 === 0
          ? { marginLeft: 32, marginRight: 7.5 }
          : { marginLeft: 7.5, marginRight: 32 },
        item.label.toLowerCase() === selectedItem
          ? { shadowOpacity: 0.4, elevation: 12 }
          : { shadowOpacity: 0.1, elevation: 3 },
      ]}
    >
      <View style={styles.contentIconContainer}>
        <Icon icon={item.icon} style={item.iconStyle} />
      </View>
      <View style={styles.itemDetailContainer}>
        <Text style={styles.itemDetailText}>{item.label}</Text>
      </View>
    </TouchableOpacity>
  );
  const orderData = route?.params?.orderData ?? null;
  const [carrier, setCarrier] = useState("");
  const [trackNumber, setTrackNumber] = useState("");

  useEffect(() => {
    if (carrier) {
      setSelectedItem("");
    }
  }, [carrier]);

  useEffect(() => {
    if (selectedItem) {
      setCarrier("");
    }
  }, [selectedItem]);

  useEffect(() => {
    actions.postBuyerDetailApi({
      userId: orderData.buyerId,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ handleCloseAction: handleCloseActionLocal });
    }, [])
  );

  const prevOrder = usePrevious(order);

  useFocusEffect(
    useCallback(() => {
      if (order.id && prevOrder && !prevOrder.id) {
        const dataToSend = {};
        dataToSend.postId = orderData.postId;
        dataToSend.sellerId = orderData.sellerId;
        dataToSend.sort = "createdAt-desc";
        dataToSend.page = 1;
        dataToSend.perPage = 5;
        dataToSend.buyerId = orderData.buyerId;
        actions.getOrders(dataToSend);
        navigation.navigate("PackingSlip", {
          buyerDetail: postBuyerDetail.data,
          provider: selectedItem || carrier,
          orderData,
        });
      }
    }, [order])
  );
  const onSave = () => {
    const params = {
      orderStatus: "buyAccepted",
      deliveryStatus: "processing",
      trackingId: trackNumber,
      shipBy: moment().add(1, "days"),
      deliveryMethod: {
        ...orderData.deliveryMethod,
        carrier: selectedItem || carrier,
      },
    };
    actions.createOffer({ method: "PATCH", orderId: orderData.id, params });
  };

  return (
    <>
      <SafeAreaView style={flex.grow1}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.detailContainer}>
            <Text style={styles.screenHeaderLabel}>Add Label Details </Text>
            <Text style={styles.detailText}>
              Please provide the label information for your item. Both of you
              and the buyer can track it in the Order Status page.
            </Text>
          </View>
          <View>
            <FlatList
              contentContainerStyle={{ flexGrow: 1 }}
              data={CONTENTS}
              renderItem={renderItem}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item, index) => item + index}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Carrier Not Shown? Enter It Here:
            </Text>
            <TextInput
              placeholderTextColor={Colors.inactiveText}
              placeholder="Carrier (Optional)"
              style={styles.inputText}
              value={carrier}
              onChangeText={(text) => setCarrier(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tracking Number</Text>
            <TextInput
              placeholderTextColor={Colors.inactiveText}
              placeholder="Tracking Number"
              style={styles.inputText}
              value={trackNumber}
              onChangeText={(text) => setTrackNumber(text)}
            />
          </View>
        </ScrollView>
        <FooterAction
          mainButtonProperties={{
            label: "Next",
            subLabel: "PACKING SLIP",
            disabled: !((selectedItem || carrier) && trackNumber),
            onPress: () => {
              onSave();
              // navigation.navigate('PackingSlip', {
              //   buyerDetail: postBuyerDetail.data,
              //   provider: selectedItem || carrier,
              //   orderData,
              // });
            },
          }}
        />
      </SafeAreaView>
      {order.isFetching && <ScreenLoader />}
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default ShipIndLabelScreen;
