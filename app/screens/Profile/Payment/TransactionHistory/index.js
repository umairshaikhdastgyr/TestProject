import { CachedImage, FooterAction } from "#components";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { userSelector } from "#modules/User/selectors";
import { Utilities } from "#styles";
import { Fonts } from "#themes";
import colors from "#themes/colors";
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "./styles";
import Imgs from "#assets/images";
import { useState } from "react";
import { getTransactionHistory, getPayoutHistory } from "#modules/User/actions";
import { useEffect } from "react";
import fonts from "#themes/fonts";
import moment from "moment";
import { currencyFormatter } from "#utils";

const TransactionHistory = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const {
    user: {
      information: { id },
      userTransactions,
      userPayouts,
      isFetchUserTransactions,
      isFetchUserPayouts,
    },
  } = useSelector(userSelector);
  const [currentlySelect, setCurrentlySelect] = useState(1);
  const [userTransactionsState, setUserTransactionsState] = useState([]);
  const [userPayourState, setUserPayourState] = useState(1);

  useEffect(() => {
    dispatch(getTransactionHistory({ userId: id }));
    dispatch(getPayoutHistory({ userId: id }));
  }, []);

  useEffect(() => {
    if (userTransactions && userTransactions.length) {
      const deepCopyUserTransactions = [];
      userTransactions.forEach((item, index) => {
        if (item.orderID) {
          if (item.orderStatus == "transactioncancelled") {
            const itemDeepCopy = {
              ...item,
              orderStatus: "delivered",
            };
            deepCopyUserTransactions.push(item);
            deepCopyUserTransactions.push(itemDeepCopy);
          } else {
            deepCopyUserTransactions.push(item);
          }
        } else {
          deepCopyUserTransactions.push(item);
        }
      });
      deepCopyUserTransactions.reverse();
      setUserTransactionsState(deepCopyUserTransactions);
    }
    if (userPayouts && userPayouts.length) {
      setUserPayourState(userPayouts);
    }
  }, [userTransactions, userPayouts]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 20,
              paddingHorizontal: 10,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setCurrentlySelect(1);
              }}
              style={{
                borderBottomColor: colors.active,
                flex: 1,
                alignItems: "center",
                paddingBottom: 10,
                marginHorizontal: 20,
                borderBottomWidth: currentlySelect == 1 ? 2 : 0,
              }}
            >
              <Text
                style={{
                  fontFamily:
                    currentlySelect == 1
                      ? Fonts.family.semiBold
                      : Fonts.family.regular,
                }}
              >
                Transactions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCurrentlySelect(2);
              }}
              style={{
                borderBottomColor: colors.active,
                borderBottomWidth: currentlySelect == 2 ? 2 : 0,
                marginHorizontal: 20,
                flex: 1,
                alignItems: "center",
                paddingBottom: 10,
              }}
            >
              <Text
                style={{
                  fontFamily:
                    currentlySelect == 2
                      ? Fonts.family.semiBold
                      : Fonts.family.regular,
                }}
              >
                Cashout
              </Text>
            </TouchableOpacity>
          </View>
          {userPayourState && userPayourState.length && currentlySelect == 2 ? (
            userPayourState.map((payout, ind) => {
              return (
                <View
                  style={{
                    flexDirection: "column",
                    borderBottomColor: "#00000060",
                    borderBottomWidth: 0.5,
                    paddingBottom: 10,
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.family.semiBold,
                      fontSize: 16,
                      marginBottom: 4,
                    }}
                  >
                    {moment(payout.created * 1000).format("MMM DD, yyyy")}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text
                      style={{ fontFamily: Fonts.family.regular, fontSize: 16 }}
                    >
                      Cash out amount:{" "}
                    </Text>
                    <Text
                      style={{ fontFamily: Fonts.family.regular, fontSize: 16 }}
                    >{`$${payout.amount / 100}`}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text
                      style={{ fontFamily: Fonts.family.regular, fontSize: 16 }}
                    >
                      Status: {payout.status}
                    </Text>
                    <Text
                      style={{ fontFamily: Fonts.family.regular, fontSize: 16 }}
                    >
                      {!payout.arrival_date
                        ? "TBD"
                        : moment(payout.arrival_date * 1000).format(
                            "MMM DD,yyyy"
                          )}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{ fontFamily: Fonts.family.regular, fontSize: 16 }}
                    >
                      Trace ID:
                    </Text>
                    <Text
                      style={{ fontFamily: Fonts.family.regular, fontSize: 16 }}
                    >
                      {" "}
                      {payout.id}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : userTransactionsState &&
            userTransactionsState.length &&
            currentlySelect == 1 ? (
            userTransactionsState.map((transaction, ind) => {
              if (transaction.orderID) {
                return (
                  <View
                    key={"trans_" + ind}
                    style={{
                      width: "100%",
                      borderBottomWidth: 0.7,
                      borderBottomColor: "#E8E8E8",
                      paddingBottom: 10,
                      marginTop: 10,
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        alignItems: "flex-start",
                        borderRadius: 10,
                        overflow: "hidden",
                      }}
                    >
                      <CachedImage
                        source={{
                          uri: transaction.productInfo.image,
                        }}
                        style={{
                          width: 55,
                          height: 55,
                          borderWidth: 1,
                          borderColor: "#DADADA",
                          borderRadius: 20,
                        }}
                        resizeMode={"stretch"}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        paddingLeft: 15,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#313334",
                          fontFamily: fonts.family.semiBold,
                        }}
                      >
                        {transaction.type == "buy"
                          ? transaction.orderStatus == "transactioncancelled"
                            ? "Item purchased (Refund)"
                            : "Item purchased"
                          : transaction.type == "sell"
                          ? transaction.orderStatus == "transactioncancelled"
                            ? "Item Sold (Refund)"
                            : "Item Sold"
                          : "Other"}
                      </Text>
                      <Text
                        style={{
                          color: "#313334",
                          fontSize: 14,
                          fontFamily: fonts.family.regular,
                        }}
                      >
                        {moment(transaction.createdAt).format("MMM DD, YYYY")}
                      </Text>
                    </View>
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Text
                        style={{
                          color:
                            transaction.type == "buy"
                              ? transaction.orderStatus ==
                                "transactioncancelled"
                                ? colors.green
                                : colors.red
                              : transaction.type == "sell"
                              ? transaction.orderStatus ==
                                "transactioncancelled"
                                ? colors.red
                                : colors.green
                              : "#313334",
                          fontSize: 16,
                          fontFamily: fonts.family.regular,
                        }}
                      >
                        {transaction?.OrderAnalysis?.totalPaid === undefined &&
                        transaction?.OrderAnalysis?.totalRefunded === undefined
                          ? `${currencyFormatter.format(
                              parseFloat(0.0).toFixed(2)
                            )}`
                          : transaction.type == "buy"
                          ? transaction?.OrderAnalysis?.totalPaid ==
                            transaction?.OrderAnalysis?.totalRefunded
                            ? `${currencyFormatter.format(
                                parseFloat(
                                  transaction?.OrderAnalysis?.totalPaid
                                ).toFixed(2)
                              )}`
                            : `${currencyFormatter.format(
                                parseFloat(
                                  transaction?.OrderAnalysis?.totalPaid -
                                    transaction?.OrderAnalysis?.totalRefunded
                                ).toFixed(2)
                              )}`
                          : transaction.type == "sell"
                          ? `${
                              currencyFormatter.format(
                                parseFloat(
                                  transaction?.OrderAnalysis?.sellerShare
                                ).toFixed(2)
                              ) || ""
                            }`
                          : `${currencyFormatter.format(
                              parseFloat(
                                transaction?.productInfo?.price
                              ).toFixed(2)
                            )}`}
                      </Text>
                    </View>
                  </View>
                );
              } else {
                return null;
              }
            })
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ alignItems: "center" }}>
                {(!isFetchUserTransactions &&
                  currentlySelect == 1 &&
                  (userTransactions?.length == 0 ||
                    userTransactions?.length == undefined)) ||
                  (!isFetchUserPayouts &&
                    currentlySelect == 2 &&
                    (userPayouts?.length == 0 ||
                      userPayouts?.length == undefined) && (
                      <Image
                        resizeMode="contain"
                        source={Imgs.notransaction}
                        style={{ width: 40, height: 100, marginTop: 20 }}
                      />
                    ))}
                <View style={{ marginHorizontal: 20, alignItems: "center" }}>
                  <Text
                    style={{
                      fontFamily: Fonts.family.semiBold,
                      marginBottom: 10,
                    }}
                  >
                    {!isFetchUserTransactions &&
                    currentlySelect == 1 &&
                    (userTransactions?.length == 0 ||
                      userTransactions?.length == undefined)
                      ? `No transactions yet`
                      : !isFetchUserPayouts &&
                        currentlySelect == 2 &&
                        (userPayouts?.length == 0 ||
                          userPayouts?.length == undefined)
                      ? `No cashout yet`
                      : null}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.family.regular,
                      textAlign: "center",
                    }}
                  >
                    {!isFetchUserTransactions &&
                    currentlySelect == 1 &&
                    (userTransactions?.length == 0 ||
                      userTransactions?.length == undefined)
                      ? `When you have a transaction, it will be displayed here.`
                      : !isFetchUserPayouts &&
                        currentlySelect == 2 &&
                        (userPayouts?.length == 0 ||
                          userPayouts?.length == undefined)
                      ? `When you have a cash out, it will be displayed here.`
                      : null}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </KeyboardAwareScrollView>
      </SafeAreaView>

      {(isFetchUserPayouts || isFetchUserTransactions) && <ScreenLoader />}
      <SafeAreaView
        forceInset={{ bottom: "never" }}
        style={Utilities.safeAreaNotchHelper}
      />
    </>
  );
};

export default TransactionHistory;
