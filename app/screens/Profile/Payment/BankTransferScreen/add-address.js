import {
  CheckBoxSquare,
  FooterAction,
  Heading,
  InputText,
  SweetAlert,
} from "#components";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { validateAddress as validateAddressAction } from "#modules/Orders/actions";
import { Colors, Fonts } from "#themes";
import states from "#utils/us_states.json";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import React, { useEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Text,
  ScrollView,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import ModalSelector from "react-native-modal-selector";
import STATES from "./states-data";
import { styles } from "./styles";
import { Icon, BodyText } from "#components";
import {
  getAddressList,
  addAddress,
  deleteAddress,
  updateAddress,
} from "#modules/User/actions";
import { selectUserData } from "#modules/User/selectors";
import Ionicons from "react-native-vector-icons/MaterialIcons";
import fonts from "#themes/fonts";
import colors from "#themes/colors";
import { apiModels } from "#services/apiModels";
import { ActivityIndicator } from "react-native-paper";

const AddressElement = ({
  leftLabel,
  title,
  txtType,
  icon,
  onPress,
  type,
  leftLabelTop,
}) => (
  <View
    style={{
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 10,
      width: "100%",
    }}
  >
    <Text style={styles.leftBoldText}>{leftLabel}</Text>
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
      }}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View style={{}}>
          <BodyText align="left" style={styles.rightBoldTextAnother}>
            {leftLabelTop}
          </BodyText>
          <BodyText numberOfLines={3} theme="large" align="left">
            {title}
          </BodyText>
        </View>
      </View>
      <View style={styles.arrowContainer}>
        <Icon size="medium-small" icon="chevron-right" />
      </View>
    </TouchableOpacity>
  </View>
);

const AddressForm = ({ address, setAddress }) => {
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
    addressButtonContainer: {
      flexDirection: "row",
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: "#E8E8E8",
      paddingVertical: 20,
    },
    addressButton: {
      width: "100%",
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    addressButtonText: {
      fontFamily: "Montserrat-SemiBold",
      fontSize: 14,
      fontWeight: "600",
      color: "#000000",
      lineHeight: 18,
      textAlign: "center",
    },
    iconAddStyle: {
      width: 17.5,
      height: 17.5,
      marginRight: 5,
    },
    iconEditStyle: {
      width: 16,
      height: 20,
      marginRight: 5,
    },
    radioButton: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: "#E8E8E8",
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
    addressDetailContainer: {
      flex: 1,
      borderRadius: 10,
      marginVertical: 10,
      borderRadius: 10,
    },
    addressName: {
      fontFamily: "Montserrat-SemiBold",
      fontSize: 15,
      color: "#313334",
      fontWeight: "600",
      marginTop: 12,
    },
    adressDetail: {
      fontFamily: "Montserrat-Regular",
      fontSize: 13,
      color: "#313334",
      lineHeight: 18,
      marginBottom: 5,
      marginTop: 3,
      marginRight: 50,
    },
    circle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.gray,
      marginRight: 12,
    },
    text_head: {
      fontFamily: "Montserrat-SemiBold",
      fontSize: 15,
      color: "#313334",
      lineHeight: 18,
      fontWeight: "600",
      // textAlign: 'center',
    },
    text_head_container: {
      // width,
      marginVertical: 20,
    },
  });
  const { addressListState } = useSelector(selectUserData());

  const [stateModal, showStateModal] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isDefault, setDefault] = useState(false);

  const [alertContent, setAlertContent] = useState({
    title: "",
    message: "",
    type: "success",
    visible: false,
  });

  let selectedState = null;
  const existingAddress = address;

  const editable = false;
  const [name, setName] = useState(existingAddress?.name || "");
  const [state, setState] = useState(existingAddress?.state || "");
  const [city, setCity] = useState(existingAddress?.city || "");
  const [showAddUI, setshowAddUI] = useState(false);
  const [loader, setLoader] = useState(false);
  const [addressLine1, setAddressLine1] = useState(
    existingAddress?.addressLine1 || ""
  );
  const [addressLine2, setAddressLine2] = useState(
    existingAddress?.addressLine2 || ""
  );
  const [zipCode, setZipCode] = useState(existingAddress?.zipCode || "");
  const [addressData, setAddressData] = useState({});
  const selectedItem = address;
  const provider = "ups";
  const [showShippingModal, setshowShippingModal] = useState(false);

  const showEditModal = (selectItem) => {
    setshowAddUI(true);
    setAddressData(selectItem);
  };

  const resetStates = () => {
    setName("");
    setState("");
    setCity("");
    setAddressLine1("");
    setAddressLine2("");
    setZipCode("");
  };

  useEffect(() => {
    if (
      !addressListState.isFetching &&
      addressListState.data?.length &&
      !currentAddress
    ) {
      const defaultAddr = addressListState.data.find(
        (element) => element.default
      );
      if (defaultAddr) {
        setCurrentAddress(defaultAddr);
        setAddress(defaultAddr);
      }
    }
  }, [addressListState]);


  const setActive = (item,indexObj) => {
    const addressArr = addressListState?.data?.map((item, index) => ({
      ...item,
      default: indexObj === index ? true : false,
    }));
    const address = addressArr?.filter(obj => obj?.default);

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
    setCurrentAddress(item);
    setAddress(item);
    setTimeout(() => {
      setshowShippingModal(false);
    }, 1000);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.radioButton}
      onPress={() => {
        setActive(item, index )
      }}
    >
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
          {`${item.addressLine1 || item.address_line_1 || ""} ${
            item.addressLine2 || item.address_line_2 || ""
          } \n${item.city || ""}, ${item.state || ""} ${
            item.zipCode || item.zipcode || ""
          }`}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          showEditModal({ editable: true, selectItem: item });
        }}
      >
        <Icon
          icon={item.default ? "edit_active" : "edit_grey"}
          style={styles.editIcon}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (selectedItem) {
    const item = STATES.find((st) => st.abbreviation === selectedItem.state);
    selectedState = item && item.name;
  }
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAddressList());
    if (addressData?.editable === true) {
      setName(addressData?.selectItem?.name);
      setState(addressData?.selectItem?.state);
      setCity(addressData?.selectItem?.city);
      setAddressLine1(addressData?.selectItem?.address_line_1);
      setAddressLine2(addressData?.selectItem?.address_line_2);
      setZipCode(addressData?.selectItem?.zipcode);
      setDefault(addressData?.selectItem?.default);
    }
  }, [addressData]);

  const isUsZipCode = (str) => {
    const regexp = /^[0-9]{5}(?:-[0-9]{4})?$/;

    if (regexp.test(str)) {
      return true;
    }
    return false;
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

    let addressToValidate = {
      address1: addressLine1,
      address2: addressLine1,
      city: city,
      state: state,
      zip: zipCode,
    };

    let checkAddress = await apiModels(
      "orders/shipping/validateAddress",
      "POST",
      {
        params: addressToValidate,
      }
    );

    if (
      checkAddress?.usps?.[0]?.validAddress === null &&
      checkAddress?.fedex?.[0]?.validAddress === null &&
      checkAddress?.ups?.[0]?.validAddress === null
    ) {
      setAlertContent({
        title: "",
        message: "Please, insert a valid address.",
        type: "error",
        visible: false,
      });
      return;
    } else {
      const addressResult = {
        ...checkAddress?.fedex?.[0],
        ...checkAddress?.ups?.[0],
        ...checkAddress?.usps?.[0],
      };

      dispatch(
        addAddress({
          name: name,
          address_line_1: addressResult.address1 ?? addressLine1,
          address_line_2: addressResult.address2 ?? addressLine2,
          city: city,
          state: state,
          zipcode: addressResult.zip ?? zipCode,
          country: "USA",
          default: addressListState?.data?.length == 0 ? true : isDefault,
        })
      );
    }
    setshowAddUI(false);
    setLoader(false);
  };

  const onUpdate = async () => {
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

    let addressToValidate = {
      address1: addressLine1,
      address2: addressLine1,
      city: city,
      state: state,
      zip: zipCode,
    };

    let checkAddress = await apiModels(
      "orders/shipping/validateAddress",
      "POST",
      {
        params: addressToValidate,
      }
    );

    if (
      checkAddress?.usps?.[0]?.validAddress === null &&
      checkAddress?.fedex?.[0]?.validAddress === null &&
      checkAddress?.ups?.[0]?.validAddress === null
    ) {
      setAlertContent({
        title: "",
        message: "Please, insert a valid address.",
        type: "error",
        visible: false,
      });
      return;
    } else {
      const addressResult = {
        ...checkAddress?.fedex?.[0],
        ...checkAddress?.ups?.[0],
        ...checkAddress?.usps?.[0],
      };

      dispatch(
        updateAddress({
          id: addressData?.selectItem?.id,
          address: {
            name: name,
            address_line_1: addressLine1,
            address_line_2: addressLine2,
            city: city,
            state: state,
            zipcode: zipCode,
            country: "USA",
            default: isDefault,
          },
        })
      );
    }

    setshowAddUI(false);
    setLoader(false);
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
      <AddressElement
        title={
          currentAddress
            ? `${currentAddress.address_line_1} ${currentAddress.address_line_2} \n${currentAddress.city}, ${currentAddress.state} ${currentAddress.zipcode}`
            : ""
        }
        leftLabelTop={currentAddress?.name}
        onPress={() => {
          setshowShippingModal(true);
        }}
        leftLabel={"Billing Address"}
      />
      <Modal animationType="slide" visible={showShippingModal} transparent>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1}}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {showAddUI ? (
              <View style={{ flex: 1, justifyContent: "space-between" }}>
                <View
                  style={{
                    elevation: 3,
                    backgroundColor: "#ffffff",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 15,
                    flexDirection: "row",
                  }}
                >
                  <Ionicons
                    onPress={() => {
                      setshowAddUI(false);
                    }}
                    name="arrow-back"
                    size={25}
                    color="#969696"
                  />
                  <Text
                    style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}
                  >
                    {addressData?.editable === true
                      ? "Edit Address"
                      : "Add Address"}
                  </Text>
                  {addressData?.editable &&
                  !isDefault &&
                  !addressData?.selectItem?.default ? (
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(deleteAddress(addressData?.selectItem?.id));
                        setTimeout(() => {
                          setCurrentAddress(null);
                          setshowAddUI(false);
                        }, 500);
                      }}
                    >
                      <Image
                        source={require("../../../../assets/icons/delete/delete.png")}
                        style={{
                          width: 24,
                          height: 24,
                          resizeMode: "contain",
                        }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Text style={{ color: "white" }}>{" a"}</Text>
                  )}
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ padding: 20, flex: 1 }}>
                    <Heading
                      type="bold"
                      style={{
                        fontSize: 15,
                        textAlign: "left",
                        color: "#313334",
                      }}
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
                      optionStyle={{
                        borderBottomWidth: 0,
                        paddingVertical: 15,
                      }}
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
                            onChangeText={(value) =>
                              handleOnChange("city", value)
                            }
                            onSubmitEditing={() => Keyboard.dismiss()}
                            style={{ fontSize: 16, paddingLeft: 0 }}
                            bottomLineColor={Colors.blackLight}
                          />
                        </TouchableOpacity>
                      }
                    />

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
                    {addressListState?.data?.length == 0 ? null : (
                      <CheckBoxSquare
                        label="Set as default"
                        active={isDefault}
                        onChange={() => setDefault(!isDefault)}
                        containerStyle={{
                          marginTop: 28,
                        }}
                      />
                    )}
                  </View>
                </ScrollView>

                {loader ? (
                  <FooterAction
                    mainButtonProperties={{
                      label: <ActivityIndicator size="small" color="#fff" />,
                      //  subLabel: 'LABEL GENERATOR',
                      disabled: false,
                      onPress: addressData.editable ? onUpdate : onSave,
                    }}
                  />
                ) : (
                  <FooterAction
                    mainButtonProperties={{
                      label: addressData.editable
                        ? "Update address"
                        : "Add address",
                      //  subLabel: 'LABEL GENERATOR',
                      disabled: false,
                      onPress: addressData.editable ? onUpdate : onSave,
                    }}
                  />
                )}

                <SweetAlert
                  title={alertContent.title}
                  message={alertContent.message}
                  type={alertContent.type}
                  dialogVisible={alertContent.visible}
                  onTouchOutside={onAlertModalTouchOutside}
                />
                {false && <ScreenLoader />}
              </View>
            ) : (
              <SafeAreaView>
                <View
                  style={{
                    elevation: 3,
                    backgroundColor: "#ffffff",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 15,
                    flexDirection: "row",
                  }}
                >
                  <Ionicons
                    onPress={() => {
                      setshowShippingModal(false);
                    }}
                    name="arrow-back"
                    size={25}
                    color="#969696"
                  />
                  <Text
                    style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}
                  >
                    Address List
                  </Text>
                  <Text style={{ color: "white" }}>{" a"}</Text>
                </View>
                <View style={{ paddingHorizontal: 20 }}>
                  {!addressListState.isFetching &&
                    addressListState?.data?.length > 0 && (
                      <FlatList
                        data={addressListState?.data}
                        contentContainerStyle={{ flexGrow: 1 }}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item[0] + index}
                        scrollEnabled={false}
                      />
                    )}
                  <View style={styles.addressButtonContainer}>
                    <TouchableOpacity
                      style={[styles.addressButton]}
                      onPress={() => {
                        resetStates();
                        addressData.editable = false;
                        setAddressData(addressData);
                        setshowAddUI(true);
                      }}
                    >
                      <Text style={styles.addressButtonText}>
                        ADD AN ADDRESS
                      </Text>
                      <Icon icon="add" style={styles.iconAddStyle} />
                    </TouchableOpacity>
                  </View>
                </View>
              </SafeAreaView>
            )}
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default AddressForm;
