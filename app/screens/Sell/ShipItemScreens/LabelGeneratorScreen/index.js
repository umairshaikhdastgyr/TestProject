import { FooterAction, Icon, SweetAlert } from "#components";
import ScreenLoader from "#components/Loader/ScreenLoader";
import {
  createOffer,
  getOrders,
  getShippingLabel,
  setReturnAddress,
} from "#modules/Orders/actions";
import { selectOrderData } from "#modules/Orders/selectors";
import { updatePostStatus as updatePostStatusAction } from "#modules/Sell/actions";
import {
  addAddress,
  postBuyerDetail as postBuyerDetailApi,
  updateAddress,
} from "#modules/User/actions";
import { selectUserData } from "#modules/User/selectors";
import { success } from "#modules/utils";
import { flex, safeAreaNotchHelper } from "#styles/utilities";
import colors from "#themes/colors";
import { useActions } from "#utils";
import usePrevious from "#utils/usePrevious";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import styles from "./styles";
import { all, call, put, takeLatest, select } from "redux-saga/effects";
import { useFocusEffect } from "@react-navigation/native";

const LabelGeneratorScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const handleCloseActionLocal = () => {
    navigation.navigate("OrderStatus");
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ handleCloseAction: handleCloseActionLocal });
    }, [])
  );

  const actions = useActions({
    setReturnAddress,
    getShippingLabel,
    postBuyerDetailApi,
    createOffer,
    getOrders,
    updatePostStatusAction,
  });

  const { postBuyerDetail, addressListState } = useSelector(selectUserData());
  const { shippingLabel, order } = useSelector(selectOrderData());
  const postDetail = route?.params?.postDetail ?? null;
  const provider = route?.params?.provider ?? null;
  const orderData = route?.params?.orderData ?? null;

  if (!addressListState?.data || !addressListState?.data?.length) {
    navigation.navigate("AddressForm", {
      postDetail,
      provider,
      flowType: "ship",
    });
  }

  useEffect(() => {
    actions.postBuyerDetailApi({
      userId: orderData.buyerId,
    });
  }, []);
  const [selectedItem, setSelectedItem] = useState(null);
  const [alertContent, setAlertContent] = useState({
    title: "",
    message: "",
    type: "success",
    visible: false,
  });

  const onAlertModalTouchOutside = () => {
    setAlertContent({
      title: "",
      message: "",
      type: "",
      visible: false,
    });
  };

  const setActive = (indexObj) => {
    const addressArr = addressListState?.data?.map((item, index) => ({
      ...item,
      default: indexObj === index ? true : false,
    }));
    const address = addressArr?.filter((obj) => obj?.default);

    dispatch(
      updateAddress({
        id: address[0]?.id,
        address: {
          name: address[0]?.name,
          address_line_1: address[0]?.address_line_1,
          address_line_2: address[0]?.address_line_2,
          city: address[0]?.city,
          state: address[0]?.state,
          zipcode: address[0]?.zipcode,
          country: address[0]?.country,
          default: address[0]?.default,
        },
      })
    );
    setSelectedItem({ ...addressArr[indexObj], selectedIndex: indexObj });
    actions.setReturnAddress(addressArr);
    navigation.goBack();
  };

  // const checkIfAddressSelected = () => {
  //   const selectedReturnAddress = returnAddressList.find(
  //     (returnAddress) => returnAddress?.default
  //   );
  //   if (selectedReturnAddress) {
  //     return false;
  //   }
  //   return true;
  // };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.radioButton}
      onPress={() => setActive(index)}
    >
      {/* <View style={item.defaultAddress ? styles.activeCircle : styles.circle} /> */}
      <View style={styles.addressDetailContainer}>
        <Text
          style={[
            styles.addressName,
            { color: item.default ? colors.green : colors.black },
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.adressDetail,
            { color: item.default ? colors.green : colors.black },
          ]}
        >
          {`${item.address_line_1 || ""} ${item.address_line_2 || ""} \n${
            item.city || ""
          }, ${item.state || ""} ${item.zipcode || ""}`}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("AddressForm", {
            selectedItem: { ...item, selectedIndex: index },
            postDetail,
            editable: true,
            provider,
            flowType: "ship",
          })
        }
      >
        <Icon
          icon={item.defaultAddress ? "edit_active" : "edit_grey"}
          style={styles.editIcon}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <>
      <SafeAreaView style={flex.grow1}>
        <View style={[flex.grow1]}>
          <ScrollView
            contentContainerStyle={styles.addressListConatiner}
            showsVerticalScrollIndicator={false}
          >
            <FlatList
              data={addressListState?.data}
              renderItem={renderItem}
              keyExtractor={(item) => item[0]}
              scrollEnabled={false}
            />
            <View>
              <View style={styles.addressButtonContainer}>
                <TouchableOpacity
                  style={[styles.addressButton]}
                  onPress={() => {
                    navigation.navigate("AddressForm", {
                      postDetail,
                      provider,
                      flowType: "ship",
                    });
                  }}
                >
                  <Text style={styles.addressButtonText}>ADD AN ADDRESS</Text>
                  <Icon icon="add" style={styles.iconAddStyle} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
        {/* <FooterAction
          mainButtonProperties={{
            label: "Done",
            disabled: checkIfAddressSelected(),
            onPress: () => {
              navigation.goBack();
            },
          }}
        /> */}
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
      <SweetAlert
        title={alertContent.title}
        message={alertContent.message}
        type={alertContent.type}
        dialogVisible={alertContent.visible}
        onTouchOutside={onAlertModalTouchOutside}
      />
      {(postBuyerDetail.isFetching ||
        shippingLabel.isFetching ||
        order.isFetching) && <ScreenLoader />}
    </>
  );
};

export default LabelGeneratorScreen;
