import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  Platform,
  Modal,
  Alert,
} from "react-native";
import { BodyText } from "#components";
import Accordion from "react-native-collapsible/Accordion";
import { useSelector, useDispatch } from "react-redux";
import { Utilities } from "#styles";
import { Icon, FooterAction, Button, SweetAlert } from "#components";
import { convertNumberToCurrency } from "#utils";
import { styles } from "./styles";
import {
  getPaymentBanks,
  getPaymentCards,
  getAccountBalance,
  updatePaymentMethod,
  getUserInfo,
} from "#modules/User/actions";
import { userSelector } from "#modules/User/selectors";

import SmallLoader from "#components/Loader/SmallLoader";
import usePrevious from "#utils/usePrevious";
import { flex } from "#styles/utilities";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Fonts } from "#themes";
import colors from "#themes/colors";
import fonts from "#themes/fonts";
import ConfirmationPopup from "./ConfirmationPopup";
import {
  updateDefaultBankAccount,
  updatePaymentMethod as updatePaymentMethodAPI,
} from "#services/apiUsers";
import { currencyFormatter } from "#utils";
import { recoverAmount } from "#services/apiUsers";
import { useFocusEffect } from "@react-navigation/native";

const SECTIONS = [
  {
    title: "Cash out",
    content: [
      // { id: "2", subTitle: "Debit Card" }
    ],
  },
  {
    title: "Manage Payment Method",
    content: [
      { id: "1", subTitle: "DEPOSIT ACCOUNT" },
      { id: "2", subTitle: "CHARGE METHODS" },
    ],
  },
  {
    title: "View Transaction History",
    content: [],
  },
];

const PaymentListHeader = (section, index, isActive) => (
  <View style={styles.listHeader}>
    <Text style={styles.headerText}>{section.title}</Text>
    <Icon
      icon={isActive ? "chevron-up" : "chevron-right"}
      style={styles.arrowIcon}
    />
  </View>
);

const PaymentMethodListItem = (
  loader,
  { item, index },
  navigation,
  type,
  onEditItem
) => {
  const icon = item?.brand?.toLowerCase();
  const isDepositCard = item?.metadata?.isDepositCard === "true";
  const isABankAccount = item?.object === "bank_account";
  const isDefault = isABankAccount
    ? item?.default_for_currency
    : item?.metadata?.isDefault === "true";
  if (type === "Card" && isDepositCard) {
    return null;
  }
  if (type === "Account" && !isDepositCard && !isABankAccount) {
    return null;
  }
  if (type === "Account") {
    return (
      <View style={styles.paymentMethodItemContainer}>
        <View style={styles.paymentListSubContainer}>
          {!isABankAccount ? (
            icon === "visa" ||
            icon === "mastercard" ||
            icon === "discover" ||
            icon === "amex" ||
            icon === "paypal" ? (
              <FontAwesome
                style={{ top: -3 }}
                color="#3F5AA9"
                size={23}
                name={`cc-${icon}`}
              />
            ) : icon === "google_pay" ? (
              <MaterialCommunityIcons
                style={{ top: -3 }}
                size={23}
                name="google"
              />
            ) : (
              <FontAwesome
                style={{ top: -3 }}
                color="#3F5AA9"
                size={23}
                name={"credit-card"}
              />
            )
          ) : null}
          <View style={{ flexDirection: "column" }}>
            {item.bank_name && (
              <Text
                style={[
                  styles.subContentText,
                  {
                    fontFamily: Fonts.family.semiBold,
                    marginBottom: 5,
                  },
                ]}
              >
                {item.bank_name}
              </Text>
            )}
            <Text
              style={[
                styles.subContentText,
                {
                  fontFamily: isDefault
                    ? Fonts.family.semiBold
                    : Fonts.family.regular,
                },
              ]}
            >
              {!isDepositCard
                ? `Account **** ${item.last4}`
                : `**** ${item.last4}`}
            </Text>
            {isDefault && (
              <BodyText
                theme="medium"
                align="left"
                numberOfLines={1}
                style={{ color: "grey", left: 10, fontSize: 12 }}
              >
                {"Default"}
              </BodyText>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.editIconContainer}
          onPress={() =>
            // isDepositCard
            //   ? navigation.navigate('PaymentCard', { detail: item })
            //   : navigation.navigate('PaymentBankTransfer', {
            //       detail: item,
            //       skipPaymentOptionStep: true,
            //     })
            onEditItem()
          }
        >
          <Icon icon="edit_active" style={styles.editIcon} />
        </TouchableOpacity>
      </View>
    );
  }
  if (!isDepositCard) {
    return (
      <View style={styles.paymentMethodItemContainer}>
        <View style={styles.paymentListSubContainer}>
          {icon === "visa" ||
          icon === "mastercard" ||
          icon === "discover" ||
          icon === "amex" ||
          icon === "paypal" ? (
            <FontAwesome
              style={{ top: -3 }}
              color="#3F5AA9"
              size={23}
              name={`cc-${icon}`}
            />
          ) : icon === "google_pay" ? (
            <MaterialCommunityIcons
              style={{ top: -3 }}
              size={23}
              name="google"
            />
          ) : (
            <FontAwesome
              style={{ top: -3 }}
              color="#3F5AA9"
              size={23}
              name={"credit-card"}
            />
          )}
          <View style={{ flexDirection: "column" }}>
            {item.bank_name && (
              <Text
                style={[
                  styles.subContentText,
                  {
                    fontFamily: Fonts.family.semiBold,
                    marginBottom: 5,
                  },
                ]}
              >
                {item.bank_name}
              </Text>
            )}
            <Text
              style={[
                styles.subContentText,
                {
                  fontFamily: isDefault
                    ? Fonts.family.semiBold
                    : Fonts.family.regular,
                },
              ]}
            >
              **** {item.last4}
            </Text>
            {isDefault && (
              <BodyText
                theme="medium"
                align="left"
                numberOfLines={1}
                style={{ color: "grey", left: 10, fontSize: 12 }}
              >
                {"Default"}
              </BodyText>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.editIconContainer}
          // onPress={() => navigation.navigate('PaymentCard', { detail: item })}
          onPress={onEditItem}
        >
          <Icon icon="edit_active" style={styles.editIcon} />
        </TouchableOpacity>
      </View>
    );
  }
};

const PaymentManagementScreen = ({ navigation, route }) => {
  const [errBankTransfer, setErrBankTransfer] = useState("");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showNumberVerificationPopup, setShowVerificationNumberPopup] =
    useState(false);
  const [showUserDeactivatedPopup, setShowUserDeactivatedPopup] =
    useState(false);

  const [googleDefault, setGoogleDefault] = useState(true);
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();

  const {
    user: {
      information,
      paymentCardList,
      paymentBankList,
      accountBalanceState,
      updatePaymentMethodState,
    },
  } = useSelector(userSelector);
  const { id, phonenumbervalidated, status } = information;
  const cardList = paymentCardList?.data;
  const bankList = paymentBankList?.data;

  const check = () => {
    for (let i = 0; i < cardList?.data?.length; i++) {
      if (cardList?.data[i].metadata?.isDefault == "true") {
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

  const makeGooglePayDefault = async () => {
    var DefaultData = await cardList?.data.find(
      (item) => item?.metadata?.isDefault == "true"
    );
    await prevCardUpdate(DefaultData);
    //navigation.push("PaymentManagement")
  };

  const refreshList = () => {
    dispatch(getPaymentCards({ userId: id, type: "card" }));
    dispatch(getPaymentBanks({ userId: id, type: "bank" }));
    dispatch(getAccountBalance({ userId: id }));
  };

  const prevCardUpdate = async (DefaultData) => {
    const params = {
      address_zip: DefaultData.address_zip,
      exp_month: DefaultData.exp_month,
      exp_year: DefaultData.exp_year,
      name: DefaultData.name,
      metadata: {
        isDefault: false,
      },
    };

    updatePaymentMethodAPI({
      userId: id,
      body: { params },
      cardId: DefaultData.id,
      type: "card",
      method: "PATCH",
    }).then(() => {
      refreshList();
    });
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getUserInfo({ userId: id }));
    }, [])
  );

  useEffect(() => {
    refreshList();
  }, [id]);

  const prevUpdatePaymentMethodState = usePrevious(updatePaymentMethodState);
  const [payStatus, setPayStatus] = useState({
    title: "",
    visible: false,
    message: "",
    type: "",
  });
  useEffect(() => {
    if (
      Object.keys(updatePaymentMethodState.data).length &&
      prevUpdatePaymentMethodState &&
      !Object.keys(prevUpdatePaymentMethodState.data).length
    ) {
      // setPayStatus({
      //   title: "Success",
      //   visible: true,
      //   message: "You've successfully updated.",
      //   type: "success",
      // });
    }
  }, [prevUpdatePaymentMethodState, updatePaymentMethodState.data]);

  const [activeSections, setActiveSections] = useState([]);

  const onChangeActiveSection = (activeArray) => {
    setErrBankTransfer("");
    if (activeArray[0] == 0) {
      onPressContent(0);
      return;
    }
    if (activeArray[0] == 2) {
      navigation.navigate("TransactionHistory");
      return;
    }

    setActiveSections(activeArray);
  };

  const onAlertModalTouchOutside = () => {
    setPayStatus({
      title: "",
      visible: false,
      message: "",
      type: "",
    });
  };

  const onPressContent = (i) => {
    //testing purposes
    if (bankList?.data?.length === 0 || bankList?.length === 0) {
      setErrBankTransfer(
        "You haven't set up a bank account yet,\nplease add a bank account first to continue."
      );

      return;
    }

    if (i === 0) {
      if (status == "deactivated") {
        setShowUserDeactivatedPopup(true);
        return;
      } else if (!phonenumbervalidated) {
        setShowVerificationNumberPopup(true);
        return;
      }
      navigation.navigate("TransferOut", {
        title: "Cash Out",
        selectedIndex: i,
      });
    } else if (i === 1) {
      navigation.navigate("TransferOut", { title: "Debit Card", i });
    }
  };

  const PaymentListContent = (section, index) => {
    // if (index === 0) {
    //   console.log('pressed');
    //   //onPressContent(0);
    //   return;
    // }

    return section.content.map((item, i) => {
      const dataItem = paymentBankList?.data?.data || [];
      const dataItemx = cardList?.data || [];
      return (
        <View key={`key-${i}`} style={{ minHeight: 45 }}>
          <Text style={i === 0 ? styles.subListText1 : styles.subListText2}>
            {item.subTitle}
          </Text>
          {i == 1 && (
            <>
              <View style={styles.paymentMethodItemContainer}>
                <View
                  style={[
                    styles.paymentListSubContainer,
                    { alignItems: "flex-start" },
                  ]}
                >
                  <MaterialCommunityIcons
                    style={{ top: 3 }}
                    size={21}
                    name={Platform.OS == "android" ? "google" : "apple"}
                  />
                  <View>
                    <Text
                      style={[
                        styles.subContentText,
                        { fontFamily: Fonts.family.semiBold },
                      ]}
                    >
                      {Platform.OS == "android" ? "Google Pay" : "Apple Pay"}
                    </Text>

                    {googleDefault == true ? (
                      <Text
                        style={[
                          styles.subContentText,
                          { fontSize: 13, marginTop: 5 },
                        ]}
                      >
                        {"Default"}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles.subContentText,
                          {
                            fontSize: 13,
                            marginTop: 5,
                            textDecorationLine: "underline",
                          },
                        ]}
                        onPress={() => makeGooglePayDefault()}
                      >
                        {"Make Default"}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </>
          )}
          <FlatList
            data={i === 0 ? [...dataItem, ...dataItemx] : dataItemx}
            renderItem={(data) =>
              PaymentMethodListItem(
                loader,
                data,
                navigation,
                i === 0 ? "Account" : "Card",
                () => {
                  if (i === 0) {
                    navigation.navigate("PaymentBankTransfer", {
                      createStripeAccount: false,
                    });
                  } else {
                    setSelectedPaymentMethod(data?.item);
                    setShowMoreMenu(true);
                  }
                }
              )
            }
            keyExtractor={(_, idx) => `key-${idx}`}
            scrollEnabled={false}
            ListEmptyComponent={null}
          />
          <EmptyMessage
            type={i === 0 ? "Account" : "Card"}
            dataItem={dataItem}
          />
        </View>
      );
    });
  };

  const EmptyMessage = (type) => {
    const message =
      type.type == "Card" ? "Add Charge Method" : "Add Deposit Account";

    return (
      <TouchableOpacity
        onPress={() => {
          if (!phonenumbervalidated && type.type !== "Card") {
            setShowVerificationNumberPopup(true);
          } else {
            if (type.type == "Card") {
              navigation.navigate("PaymentCard", { showDefult: true });
              return;
            }
            if (type?.dataItem?.length) {
              navigation.navigate("PaymentBankTransfer", {
                createStripeAccount: false,
              });
              return;
            }
            navigation.navigate("PaymentBankTransfer", {
              createStripeAccount: true,
              skipPaymentOptionStep: true,
            });
          }
        }}
        style={[styles.noDataContainer]}
      >
        <Text
          style={{ color: colors.active, fontFamily: Fonts.family.semiBold }}
        >
          {message}
        </Text>
      </TouchableOpacity>
    );
  };

  const onActionSheetMore = (option) => {
    const isBankAccount = selectedPaymentMethod?.object === "bank_account";
    if (option === "Set as Default") {
      setLoader(true);
      let params = {};
      if (isBankAccount) {
        params = {
          account_holder_name: selectedPaymentMethod.account_holder_name,
          account_holder_type: selectedPaymentMethod.account_holder_type,
          metadata: {
            isDefault: true,
          },
        };
        // dispatch(
        //   updatePaymentMethod({
        //     userId: id,
        //     body: { params },
        //     bankAccountId: selectedPaymentMethod.id,
        //     type: 'bank',
        //     method: 'PATCH',
        //   }),
        // );
        updateDefaultBankAccount({
          userId: id,
          method: "POST",
          body: null,
          bankAccountId: selectedPaymentMethod.id,
        }).then(() => {
          refreshList();
        });
      } else {
        const data = cardList?.data;
        const getDefaultCard = data?.filter(
          (item) => item?.metadata?.isDefault == "true"
        );
        params = {
          address_zip: selectedPaymentMethod.address_zip,
          exp_month: selectedPaymentMethod.exp_month,
          exp_year: selectedPaymentMethod.exp_year,
          name: selectedPaymentMethod.name,
          metadata: {
            isDefault: true,
          },
        };
        updatePaymentMethodAPI({
          userId: id,
          body: { params },
          cardId: selectedPaymentMethod.id,
          type: "card",
          method: "PATCH",
        }).then(() => {
          params = {
            address_zip: getDefaultCard[0]?.address_zip,
            exp_month: getDefaultCard[0]?.exp_month,
            exp_year: getDefaultCard[0]?.exp_year,
            name: getDefaultCard[0]?.name,
            metadata: {
              isDefault: false,
            },
          };
          updatePaymentMethodAPI({
            userId: id,
            body: { params },
            cardId: getDefaultCard[0]?.id,
            type: "card",
            method: "PATCH",
          }).then(() => {
            refreshList();
            setLoader(false);
          });
        });
      }
    }
    if (option === "Delete") {
      setShowDeletePopup(true);
    }
    setShowMoreMenu(false);
  };

  const processMoreOptions = () => {
    const withDeleteOption = ["Set as Default", "Delete", "Cancel"];
    const onlyCancel = ["Delete", "Cancel"];
    const isBankAccount = selectedPaymentMethod?.object === "bank_account";
    const isDefault = isBankAccount
      ? selectedPaymentMethod?.default_for_currency
      : selectedPaymentMethod?.metadata?.isDefault === "true";
    return isDefault ? onlyCancel : withDeleteOption;
  };

  const renderOptionsModal = () => {
    return (
      <Modal
        animationType="fade"
        visible={showMoreMenu}
        onRequestClose={() => {
          setShowMoreMenu(false);
        }}
        transparent
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000080",
            justifyContent: "flex-end",
          }}
        >
          {processMoreOptions().map((opt, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={"moreBtn" + index}
              onPress={() => {
                onActionSheetMore(opt);
              }}
              style={{
                width: "100%",
                padding: 20,
                backgroundColor: "#fff",
                borderBottomWidth: 1,
                marginTop: opt.toLowerCase() === "cancel" ? 4 : 0,
                borderBottomColor: "#efefef",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: fonts.family.semiBold,
                  color: opt.toLowerCase() === "cancel" ? "#F56565" : "#007AFF",
                }}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    );
  };

  const onPressDelete = () => {
    const isBankAccount = selectedPaymentMethod?.object === "bank_account";
    if (isBankAccount) {
      dispatch(
        updatePaymentMethod({
          userId: id,
          bankAccountId: selectedPaymentMethod.id,
          type: "bank",
          method: "DELETE",
        })
      );
      refreshList();
    } else {
      dispatch(
        updatePaymentMethod({
          userId: id,
          cardId: selectedPaymentMethod.id,
          type: "card",
          method: "DELETE",
        })
      );
      refreshList();
    }
  };

  const navigateToNumberVerification = () => {
    navigation.navigate("EditPersonalInfo");
  };

  const LoaderComponent = () => {
    return (
      <View
        style={{
          position: "absolute",
          justifyContent: "center",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 99,
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      >
        <SmallLoader />
      </View>
    );
  };

  return (
    <>
      {paymentCardList.isFetching ||
        paymentBankList.isFetching ||
        (loader && <LoaderComponent />)}
      {accountBalanceState.isFetching && <LoaderComponent />}

      <SafeAreaView style={styles.container}>
        {renderOptionsModal()}
        <ConfirmationPopup
          isVisible={showDeletePopup}
          title="Delete Payment method"
          description={`Are you sure you want to delete this ${
            selectedPaymentMethod?.object === "card" ? "card" : "account"
          }? This action can’t be undone.`}
          onClose={() => setShowDeletePopup(false)}
          primaryButtonText="Delete"
          secondaryButtonText="Cancel"
          onPressPrimaryButton={() => onPressDelete()}
          onPressSecondaryButton={() => setShowDeletePopup(false)}
        />
        <ConfirmationPopup
          isVisible={showUserDeactivatedPopup}
          title="Account Deactivated!"
          description="Your account is deactivated by Homitag. You can't cashout the amount. Please repay your negative balance and add charge method to reactivate your account."
          onClose={() => {
            setShowUserDeactivatedPopup(false);
          }}
          primaryButtonText="OKAY"
          onPressPrimaryButton={() => {
            setShowUserDeactivatedPopup(false);
          }}
        />
        <ConfirmationPopup
          isVisible={showNumberVerificationPopup}
          title="Verification required!"
          description="Please verify your phone number to access this feature"
          onClose={() => setShowVerificationNumberPopup(false)}
          primaryButtonText="Verify Phone Number"
          onPressPrimaryButton={navigateToNumberVerification}
        />
        <View style={styles.headerContainer}>
          {!accountBalanceState.isFetching ? (
            <View style={{ width: "90%" }}>
              <Text style={styles.currencyText}>
                {accountBalanceState.data
                  ? `${currencyFormatter.format(
                      accountBalanceState?.data?.instant_available[0].amount /
                        100 +
                        parseFloat(accountBalanceState?.data?.localBalance)
                    )}`
                  : `${currencyFormatter.format(0)}`}
              </Text>
              {accountBalanceState?.data?.availableBalance ? (
                <Text style={styles.pendingText}>
                  {`Pending amount ${currencyFormatter.format(
                    parseFloat(accountBalanceState?.data?.availableBalance)
                  )}\n`}{" "}
                  {!bankList?.data?.length ? (
                    <Text>
                      {" "}
                      please{" "}
                      <Text
                        onPress={() =>
                          navigation.navigate("PaymentBankTransfer", {
                            createStripeAccount: true,
                            skipPaymentOptionStep: true,
                          })
                        }
                        style={{ textDecorationLine: "underline" }}
                      >
                        add deposit method
                      </Text>{" "}
                      to receive funds.{" "}
                    </Text>
                  ) : null}
                </Text>
              ) : null}
              {accountBalanceState?.data?.localBalance < -0.5 ||
              accountBalanceState?.data?.instant_available[0].amount < -0.5 ? (
                <Button
                  style={{ marginVertical: 20, marginBottom: 30 }}
                  disabled={false}
                  label="Repay Amount"
                  onPress={async () => {
                    const res = await recoverAmount({ userId: id });
                    if (res?.success && res?.status == 200) {
                      setPayStatus({
                        title: "Success",
                        visible: true,
                        message: "You've paid due amount",
                        type: "success",
                        done: () => {
                          refreshList();
                          onAlertModalTouchOutside();
                        },
                      });
                      // Alert.alert("Success", "You've paid due amount", [
                      //   {
                      //     text: "Okay",
                      //     onPress: () => {
                      //       refreshList();
                      //     },
                      //   },
                      // ]);
                    } else {
                      setPayStatus({
                        title: "Failed",
                        visible: true,
                        message:
                          "Please check if you have added cards into charge method and have sufficient balance.",
                        type: "error",
                        done: onAlertModalTouchOutside,
                      });
                      // Alert.alert(
                      //   "Failed",
                      //   "Please check if you have added cards into charge method and have sufficient balance.",
                      //   [
                      //     {
                      //       text: "Okay",
                      //       onPress: () => {
                      //         refreshList();
                      //       },
                      //     },
                      //   ]
                      // );
                    }
                  }}
                  size="small"
                  fullWidth
                />
              ) : null}
            </View>
          ) : null}
        </View>
        <ScrollView>
          <Accordion
            sections={SECTIONS}
            activeSections={activeSections}
            renderHeader={PaymentListHeader}
            renderContent={PaymentListContent}
            onChange={onChangeActiveSection}
            touchableComponent={TouchableOpacity}
            sectionContainerStyle={styles.sectionContainerStyle}
          />
          <View style={[flex.grow1, flex.justifyContentCenter]}>
            {errBankTransfer !== "" && (
              <Text style={styles.warningText}>{errBankTransfer}</Text>
            )}
          </View>
        </ScrollView>
        <SweetAlert
          onDone={payStatus.done}
          title={payStatus.title}
          message={payStatus.message}
          type={payStatus.type}
          dialogVisible={payStatus.visible}
          onTouchOutside={() => onAlertModalTouchOutside()}
          // onTouchOutside={onAlertModalTouchOutside}
          iconWidth={120}
        />
      </SafeAreaView>
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default PaymentManagementScreen;
