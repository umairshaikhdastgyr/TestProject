import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Platform,
  Modal,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useActions } from "#utils";
import { userSelector } from "#modules/User/selectors";
import colors from "#themes/colors";
import fonts from "#themes/fonts";
import Ionicons from "react-native-vector-icons/MaterialIcons";
import { getPaymentCards } from "#modules/User/actions";
import ScreenLoader from "#components/Loader/ScreenLoader";
import PaymentMethodTile from "#screens/Buy/PaymentScreen/payment-method-tile";

const PaymentMethods = ({
  closeModal,
  closeBoostScreen,
  visible,
  onPaymentSelect,
  navigation,
  boost,
  boostItem
}) => {
  const {
    user: {
      userBuyListState,
      userSellListState,
      information,
      paymentCardList,
      paymentMethodDefault,
    },
  } = useSelector(userSelector);
  const [googleDefault, setGoogleDefault] = useState(true);
  /* Actions */
  const actions = useActions({
    getPaymentCards,
  });
  useEffect(() => {
    actions.getPaymentCards({ userId: information?.id, type: "card" });
    onPaymentSelect({
      default: Platform.OS == "android" ? "google-pay" : "apple-pay",
      icon: Platform.OS == "android" ? "google_pay" : "apple_pay",
      state: Platform.OS == "android" ? "googlePay" : "applePay",
      title: Platform.OS == "android" ? "Google pay" : "Apple pay",
      selectedCard: { id: null },
    });
  }, []);

  const check = () => {
    for (let i = 0; i < paymentCardList?.data?.data?.length; i++) {
      if (paymentCardList?.data?.data[i].metadata.isDefault == 'true') {
        setGoogleDefault(false);
        break;
      } else {
        setGoogleDefault(true);
      }
    }
  };

  useEffect(() => {
    check();
  }, [paymentCardList.data]);

  return (
    <Modal animationType="slide" transparent visible={visible} style={{}}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <View style={styles.header_view}>
          <Text></Text>
          <Text
            style={{
              marginLeft: 30,
              fontFamily: fonts.family.semiBold,
              fontSize: 18,
              fontWeight: "500",
            }}
          >
            Payment Methods
          </Text>
          <Ionicons
            onPress={() => {
              closeModal();
            }}
            name="close"
            size={25}
            color="#969696"
          />
        </View>
        <View>
          {paymentCardList?.isFetching ? (
            <View style={{ marginTop: 40 }}>
              <ScreenLoader />
            </View>
          ) : (
            <>
              <View>
                <PaymentMethodTile
                  onPress={() => {
                    onPaymentSelect({
                      default:
                        Platform.OS == "android" ? "google-pay" : "apple-pay",
                      icon:
                        Platform.OS == "android" ? "google_pay" : "apple_pay",
                      state:
                        Platform.OS == "android" ? "googlePay" : "applePay",
                      title:
                        Platform.OS == "android" ? "Google pay" : "Apple pay",
                      selectedCard: { id: null },
                    });
                    closeModal();
                  }}
                  item={{
                    default:
                      Platform.OS == "android" ? "google-pay" : "apple-pay",
                    icon: Platform.OS == "android" ? "google_pay" : "apple_pay",
                    state: Platform.OS == "android" ? "googlePay" : "applePay",
                    title:
                      Platform.OS == "android" ? "Google pay" : "Apple pay",
                    selectedCard: { id: null },
                  }}
                  title={Platform.OS == "android" ? "Google pay" : "Apple pay"}
                  icon={null}
                  type="no-default"
                  tile={null}
                  googleDefault={googleDefault}
                />
              </View>
              {paymentCardList?.data?.data?.map((item, index) => {
                return (
                  <View key={index}>
                    <PaymentMethodTile
                      onPress={() => {
                        onPaymentSelect({
                          selectedCard: item,
                          state: item.id,
                          default: "card",
                          icon: item?.brand?.toLowerCase(),
                          title: `**** ${item.last4}`,
                        });
                        closeModal();
                      }}
                      item={item}
                      title={`**** ${item.last4}`}
                      icon={
                        item?.brand.toLowerCase()
                          ? item?.brand.toLowerCase()
                          : "credit-card"
                      }
                      type="no-default"
                      tile={item.id}
                    />
                  </View>
                );
              })}
            </>
          )}
          {
            <PaymentMethodTile
              onPress={() => {
                closeModal();
                closeBoostScreen();
                navigation.navigate("PaymentCreateScreen", {
                  fromScreen: "payment",
                  boost: boost,
                  boostItem
                });
              }}
              title="Add a credit/debit card"
              icon="credit-card"
              type="no-default"
              showSideArrow={true}
            />
          }
        </View>
        {/* <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 30 }}>
          <Button
            label={"Select Payment"}
            disabled={selectedBoost == null}
            size="large"
            onPress={() => {}}
            style={{ marginHorizontal: 10 }}
          />
        </View> */}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header_view: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    elevation: 6,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row",
  },
});

export default PaymentMethods;
