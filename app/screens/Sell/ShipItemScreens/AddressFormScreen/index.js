import React, { useState, useEffect, useRef, useCallback } from "react";

import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { selectOrderData } from "#modules/Orders/selectors";
import ModalSelector from "react-native-modal-selector";
import states from "#utils/us_states.json";
import { TextInputMask } from "react-native-masked-text";
import PhoneInput from "#components/PhoneInput/lib";

import {
  Icon,
  FooterAction,
  ModalPickerItem,
  ModalPicker,
  SweetAlert,
} from "#components";
import { flex, safeAreaNotchHelper, safeAreaView } from "#styles/utilities";
import { Colors, Metrics, Fonts } from "#themes";
import STATES from "./states-data";
import usePrevious from "#utils/usePrevious";
import ScreenLoader from "#components/Loader/ScreenLoader";
import {
  setReturnAddress,
  validateAddress as validateAddressAction,
} from "#modules/Orders/actions";
import { updatePostStatus as updatePostStatusAction } from "#modules/Sell/actions";
import { useActions } from "#utils";
import { selectSellData } from "#modules/Sell/selectors";
import { getPostDetail } from "#modules/Posts/actions";
import { Heading, InputText, CheckBoxSquare, Toast } from "#components";
import { selectUserData } from "#modules/User/selectors";
import { validateAddress as validateAddressApi } from "#services/apiOrders";
import {
  addAddress,
  getAddressList,
  updateAddress,
} from "#modules/User/actions";

const AddressFormScreen = ({ navigation, route }) => {
  let statePicker = null;
  const styles = StyleSheet.create({
    inputContainer: {
      marginHorizontal: 20,
      marginVertical: 18,
    },
    heading: {
      marginTop: 20,
      fontSize: 15,
      textAlign: "left",
      color: "#313334",
    },
    zipInput: {
      ...Fonts.style.homiBodyTextMedium,
      color: Colors.black,
      borderBottomWidth: 1,
      borderBottomColor: Colors.blackLight,
      paddingTop: 10,
      paddingBottom: 6,
      paddingLeft: 0,
      fontSize: 16,
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

  const actions = useActions({
    setReturnAddress,
    validateAddressAction,
    updatePostStatusAction,
    getPostDetail,
  });
  const dispatch = useDispatch();
  const { updatePostStatus } = useSelector(selectSellData());
  // const { similarPosts, nearbyPosts } = useSelector(selectPostsData());
  const { addressListState } = useSelector(selectUserData());
  const { validateAddress } = useSelector(selectOrderData());

  const prevValidateAddress = usePrevious(validateAddress);
  const [stateModal, showStateModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const prevUpdatePostStatus = usePrevious(updatePostStatus);

  const [alertContent, setAlertContent] = useState({
    title: "",
    message: "",
    type: "success",
    visible: false,
  });

  let selectedState = null;
  const existingAddress = route?.params?.address ?? null;
  const flowType = route?.params?.flowType ?? null;
  const editable = route?.params?.editable ?? false;

  const [name, setName] = useState(existingAddress?.name || "");
  const [state, setState] = useState(existingAddress?.state || "");
  const [city, setCity] = useState(existingAddress?.city || "");
  const [addressLine1, setAddressLine1] = useState(
    existingAddress?.addressLine1 || ""
  );
  const [addressLine2, setAddressLine2] = useState(
    existingAddress?.addressLine2 || ""
  );
  const [zipCode, setZipCode] = useState(existingAddress?.zipCode || "");
  const [buttonDisable, setButtonDisable] = useState(true);
  const selectedItem = route?.params?.selectedItem ?? false;
  const postDetail = route?.params?.postDetail ?? null;
  const provider = route?.params?.provider ?? null;

  const updatePost = (addressListObj) => {
    const addressObj = addressListObj.map((item) => {
      const itemObj = { ...item };
      // delete itemObj.defaultAddress;
      return itemObj;
    });
    const deliveryTypes = ["homitagshipping", "shipindependently"];
    postDetail.deliveryMethods = postDetail.DeliveryMethods;
    for (let i = 0; i < postDetail?.deliveryMethods?.length; i++) {
      postDetail.deliveryMethods[i].deliveryCustomProperties = {};
      postDetail.deliveryMethods[i].deliveryCustomProperties =
        postDetail.deliveryMethods[i].DeliveryMethodPerPost?.customProperties;
      if (deliveryTypes.includes(postDetail.deliveryMethods[i].code)) {
        postDetail.deliveryMethods[i].deliveryCustomProperties.returnAddresses =
          addressObj;
      }
    }
    actions.updatePostStatusAction({
      params: { deliveryMethods: postDetail.deliveryMethods },
      postId: postDetail.id,
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (
        updatePostStatus.data &&
        prevUpdatePostStatus &&
        !prevUpdatePostStatus.data
      ) {
        actions.getPostDetail({ postId: postDetail.id });
        setTimeout(() => {
          setLoader(false);
          navigation.goBack();
        }, 2000);
      }
    }, [updatePostStatus])
  );

  useFocusEffect(
    useCallback(() => {
      if (
        validateAddress.data &&
        prevValidateAddress &&
        !prevValidateAddress.data
      ) {
        if (!validateAddress?.data?.validAddress) {
          setAlertContent({
            title: "",
            message: "The address not found. Please check and try again.",
            type: "error",
            visible: true,
          });
          return;
        }
        const address = {
          name,
          state: validateAddress?.data?.validAddress?.state,
          city: validateAddress?.data?.validAddress?.city,
          addressLine1:
            validateAddress?.data?.validAddress?.address1 ||
            validateAddress?.data?.validAddress?.address,
          addressLine2: validateAddress?.data?.validAddress?.address2,
          country: "US",
          zipCode: validateAddress?.data?.validAddress?.zip,
          default: true,
          phoneNumber,
        };

        const addressList = addressListState?.data?.map((item) => ({
          ...item,
          default: false,
        }));

        let addressListObj = null;
        if (editable === true) {
          const { selectedIndex } = selectedItem;
          addressList[selectedIndex] = address;
          actions.setReturnAddress(addressList);
          addressListObj = addressList;
          updatePost(addressListObj);
        } else {
          actions.setReturnAddress([...addressList, address]);
          addressListObj = [...addressList, address];
          updatePost(addressListObj);
        }
      }

      if (
        validateAddress.errorMsg &&
        prevValidateAddress &&
        !prevValidateAddress.errorMsg
      ) {
        switch (validateAddress.errorMsg.trim()) {
          case "Invalid City.":
            setAlertContent({
              title: "",
              message: "The city is not valid. Please check and try again.",
              type: "error",
              visible: true,
            });
            break;
          case "Invalid State Code.":
            setAlertContent({
              title: "",
              message: "The state is not valid. Please check and try again.",
              type: "error",
              visible: true,
            });
            break;
          case "Address Not Found.":
            setAlertContent({
              title: "",
              message: "The address not found. Please check and try again.",
              type: "error",
              visible: true,
            });
            break;
          default:
            setAlertContent({
              title: "",
              message: validateAddress.errorMsg.trim(),
              type: "error",
              visible: true,
            });
            break;
        }
      }
    }, [validateAddress])
  );

  if (selectedItem) {
    const item = STATES.find((st) => st.abbreviation === selectedItem.state);
    selectedState = item && item.name;
  }

  const disableEditButton = () => {
    if (editable === true) {
      if (name !== selectedItem.name) {
        return true;
      }
      if (state !== selectedItem.state) {
        return true;
      }
      if (city !== selectedItem.city) {
        return true;
      }
      if (addressLine1 !== selectedItem.address_line_1) {
        return true;
      }
      if (addressLine2 !== selectedItem.address_line_2) {
        return true;
      }
      if (zipCode !== selectedItem.zipcode) {
        return true;
      }
      return false;
    }
    return true;
  };
  useEffect(() => {
    if (editable === true) {
      setName(selectedItem.name);
      setState(selectedItem.state);
      setCity(selectedItem.city);
      setAddressLine1(selectedItem.address_line_1);
      setAddressLine2(selectedItem.address_line_2);
      setZipCode(selectedItem.zipcode);
      setPhone(selectedItem?.phoneNumber);
    }
  }, []);
  useEffect(() => {
    if (name && state && city && addressLine1) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [name, state, city, addressLine1]);

  const isUsZipCode = (str) => {
    const regexp = /^[0-9]{5}(?:-[0-9]{4})?$/;

    if (regexp.test(str)) {
      return true;
    }
    return false;
  };

  const checkAddress = (val) => {
    const add = val.trim();
    const addArray = add.split(" ");
    const lWord = addArray[addArray.length - 1].replace(/[^a-zA-Z0-9 ]/g, "");
    addArray[addArray.length - 1] = lWord.trim();
    return addArray.join(" ");
  };

  const onSave = async () => {
    setLoader(true);
    if (zipCode && !isUsZipCode(zipCode)) {
      setAlertContent({
        title: "",
        message: "You must be enter valid Zip code.",
        type: "error",
        visible: true,
      });
      setLoader(false);
      return;
    }
    if (
      !name ||
      name?.split(" ")?.length < 2 ||
      name?.split(" ")[0]?.split("")?.length < 2 ||
      name?.split(" ")[1]?.split("")?.length < 2
    ) {
      setAlertContent({
        title: "",
        message: "You must be enter valid Name",
        type: "error",
        visible: true,
      });
      setLoader(false);
      return;
    }
    const params = {};
    const add1 = checkAddress(addressLine1);
    const add2 = checkAddress(addressLine2);
    params.address1 = add1;
    if (addressLine1) {
      params.address1 = add1;
    }
    if (addressLine2) {
      params.address2 = add2;
    }
    if (city) {
      params.city = city;
    }
    if (state) {
      params.state = state;
    }
    if (zipCode) {
      params.zip = zipCode;
    }
    let cleaned = ("" + phoneNumber).replace(/\D/g, "");
    const data = await validateAddressApi({
      provider,
      params,
    });
    if ((data?.isValid || data?.status == 200) && !editable) {
      let addressData = {
        name: name,
        address_line_1: data?.address?.address1,
        address_line_2: data?.address?.address2,
        city: data?.address?.city,
        state: data?.address?.state,
        zipcode: zipCode,
        country: data?.address?.country,
        default: addressListState?.data?.length == 0 ? true : false,
      };
      if (flowType == "ship") {
        addressData.phone = cleaned;
      }
      dispatch(addAddress(addressData));
      setTimeout(() => {
        setLoader(false);
        navigation.goBack();
      }, 1000);
    } else {
      let address = {
        name: name,
        address_line_1: add1,
        address_line_2: add2,
        city: city,
        state: state,
        zipcode: zipCode,
        country: data?.address?.country,
        default: selectedItem.default,
      };
      if (flowType == "ship") {
        address.phone = cleaned;
      }
      dispatch(
        updateAddress({
          id: selectedItem?.id,
          address,
        })
      );
      setTimeout(() => {
        setLoader(false);
        navigation.goBack();
      }, 1000);
    }

    // actions.validateAddressAction({
    //   provider,
    //   params,
    // });
    // if (editable) {
    //   setLoader(true);
    //   const getReturnAddressList = returnAddressList.map((obj, index) => {
    //     if (index == selectedItem.selectedIndex) {
    //       const updatedReturnAddress = {
    //         addressLine1: add1,
    //         addressLine2: add2,
    //         city: city,
    //         country: "US",
    //         default: selectedItem.default,
    //         name: name,
    //         phoneNumber: "",
    //         state: state,
    //         zipCode: zipCode,
    //       };
    //       setLoader(false);
    //       return updatedReturnAddress;
    //     } else {
    //       setLoader(false);
    //       return obj;
    //     }
    //   });

    //   actions.setReturnAddress(getReturnAddressList);
    //   return;
    // }
  };

  const formatPhone = (phoneNumberString) => {
    setPhoneNumber(phoneNumberString);
    let newText = "";
    let cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    for (var i = 0; i < cleaned.length; i++) {
      if (i == 0) {
        newText = "(";
      } else if (i == 3) {
        newText = newText + ") ";
      } else if (i == 6) {
        newText = newText + "-";
      }
      newText = newText + cleaned[i];
    }

    setPhone(newText);
  };

  const onAlertModalTouchOutside = () => {
    setAlertContent({
      title: "",
      message: "",
      type: "",
      visible: false,
    });
  };
  return (
    <>
      <SafeAreaView style={[flex.grow1, { backgroundColor: "#ffffff" }]}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* <SafeAreaView style={safeAreaView}> */}
          {/* <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Seller Name</Text>
            <TextInput
              placeholderTextColor={Colors.inactiveText}
              placeholder="First Name"
              style={styles.inputText}
              value={name}
              onChangeText={text => setName(text)}
            />
            {/* {errFirstName ? (
              <Text style={styles.redText}>{errFirstName}</Text>
            ) : null} 
          </View> */}
          <View style={{ padding: 20 }}>
            <Heading
              type="bold"
              style={{ fontSize: 15, textAlign: "left", color: "#313334" }}
            >
              Full Name
            </Heading>
            <InputText
              placeholder="Full Name"
              placeholderTextColor={Colors.inactiveText}
              name="name"
              value={name}
              fullWidth
              textAlign="left"
              onChangeText={(text) => setName(text)}
              onSubmitEditing={() => Keyboard.dismiss()}
              style={{ fontSize: 16, paddingLeft: 0 }}
              bottomLineColor={Colors.blackLight}
            />

            <Heading type="bold" style={styles.heading}>
              Address 1
            </Heading>
            <InputText
              placeholder="Address 1"
              placeholderTextColor={Colors.inactiveText}
              name="address_line_1"
              value={addressLine1}
              onChangeText={(text) => setAddressLine1(text)}
              fullWidth
              textAlign="left"
              onSubmitEditing={() => Keyboard.dismiss()}
              style={{ fontSize: 16, paddingLeft: 0 }}
              bottomLineColor={Colors.blackLight}
            />
            <Heading type="bold" style={styles.heading}>
              Address 2
            </Heading>
            <InputText
              placeholder="Address 2"
              placeholderTextColor={Colors.inactiveText}
              name="address_line_2"
              value={addressLine2}
              onChangeText={(text) => setAddressLine2(text)}
              fullWidth
              textAlign="left"
              onSubmitEditing={() => Keyboard.dismiss()}
              style={{ fontSize: 16, paddingLeft: 0 }}
              bottomLineColor={Colors.blackLight}
            />
            <Heading type="bold" style={styles.heading}>
              City
            </Heading>
            <InputText
              placeholder="City"
              placeholderTextColor={Colors.inactiveText}
              name="city"
              value={city}
              onChangeText={(text) => setCity(text)}
              fullWidth
              textAlign="left"
              onSubmitEditing={() => Keyboard.dismiss()}
              style={{ fontSize: 16, paddingLeft: 0 }}
              bottomLineColor={Colors.blackLight}
            />
            <Heading type="bold" style={styles.heading}>
              State
            </Heading>
            <ModalSelector
              cancelStyle={{ display: "none" }}
              optionContainerStyle={{
                marginVertical: 20,
                backgroundColor: "#FFFFFF",
              }}
              optionStyle={{ borderBottomWidth: 0, paddingVertical: 15 }}
              optionTextStyle={{
                fontFamily: "Montserrat-SemiBold",
                color: "#000000",
                textAlign: "left",
              }}
              animationType="fade"
              visible={stateModal}
              onModalClose={() => {
                showStateModal(false);
              }}
              data={states.map((a, b) => {
                return { ...a, key: b };
              })}
              initValue=""
              onChange={(item) => {
                setState(item.value);
              }}
              customSelector={
                <TouchableOpacity
                  onPress={() => {
                    showStateModal(true);
                  }}
                >
                  <InputText
                    placeholder="State"
                    placeholderTextColor={Colors.inactiveText}
                    name="city"
                    value={state}
                    fullWidth
                    textAlign="left"
                    editable={false}
                    onChangeText={(value) => handleOnChange("city", value)}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    style={{ fontSize: 16, paddingLeft: 0 }}
                    bottomLineColor={Colors.blackLight}
                  />
                </TouchableOpacity>
              }
            ></ModalSelector>

            <Heading type="bold" style={styles.heading}>
              Zip Code
            </Heading>
            <TextInputMask
              placeholder="Zip Code"
              placeholderTextColor={Colors.inactiveText}
              type="custom"
              keyboardType="numeric"
              value={zipCode}
              onChangeText={(text) => setZipCode(text)}
              options={{ mask: "99999-9999" }}
              style={styles.zipInput}
              onSubmitEditing={() => Keyboard.dismiss()}
              maxLength={5}
            />
            {flowType == "ship" ? (
              <>
                <Heading type="bold" style={styles.heading}>
                  Phone Number
                </Heading>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottomWidth: 0.5,
                  }}
                >
                  <Image
                    source={require("../../../../assets/icons/usFlagIcon.png")}
                    style={{
                      width: 25,
                      height: 25,
                      resizeMode: "contain",
                      marginRight: 10,
                    }}
                  />
                  <TextInput
                    placeholder="(###) ###-####"
                    maxLength={14}
                    style={{
                      width: "100%",
                      //textAlign: 'center',
                      fontFamily: Fonts.family.bold,
                    }}
                    keyboardType="phone-pad"
                    value={phone}
                    // new state => formateed
                    onChangeText={(number) => {
                      formatPhone(number);
                      // setErrPhone('');
                      // setIsEdit(true)
                    }}
                  />
                </View>
              </>
            ) : null}

            {/* <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Street Address 1</Text>
            <TextInput
              placeholderTextColor={Colors.inactiveText}
              placeholder="Street Address 1"
              style={styles.inputText}
              value={addressLine1}
              onChangeText={text => setAddressLine1(text)}
            />
            {/* {errFirstName ? (
              <Text style={styles.redText}>{errFirstName}</Text>
            ) : null} 
          </View> */}
            {/* <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Street Address 2</Text>
            <TextInput
              placeholderTextColor={Colors.inactiveText}
              placeholder="Street Address 2"
              style={styles.inputText}
              value={addressLine2}
              onChangeText={text => setAddressLine2(text)}
            />
            {/* {errFirstName ? (
              <Text style={styles.redText}>{errFirstName}</Text>
            ) : null} 
          </View> */}
            {/* <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              placeholderTextColor={Colors.inactiveText}
              placeholder="City"
              style={styles.inputText}
              value={city}
              onChangeText={text => setCity(text)}
            />
            {/* {errFirstName ? (
              <Text style={styles.redText}>{errFirstName}</Text>
            ) : null} 
          </View> */}

            {/* <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>State</Text>
            <ModalPicker
              placeholder="State*"
              ref={ref => {
                statePicker = ref;
              }}
              defaultValue={selectedItem && selectedState}
              onChange={value => setState(value)}
            >
              {STATES.map((state, index) => (
                <ModalPickerItem
                  onPress={() =>
                    statePicker.onSelect(state.name, state.abbreviation)
                  }
                  label={state.name}
                />
              ))}
            </ModalPicker>
            {/* <TextInput
              placeholderTextColor={Colors.inactiveText}
              placeholder="State"
              style={styles.inputText}
              value={state}
              onChangeText={(text) => setState(text)}
            /> */}
            {/* {errFirstName ? (
              <Text style={styles.redText}>{errFirstName}</Text>
            ) : null} 
          </View> */}

            {/* <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Zip Code</Text>
            <TextInput
              placeholderTextColor={Colors.inactiveText}
              placeholder="Zip Code"
              style={styles.inputText}
              value={zipCode}
              onChangeText={text => setZipCode(text)}
            />
            {errFirstName ? (
              <Text style={styles.redText}>{errFirstName}</Text>
            ) : null}
          </View> */}

            {/* </SafeAreaView> */}
          </View>
        </KeyboardAwareScrollView>
        <FooterAction
          mainButtonProperties={{
            label: editable ? "Save" : "Add address",
            //  subLabel: 'LABEL GENERATOR',
            disabled:
              (flowType == "ship" && phoneNumber.length < 14) ||
              buttonDisable ||
              !disableEditButton() ||
              validateAddress.isFetching,
            onPress: onSave,
          }}
        />
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
      <SweetAlert
        title={alertContent.title}
        message={alertContent.message}
        type={alertContent.type}
        dialogVisible={alertContent.visible}
        onTouchOutside={onAlertModalTouchOutside}
      />
      {(validateAddress.isFetching ||
        updatePostStatus.isFetching ||
        loader) && <ScreenLoader />}
    </>
  );
};

export default AddressFormScreen;
