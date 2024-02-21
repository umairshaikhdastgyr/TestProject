import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  Linking,
  RefreshControl,
  ScrollView,
} from "react-native";
import { convertNumberToCurrency } from "#utils";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-material-dropdown-v2";
import { useSelector, useDispatch } from "react-redux";
import { getNumberFormatSettings } from "react-native-localize";
import { Icon, FooterAction, SweetAlert } from "#components";
import { Utilities } from "#styles";
import { styles } from "./styles";
import {
  getPaymentBanks,
  getPaymentCards,
  payoutBalance,
  getAccountBalance,
  getUserStripeHistory,
} from "../../../../modules/User/actions";
import { userSelector } from "#modules/User/selectors";
import Imgs from "#assets/images";
import DropDownPicker from "react-native-dropdown-picker";
import { useFocusEffect } from "@react-navigation/native";
import usePrevious from "#utils/usePrevious";
import { Colors, Fonts } from "#themes";
import ScreenLoader from "#components/Loader/ScreenLoader";
import colors from "#themes/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdDetail, getUserIdStripeLink } from "#services/apiUsers";

const TransferOutScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const {
    user: {
      information: { id },
      paymentBankList,
      accountBalanceState,
      payoutBalanceState,
      userStripeDataState,
    },
  } = useSelector(userSelector);

  const stripeData = userStripeDataState?.data?.stripeData;

  const [dropdownData, setDropdownData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [amount, setAmount] = useState("");

  const [errAmount, setErrAmount] = useState("");
  const [isDisabledBtn, setDisableBtn] = useState(true);
  const [isChargableTransfer, setChargableTransfer] = useState(false);
  const [isShowVerifyPopup, setIsShowVerifyPopup] = useState(false);

  const index = route?.params?.i ?? 0;
  useEffect(() => {
    if (index === 0) {
      dispatch(getPaymentBanks({ userId: id, type: "bank" }));
    } else {
      dispatch(getPaymentCards({ userId: id, type: "card" }));
    }
    dispatch(getAccountBalance({ userId: id }));
    dispatch(getUserStripeHistory());

    setAmount(amount.replace(",", "."));
    handleVerifyLabel();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route?.params?.title ?? "Cash Out",
      headerRight: null,
    });
  }, [navigation, route]);

  const handleVerifyLabel = async () => {
    const verifyId = await AsyncStorage.getItem("@verifyId");
    const verifyIdValue = JSON.parse(verifyId);
    if (verifyIdValue == null) {
      return;
    } else {
      if (verifyIdValue.isVerifyId && verifyIdValue.count == 0) {
        setIsShowVerifyPopup(true);
        setTimeout(() => {
          setIsShowVerifyPopup(false);
        }, 4000);
        try {
          await AsyncStorage.setItem(
            "@verifyId",
            JSON.stringify({ isVerifyId: true, count: 1 })
          );
        } catch (error) {
          console.log({ error });
        }
      }
    }
  };

  const { decimalSeparator } = getNumberFormatSettings();

  const [userIdData, setUserIdData] = useState({});
  const [userIdVerifyLink, setUserIdVerifyLink] = useState("");
  const [refreshing, setRefreshing] = useState(false);

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
              setAmount(value);
              setErrAmount("Enter valid amount");
            }
          } else if (seprator === ".") {
            const sepCount = (value.match(/\./g) || []).length;
            if (sepCount === 1) {
              setAmount(value);
              setErrAmount("Enter valid amount");
            }
          }
        } else {
          setAmount(amount);
          // setErrAmount('Enter valid amount');
        }
      } else {
        setAmount(amount);
        // setErrAmount('Enter valid amount');
      }
    } else {
      setAmount(value);
      setErrAmount("");
      const balance = accountBalanceState.data
        ? accountBalanceState?.data?.instant_available[0].amount / 100 +
          parseFloat(accountBalanceState?.data?.localBalance)
        : 0;
      const valid = isChargableTransfer
        ? parseFloat(value) + 2 <= balance
        : parseFloat(value) <= balance;

      if (!valid === true) {
        if (value) {
          setErrAmount(
            `Total Amount exceeds the account balance $${convertNumberToCurrency(
              balance
            )}`
          );
        } else {
          setErrAmount(`Please enter valid amount to cashout`);
        }
      } else {
        setErrAmount("");
        if (userIdData?.connect_link && userIdData?.status == "processed") {
          setDisableBtn(false);
        } else {
          setDisableBtn(true);
        }
      }
    }
    // setAmount('');
  };
  const formValid = () => {
    if (!amount) {
      return false;
    }
    const seprator = ".";
    const pattern =
      decimalSeparator === seprator
        ? /^\s*-?[1-9]\d*(\,\d{1,3})?\s*$/
        : /^\s*-?[1-9]\d*(\.\d{1,3})?\s*$/;
    if (!pattern.test(amount)) {
      setErrAmount("Enter valid amount");
      return false;
    }
    setErrAmount("");
    const balance = accountBalanceState.data
      ? accountBalanceState?.data?.instant_available[0].amount / 100 +
        parseFloat(accountBalanceState?.data?.localBalance)
      : 0;
    const valid = isChargableTransfer
      ? parseFloat(amount) + 2 <= balance
      : parseFloat(amount) <= balance;
    if (!valid === true) {
      setErrAmount(
        `Total Amount exceeds the account balance $${convertNumberToCurrency(
          balance
        )}`
      );
    } else setErrAmount("");
    return selectedId && valid && balance !== 0;
  };

  const [payStatus, setPayStatus] = useState({
    title: "",
    visible: false,
    message: "",
    type: "",
  });
  const onAlertModalTouchOutside = () => {
    setPayStatus({
      title: "",
      visible: false,
      message: "",
    });
    if (payStatus.type === "success") {
      navigation.navigate("ProfileMain");
    }
  };
  const setDropDownDataLocal = (data) => {
    const dropData = data.data
      ? data.data.map((item, index) => ({
          value: `${item.bank_name}`,
          id: item.id,
          label: `${item.bank_name} **** ${item.last4} `,
        }))
      : [];
    if (data.data?.length) {
      setSelectedId(data.data?.[0]?.id);
    }
    setDropdownData(dropData);
  };

  const prevPayoutBalanceState = usePrevious(payoutBalanceState);
  useEffect(() => {
    if (
      payoutBalanceState.data &&
      prevPayoutBalanceState &&
      !prevPayoutBalanceState.data
    ) {
      dispatch(getAccountBalance({ userId: id }));
      setPayStatus({
        title: "Success",
        visible: true,
        message:
          "You've successfully transfered out. Allow 3-5 business days for the transfer to be done.",
        type: "success",
      });
    }

    if (
      payoutBalanceState.failure &&
      prevPayoutBalanceState &&
      !prevPayoutBalanceState.failure
    ) {
      setPayStatus({
        title: "Oops!",
        visible: true,
        message: JSON.stringify(payoutBalanceState.failure),
        type: "error",
      });
    }
  }, [payoutBalanceState]);

  useEffect(() => {
    formValid();
  }, [isChargableTransfer]);

  const onTransferOut = () => {
    // console.info(inputRef.current.getRawValue());
    const valid = formValid();
    if (!valid) return;
    const params = isChargableTransfer
      ? {
          currency: "usd",
          amount: +amount,
          method: "instant",
          destination: selectedId,
        }
      : {
          currency: "usd",
          amount: +amount,
          method: "standard",
          destination: selectedId,
        };
    dispatch(payoutBalance({ userId: id, body: { params } }));
    //   navigation.navigate('PaymentManagement');
    // navigation.goBack();
  };
  useEffect(() => {
    setDropDownDataLocal(paymentBankList.data);
  }, [paymentBankList.data]);

  useEffect(() => {
    // console.log({ amount });
  }, [amount]);

  useFocusEffect(
    useCallback(() => {
      checkUserIdVerify();
    }, [])
  );

  const checkUserIdVerify = async () => {
    const res = await getUserIdDetail({ userId: id });
    if (res?.data?.connect_link && res?.data?.status == "required") {
      const response = await getUserIdStripeLink({ userId: id });
      if (response?.status == 200) {
        setUserIdVerifyLink(response?.url);
      }
    } else if (res?.data?.connect_link && res?.data?.status == "pending") {
      setUserIdVerifyLink(
        "Your account is processing now. Please wait until verified."
      );
    }
    if (res?.data || res?.status == 200) {
      setUserIdData(res?.data);
      setRefreshing(false);
    } else {
      setRefreshing(false);
    }
  };

  const renderToInput = ({ value, label }) => (
    <View style={styles.dropDownInputContainer}>
      <Text style={styles.dropDownInputText}>{value || label}</Text>
      <Icon icon="chevron-down" style={styles.downIcon} />
    </View>
  );
  let label = "Select Bank";
  if (route?.params?.i ?? 0 === 1) {
    label = "Select Debit Card";
  }

  const _onRefresh = () => {
    setRefreshing(true);
    checkUserIdVerify();
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              tintColor={Colors.active}
              refreshing={refreshing}
              onRefresh={_onRefresh}
            />
          }
          contentContainerStyle={{ flex: 1 }}
        >
          {isShowVerifyPopup &&
            stripeData?.capabilities?.transfers == "active" &&
            stripeData?.requirements?.errors[0]?.requirement !=
              "individual.verification.document" && (
              <View style={styles.verify_label_background}>
                <Text style={styles.verify_lebel_text}>
                  Your account has been verified.
                </Text>
              </View>
            )}
          {!userIdData?.connect_link &&
            userIdData?.status == "required" &&
            stripeData?.capabilities?.transfers != "active" &&
            stripeData?.requirements?.errors[0]?.requirement ==
              "individual.verification.document" && (
              <View style={styles.verify_label_background}>
                <Text style={styles.verify_lebel_text}>
                  Your account needs to be verified.{" "}
                  <Text
                    onPress={() => navigation.navigate("VerifyUserId")}
                    style={{
                      fontWeight: "500",
                      textDecorationLine: "underline",
                    }}
                  >{`${"Verify now >"}`}</Text>
                </Text>
              </View>
            )}
          {userIdData?.connect_link &&
          userIdData?.status == "required" &&
          userIdData?.reason?.length > 0 ? (
            <View>
              <Text style={styles.inValid_user_id}>
                {userIdData?.reason[0]?.message}
              </Text>
              <Text
                onPress={() => Linking.openURL(userIdVerifyLink)}
                style={[
                  styles.inValid_user_id,
                  { marginHorizontal: 15, marginTop: 0 },
                ]}
              >
                {userIdVerifyLink}
              </Text>
            </View>
          ) : userIdData?.connect_link && userIdData?.status == "pending" ? (
            <Text
              style={[
                styles.inValid_user_id,
                { textDecorationLine: "underline" },
              ]}
            >
              {userIdVerifyLink}
            </Text>
          ) : null}
          <KeyboardAwareScrollView
            style={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* <Dropdown
            label={'To: '+label}
            data={dropdownData}
            renderBase={renderToInput}
            containerStyle={{borderBottomWidth:0}}
            onChangeText={(value, ind, data) => setSelectedId(data[ind].id)}
          /> */}
            <DropDownPicker
              items={dropdownData}
              defaultValue={
                dropdownData?.length ? dropdownData[0]?.value : null
              }
              arrowSize={20}
              placeholder="To: Select Bank"
              searchable={false}
              style={{
                borderWidth: 0,
                paddingLeft: 0,
              }}
              searchablePlaceholder="Search state"
              searchableError={() => <Text>No bank accounts found</Text>}
              onChangeItem={(item) => {
                console.log(item);
                setSelectedId(item.id);
              }}
            />

            {/* <View
            style={{
              flexDirection: "row",
              borderBottomColor: colors.gray + "50",
              paddingTop: 20,
              borderBottomWidth: 1,
              paddingBottom: 20,
            }}
          >
            <Text style={{ fontFamily: Fonts.family.regular, color: "black" }}>
              {`To:  `}
            </Text>
            <Text style={{ fontFamily: Fonts.family.semiBold, color: "black" }}>
              Bank of America Account **** 4789
            </Text>
          </View> */}

            <View style={styles.inputContainer}>
              <Text style={styles.blackBoldText}>Transfer Amount</Text>
              <View style={{ minWidth: "50%" }}>
                <View style={styles.amountContainer}>
                  <Text style={styles.labelText}>$</Text>
                  <TextInput
                    placeholderTextColor={Colors.inactiveText}
                    placeholder="0.00"
                    style={styles.inputText}
                    keyboardType="decimal-pad"
                    value={amount}
                    onChangeText={(text) => moneyChecker(text)}
                    returnKeyType="done"
                  />
                </View>
              </View>
              {errAmount !== "" && (
                <Text style={styles.redText}>{errAmount}</Text>
              )}
            </View>

            <View style={styles.transferOptionContainer}>
              {/* <TouchableOpacity
                onPress={() => {
                  setChargableTransfer(true);
                }}
                style={[
                  styles.transferOptions,
                  {
                    borderColor: colors.purple,
                    backgroundColor: !isChargableTransfer
                      ? colors.white
                      : colors.purple,
                  },
                ]}
              >
                <Image
                  source={Imgs.transferoutclock}
                  style={{
                    tintColor: isChargableTransfer
                      ? colors.white
                      : colors.purple,
                  }}
                />
                <Text
                  style={[
                    styles.transferOptionText,
                    {
                      color: !isChargableTransfer
                        ? colors.purple
                        : colors.white,
                    },
                  ]}
                >
                  in minutes
                </Text>
                <Text
                  style={[
                    styles.transferOptionFee,
                    {
                      color: !isChargableTransfer
                        ? colors.purple
                        : colors.white,
                    },
                  ]}
                >
                  $2.00 fee
                </Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => {
                  setChargableTransfer(false);
                }}
                style={[
                  styles.transferOptions,
                  {
                    backgroundColor: isChargableTransfer
                      ? colors.white
                      : colors.purple,
                    borderColor: colors.purple,
                  },
                ]}
              >
                <Image
                  source={Imgs.transferoutrocket}
                  style={{
                    tintColor: !isChargableTransfer
                      ? colors.white
                      : colors.purple,
                  }}
                />
                <Text
                  style={[
                    styles.transferOptionText,
                    {
                      color: isChargableTransfer ? colors.purple : colors.white,
                    },
                  ]}
                >
                  upto 5 days
                </Text>
                <Text
                  style={[
                    styles.transferOptionFee,
                    {
                      color: isChargableTransfer ? colors.purple : colors.white,
                    },
                  ]}
                >
                  no fee
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontFamily: Fonts.family.regular }}>
                  Transfer Amount
                </Text>
                <Text style={{ fontFamily: Fonts.family.regular }}>
                  {`$${amount ? amount : "0.00"}`}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontFamily: Fonts.family.regular }}>Fee</Text>
                <Text style={{ fontFamily: Fonts.family.regular }}>
                  {isChargableTransfer ? "$2" : "Free"}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontFamily: Fonts.family.semiBold }}>
                  Total transfer amount money
                </Text>
                <Text style={{ fontFamily: Fonts.family.semiBold }}>
                  {`$${
                    amount
                      ? isChargableTransfer
                        ? parseFloat(amount) + 2
                        : amount
                      : "0.00"
                  }`}
                </Text>
              </View>
            </View>
            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
                marginTop: 20,
              }}
            >
              <Text style={styles.blackText}>
                Transfers may take 1-3 business days and vary by bank. All
                transfer are subject to review.
              </Text>
              <Image
                resizeMode="contain"
                source={Imgs.img_stripe}
                style={styles.imgStripe}
              />
            </View>
          </KeyboardAwareScrollView>

          <FooterAction
            mainButtonProperties={{
              label: "Transfer Out",
              disabled: isDisabledBtn || !selectedId,
              onPress: () => {
                onTransferOut();
              },
            }}
            navigation={navigation}
            isVerify={
              !userIdData?.connect_link &&
              userIdData?.status == "required" &&
              stripeData?.capabilities?.transfers != "active" &&
              stripeData?.requirements?.errors[0]?.requirement ==
                "individual.verification.document"
                ? true
                : false
            }
          />
        </ScrollView>
      </SafeAreaView>
      <SweetAlert
        title={payStatus.title}
        message={payStatus.message}
        type={payStatus.type}
        dialogVisible={payStatus.visible}
        onTouchOutside={onAlertModalTouchOutside}
        iconWidth={120}
      />
      {payoutBalanceState.isFetching ||
        (userStripeDataState.isFetching && <ScreenLoader />)}
      <SafeAreaView
        forceInset={{ bottom: "never" }}
        style={Utilities.safeAreaNotchHelper}
      />
    </>
  );
};

export default TransferOutScreen;
