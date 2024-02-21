import React, { useEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Text,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import {
  CheckBoxSquare,
  FooterAction,
  Heading,
  InputText,
  SweetAlert,
} from "#components";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { Colors, Fonts } from "#themes";
import states from "#utils/us_states.json";
import { useDispatch, useSelector } from "react-redux";
import { TextInputMask } from "react-native-masked-text";
import ModalSelector from "react-native-modal-selector";
import STATES from "../BankTransferScreen/states-data";
import { getUserStripeHistory, updateAddress } from "#modules/User/actions";
import Ionicons from "react-native-vector-icons/MaterialIcons";
import fonts from "#themes/fonts";
import { apiModels } from "#services/apiModels";
import { ActivityIndicator } from "react-native-paper";
import { updateStripeAccount } from "#services/apiUsers";
import { userSelector } from "#modules/User/selectors";
import moment from "moment";
import { BirthDatePicker } from "#screens/Auth/ProfileSetupScreen/BirthDatePicker";

const EditPersonalDetail = ({
  isEditModal,
  setIsEditModal,
  address,
  setFirstName,
  setLastName,
  birthdate,
  setAddress1,
  setAddress2,
}) => {
  const dispatch = useDispatch();
  const {
    user: {
      information: { id },
    },
  } = useSelector(userSelector);
  const existingAddress = address;

  const [name, setName] = useState(
    existingAddress?.first_name + " " + existingAddress?.last_name || ""
  );
  const [state, setState] = useState(existingAddress?.address?.state || "");
  const [city, setCity] = useState(existingAddress?.address?.city || "");
  const [addressLine1, setAddressLine1] = useState(
    existingAddress?.address?.line1 || ""
  );
  const [addressLine2, setAddressLine2] = useState(
    existingAddress?.address?.line2 || ""
  );
  const [zipCode, setZipCode] = useState(
    existingAddress?.address?.postal_code || ""
  );
  const [stateModal, showStateModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isShowDatePicker, setShowDatePicker] = useState(false);
  const [birthDate, setBirthdate] = useState("");
  const [alertContent, setAlertContent] = useState({
    title: "",
    message: "",
    type: "success",
    visible: false,
  });

  let selectedState = null;
  const selectedItem = address;
  if (selectedItem) {
    const item = STATES.find(
      (st) => st.abbreviation === selectedItem.address.state
    );
    selectedState = item && item.name;
  }

  useEffect(() => {
    if (existingAddress) {
      const brithdate = String(
        10000 * existingAddress?.dob?.year +
          100 * existingAddress?.dob?.month +
          existingAddress?.dob?.day
      );
      setBirthdate(moment(brithdate).format("MM/DD/YYYY"));
    }
    return () => {
      dispatch(getUserStripeHistory());
    };
  }, []);

  const isUsZipCode = (str) => {
    const regexp = /^[0-9]{5}(?:-[0-9]{4})?$/;
    if (regexp.test(str)) {
      return true;
    }
    return false;
  };

  const onChangeDate = () => {
    setShowDatePicker(false);
  };
  const onConfirmPicker = (tempDate) => {
    setShowDatePicker(false);
    setBirthdate(moment(tempDate).format("MM/DD/YYYY"));
  };

  const handleBack = () => {
    const brithdate = String(
      10000 * existingAddress?.dob?.year +
        100 * existingAddress?.dob?.month +
        existingAddress?.dob?.day
    );
    setName(existingAddress?.first_name + " " + existingAddress?.last_name);
    setBirthdate(moment(brithdate).format("MM/DD/YYYY"));
    setAddressLine1(
      existingAddress?.address?.line1
        ? existingAddress?.address?.line1
        : "Addresss line 1"
    );
    setAddressLine2(
      existingAddress?.address?.line2
        ? existingAddress?.address?.line2
        : "Addresss line 2"
    );
    setZipCode(existingAddress?.address?.postal_code);
    setState(existingAddress?.address?.state);
    setCity(existingAddress?.address?.city);
    setIsEditModal(!isEditModal);
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
    const userName = name?.split(" ").filter((item) => item?.length != 0);
    if (
      !name ||
      userName?.length < 2 ||
      userName[0]?.length < 2 ||
      userName[1]?.length < 2
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
      address2: addressLine2,
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

    if (!checkAddress?.isValid) {
      setAlertContent({
        title: "",
        message: "Please, insert a valid address.",
        type: "error",
        visible: true,
      });
      setLoader(false);
      return;
    } else {
      const splitBirthdate = birthDate.split("/");
      const data = {
        params: {
          accountData: {
            individual: {
              first_name: userName[0],
              last_name: userName[1],
              dob: {
                day: splitBirthdate[1],
                month: splitBirthdate[0],
                year: splitBirthdate[2],
              },
              address: {
                ...existingAddress?.address,
                city: city,
                line1: addressLine1 ? addressLine1 : null,
                line2: addressLine2 ? addressLine2 : null,
                postal_code: zipCode,
                state: state,
              },
            },
          },
        },
      };
      await updateStripeAccount(id, data)
        .then((res) => {
          if (res?.status == 400) {
            Alert.alert("Oops!", res?.error?.message);
            setLoader(false);
          } else {
            if (res) {
              setFirstName(userName[0]);
              setLastName(userName[1]);
              setName(userName[0] + " " + userName[1]);
              birthdate(birthDate);
              setAddress1(addressLine1 ? addressLine1 : "Addresss line 1");
              setAddress2(addressLine2 ? addressLine2 : "Addresss line 2");
              setIsEditModal(!isEditModal);
              setLoader(false);
            } else {
              setIsEditModal(!isEditModal);
              setLoader(false);
            }
          }
        })
        .catch((e) => {
          setLoader(false);
          const errorBlockMsg = _.get(e, "result.content.message", null);
          Alert.alert("Oops!", errorBlockMsg);
        });
    }
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
    <Modal animationType="slide" visible={isEditModal} transparent>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
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
              onPress={handleBack}
              name="arrow-back"
              size={25}
              color="#969696"
            />
            <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}>
              Edit Address
            </Text>
            <View />
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
              <Heading type="bold" style={styles.heading}>
                BirthDate
              </Heading>
              <Text
                onPress={() => setShowDatePicker(true)}
                style={styles.zipInput}
              >
                {birthDate}
              </Text>
              <View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: Colors.blackLight,
                }}
              />
              {isShowDatePicker && (
                <BirthDatePicker
                  isShowDatePicker={isShowDatePicker}
                  value={
                    birthDate
                      ? new Date(birthDate)
                      : new Date(moment(new Date()).subtract(18, "years"))
                  }
                  onChangeDate={onChangeDate}
                  onCancel={() => setShowDatePicker(false)}
                  onConfirm={onConfirmPicker}
                />
              )}
            </View>
          </ScrollView>

          {loader ? (
            <FooterAction
              mainButtonProperties={{
                label: <ActivityIndicator size="small" color="#fff" />,
                disabled: false,
                onPress: onUpdate,
              }}
            />
          ) : (
            <FooterAction
              mainButtonProperties={{
                label: "Update address",
                disabled: false,
                onPress: onUpdate,
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
      </SafeAreaView>
    </Modal>
  );
};
const styles = StyleSheet.create({
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
});
export default EditPersonalDetail;
