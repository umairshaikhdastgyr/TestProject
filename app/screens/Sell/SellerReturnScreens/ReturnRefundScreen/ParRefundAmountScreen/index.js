import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";

import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import ProductDetail from "../../ReturnRequestScreen/product-detail";
import {
  getReturnReason,
  returnOrderUpdate as returnOrderUpdateApi,
  setRefundAmount,
} from "#modules/Orders/actions";
import { useActions } from "#utils";
import { selectOrderData } from "#modules/Orders/selectors";
import { Colors, Fonts } from "#themes";
import { FooterAction, Heading } from "#components";
import { postBuyerDetail as postBuyerDetailApi } from "#modules/User/actions";

import BorderElement from "../../../OldOrderStatusScreen/ShippingStatus/border-element";
import colors from "#themes/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 35;
const styles = StyleSheet.create({
  labelText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    fontSize: 20,
    fontFamily: Fonts.family.semiBold,
    color: Colors.active,
  },
  transaction_label: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#313334",
    lineHeight: 18,
  },
  order_detail_link: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "#313334",
    lineHeight: 18,
    fontWeight: "600",
    textDecorationLine: "underline",
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
    marginTop: 40,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { height: 0, width: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  screenHeaderLabel: {
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
    color: "#313334",
    fontWeight: "bold",
    lineHeight: 18,
    marginBottom: 10,
    // textAlign: 'center',
  },
  "section-container": {
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
  },
  "header-title-count": {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  inputText: {
    color: "#000000",
    fontFamily: Fonts.family.regular,
    borderBottomWidth: 1,
    borderBottomColor: "#B9B9B9",
    paddingLeft: 0,
    textAlign: "center",
    minWidth: 180,
  },
  redText: {
    ...Fonts.style.homiTagText,
    color: Colors.red,
    textAlign: "center",
  },
  text: {
    ...Fonts.style.homiTagText,
    color: "#313334",
    textAlign: "center",
    marginTop: 5,
  },
});

const PartailRefundAmoundScreen = ({ navigation, route }) => {
  const sellerName = route?.params?.sellerName ?? null;
  const post = route?.params?.post ?? null;

  const priceAccepted = route?.params?.priceAccepted ?? null;

  const { refundAmount } = useSelector(selectOrderData());

  const actions = useActions({
    getReturnReason,
    returnOrderUpdateApi,
    postBuyerDetailApi,
    setRefundAmount,
  });

  const [errAmount, setErrAmount] = useState("");
  const [amount, setAmount] = useState("");
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
              actions.setRefundAmount(value);
              setAmount(value);
              setErrAmount("Enter valid amount");
            }
          } else if (seprator === ".") {
            const sepCount = (value.match(/\./g) || []).length;
            if (sepCount === 1) {
              actions.setRefundAmount(value);
              setAmount(value);
            }
          }
        } else {
          actions.setRefundAmount(refundAmount);
          setAmount(refundAmount);
          // setErrAmount('Enter valid amount');
        }
      } else {
        actions.setRefundAmount(refundAmount);
        setAmount(refundAmount);
        // setErrAmount('Enter valid amount');
      }
    } else {
      setErrAmount("");
      const prAcc = parseFloat(priceAccepted);
      const valid = parseFloat(value) <= prAcc;
      if (value && !valid === true) {
        actions.setRefundAmount(0);
        setAmount(0);
        setErrAmount("Entered amount exceeds the account total amount");
      } else {
        if (value1) {
          actions.setRefundAmount(value);
          setAmount(value);
          setErrAmount("");
        } else {
          actions.setRefundAmount(0);
          setAmount(0);
          setErrAmount("");
        }
      }
    }
  };

  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, { flex: 1 }]}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        >
          <ProductDetail
            sellerName={sellerName}
            postDetail={post}
            priceAccepted={priceAccepted}
          />

          <View style={styles.horizontal_line} />
          <View style={[styles["section-container"], { width }]}>
            <View style={styles["header-title-count"]}>
              <Heading type="bodyText" bold>
                Refund Amount
              </Heading>
            </View>
            <View
              style={{
                alignItems: "center",

                paddingTop: 25,
                paddingBottom: 25,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F5F5F5",
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              >
                <Text style={[styles.labelText, { marginRight: 10 }]}>$</Text>
                <TextInput
                  placeholderTextColor={"#999999"}
                  placeholder="Enter Amount"
                  fullWidth
                  textAlign="left"
                  value={amount}
                  defaultValue={refundAmount}
                  onChangeText={(text) => moneyChecker(text)}
                  keyboardType="decimal-pad"
                  style={{ fontSize: 18, width: 120, height: 45 }}
                />
              </View>
              {errAmount ? (
                <Text style={styles.redText}>{errAmount}</Text>
              ) : null}
              <Text style={styles.text}>
                Please enter the amount you'd like to refund
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <FooterAction
          mainButtonProperties={{
            label: "Next",
            disabled: errAmount || !amount,
            onPress: () => navigation.goBack(),
          }}
        />
      </SafeAreaView>

      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default PartailRefundAmoundScreen;
