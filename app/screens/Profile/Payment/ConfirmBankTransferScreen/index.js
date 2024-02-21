import React, { useEffect, useState } from "react";

import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { BallIndicator } from "react-native-indicators";
import { FooterAction, SweetAlert } from "#components";
import { styles } from "./styles";
import { userSelector } from "#modules/User/selectors";
import { createTokenWithBankOrCard } from "#services/Stripe";
import { updatePaymentMethod, getPaymentBanks } from "#modules/User/actions";
import usePrevious from "#utils/usePrevious";
import { Colors } from "#themes";
import { Utilities } from "#styles";

const TextView = ({ label, value }) => (
  <View style={styles.textViewContainer}>
    <Text style={styles.blackBoldText}>{label}</Text>
    <Text style={styles.blackSmallText}>{value}</Text>
  </View>
);

const ConfirmBankTransferScreen = ({ navigation, route }) => {
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
      type: "",
    });
    // navigation.navigate('PaymentManagement');
  };
  const {
    user: {
      information: { id },
      updatePaymentMethodState,
    },
  } = useSelector(userSelector);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const prevUpdatePaymentMethodState = usePrevious(updatePaymentMethodState);

  useEffect(() => {
    if (
      Object.keys(updatePaymentMethodState.data).length &&
      prevUpdatePaymentMethodState &&
      !Object.keys(prevUpdatePaymentMethodState.data).length
    ) {
      dispatch(getPaymentBanks({ userId: id, type: "bank" }));
      navigation.navigate("AddPaymentConfirm", {
        headerTitle: "Bank Transfer",
        titleMessage: "Set up complete!",
        subtitleMessage: "You’ve successfully added your deposit account.",
      });
    }
  }, [updatePaymentMethodState]);

  const info = route?.params?.info ?? {};
  const isDefault = _.get(info, "isDefault", false);
  const onContinue = async () => {
    setLoading(true);
    let params = {
      accountNumber: _.get(info, "accountNumber", ""),
      countryCode: "us",
      currency: "usd",
      routingNumber: _.get(info, "routingNumber", ""), // 9 digits
      accountHolderName: _.get(info, "aHolderName", ""),
      accountHolderType: _.get(info, "accountType", ""), // "company" or "individual"
    };
    const data = await createTokenWithBankOrCard({ type: "bank", params });

    if (data.success) {
      setLoading(false);
      params = {
        external_account: `${data.token.tokenId}`,
        metadata: { isDefault },
      };
      dispatch(
        updatePaymentMethod({
          userId: id,
          body: { params },
          type: "bank",
          method: "POST",
        })
      );
    } else {
      setLoading(false);
      setPayStatus({
        title: "Oops!",
        visible: true,
        message: data?.errMsg?.raw?.message
          ? data?.errMsg?.raw?.message
          : data?.errMsg,
        type: "error",
      });
    }
  };

  const values = [
    { label: "Payment Method", value: "Bank Transfer in US ($)" },
    { label: "Bank Holder Type", value: _.get(info, "accountType", "") },
    {
      label: "Account Holder Name",
      value: _.get(info, "aHolderName", ""),
    },
    { label: "Routing Number", value: _.get(info, "routingNumber", "") },
    { label: "Account Number", value: _.get(info, "accountNumber", "") },
  ];

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.blackText}>
              Confirm your account information
            </Text>
          </View>
          {values.map((item, index) => (
            <TextView
              label={item.label}
              value={item.value}
              key={`key-${index}`}
            />
          ))}
          <TouchableOpacity style={styles.checkContainer}>
            <View style={isDefault ? styles.check1 : styles.check} />
            <Text style={styles.blackBoldText}>Set as default</Text>
          </TouchableOpacity>
        </ScrollView>
        <FooterAction
          mainButtonProperties={{
            label: "Continue",
            onPress: () => {
              onContinue();
            },
          }}
        />

        {(loading || updatePaymentMethodState.isFetching) && (
          <View style={Utilities.style.activityContainer}>
            <BallIndicator size={30} color={Colors.active} />
          </View>
        )}
      </SafeAreaView>
      <SweetAlert
        title={payStatus.title}
        message={payStatus.message}
        type={payStatus.type}
        dialogVisible={payStatus.visible}
        onTouchOutside={onAlertModalTouchOutside}
        iconWidth={120}
      />
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default ConfirmBankTransferScreen;
