import React, { useState, useEffect, useRef } from "react";

import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity
} from "react-native";
import { useSelector } from "react-redux";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Icon, FooterAction } from "#components";
import { flex, safeAreaNotchHelper } from "#styles/utilities";
import { Colors, Fonts } from "#themes";
import { postBuyerDetail as postBuyerDetailApi } from "#modules/User/actions";

import { selectOrderData } from "#modules/Orders/selectors";
import {
  createOffer,
  getOrders,
  setReturnLabel,
} from "#modules/Orders/actions";
import { useActions } from "#utils";
import ScreenLoader from "#components/Loader/ScreenLoader";
import usePrevious from "#utils/usePrevious";
import { selectUserData } from "#modules/User/selectors";
import colors from "#themes/colors";

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

const SelectCarrierScreen = ({ navigation, route }) => {
  const actions = useActions({
    postBuyerDetailApi,
    createOffer,
    getOrders,
    setReturnLabel,
  });

  const { postBuyerDetail, information } = useSelector(selectUserData());
  const { shippingLabel, order, returnLabel } = useSelector(
    selectOrderData()
  );

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
      height: 100,
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
      onPress={() => {
        //   setSelectedItem(item.label.toLowerCase());
        actions.setReturnLabel({
          ...returnLabel,
          selectedCarrierItem: item.label.toLowerCase(),
        });
      }}
      activeOpacity={0.1}
      style={[
        styles.contentItemConainer,
        firstIndex.includes(index)
          ? { marginTop: 35, marginBottom: 15 }
          : { marginTop: 15, marginBottom: 35 },
        index % 2 === 0
          ? { marginLeft: 25, marginRight: 15 }
          : { marginLeft: 15, marginRight: 32 },
        item.label.toLowerCase() === returnLabel.selectedCarrierItem
          ? { shadowOpacity: 0.4, backgroundColor: 'grey' }
          : { shadowOpacity: 0.1, backgroundColor: "white" },
      ]}
    >
      <View style={styles.contentIconContainer}>
        <Icon icon={item.icon} style={item.iconStyle} />
      </View>
      <View style={styles.itemDetailContainer}>
        <Text
          style={[
            styles.itemDetailText,
            {
              color:
                item.label.toLowerCase() === returnLabel.selectedCarrierItem
                  ? "#ffffff"
                  : "#969696",
            },
          ]}
        >
          {item.label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    //   setSelectedItem('');
    if (returnLabel.selectedCarrierItem)
      actions.setReturnLabel({ ...returnLabel, provider: "" });
  }, [returnLabel.selectedCarrierItem]);

  useEffect(() => {
    // setCarrier('');
    if (returnLabel.provider) {
      actions.setReturnLabel({ ...returnLabel, selectedCarrierItem: "" });
    }
  }, [returnLabel.provider]);

  return (
    <>
      <SafeAreaView style={flex.grow1}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          // contentContainerStyle={{ alignItems: 'center' }}
        >
          <View>
            <FlatList
              contentContainerStyle={{ flexGrow: 1 }}
              keyExtractor={(item, index) => item + index}
              data={CONTENTS}
              renderItem={renderItem}
              numColumns={2}
              scrollEnabled={false}
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
              value={returnLabel.provider}
              onChangeText={(text) => {
                //  setCarrier(text);
                actions.setReturnLabel({ ...returnLabel, provider: text });
              }}
            />
          </View>
        </KeyboardAwareScrollView>

        <FooterAction
          mainButtonProperties={{
            label: "Save Carrier",
            disabled: !(
              returnLabel.provider || returnLabel.selectedCarrierItem
            ),
            onPress: () => {
              navigation.goBack();
            },
          }}
        />
      </SafeAreaView>
      {order.isFetching && <ScreenLoader />}
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default SelectCarrierScreen;
