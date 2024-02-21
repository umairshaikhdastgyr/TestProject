import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Modal,
  SafeAreaView,
} from "react-native";
import PropTypes from "prop-types";
import { Icon } from "#components";
import { Colors } from "#themes";
import Ionicons from "react-native-vector-icons/MaterialIcons";
import fonts from "#themes/fonts";
import colors from "#themes/colors";
import { useEffect } from "react";
import { updateAddress } from "#modules/User/actions";
import { useDispatch } from "react-redux";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width;
const styles = StyleSheet.create({
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

const RetrunAddress = ({
  returnAddressList,
  navigation,
  postDetail,
  actions,
  selectedItem,
  setSelectedItem,

  returnLabel,
}) => {
  const dispatch = useDispatch();
  const [alertContent, setAlertContent] = useState({
    title: "",
    message: "",
    type: "success",
    visible: false,
  });

  const [showShippingModal, setshowShippingModal] = useState(false);

  const validateSelection = () => {
    if (selectedItem) {
      navigation.navigate("AddressForm", {
        editable: true,
        selectedItem,
        postDetail,
        provider: "fedex",
      });
    } else {
      setAlertContent({
        message: "You must select a address from list",
        type: "warning",
        visible: true,
      });
    }
  };

  useEffect(()=>{
    if (returnAddressList && returnAddressList.length &&!selectedItem  ) {
      let newIndex = returnAddressList.length - 1;

      const addressArr = returnAddressList.map((item, index) => ({
        ...item,
        default: newIndex === index ? true : false,
      }));
      


      if (addressArr[newIndex]) {
        setSelectedItem({ ...addressArr[newIndex], selectedIndex: newIndex });
        actions.setReturnLabel({
          ...returnLabel,
          homitagReturnAddress: addressArr[newIndex],
        });
      } else {
        setSelectedItem(null);
      }
      actions.setReturnAddress(addressArr);

    }
  },[])

  useEffect(()=>{
    if (returnAddressList && returnAddressList.length && !selectedItem  ) {
      let newIndex = returnAddressList.length - 1;

      const addressArr = returnAddressList.map((item, index) => ({
        ...item,
        default: newIndex === index ? true : false,
      }));


      if (addressArr[newIndex]) {
        setSelectedItem({ ...addressArr[newIndex], selectedIndex: newIndex });
        actions.setReturnLabel({
          ...returnLabel,
          homitagReturnAddress: addressArr[newIndex],
        });
      } else {
        setSelectedItem(null);
      }
      actions.setReturnAddress(addressArr);

    }
  },[returnAddressList])

  const setActive = (indexObj) => {
    const addressArr = returnAddressList.map((item, index) => ({
      ...item,
      default: indexObj === index ? true : false,
    }));
    if (addressArr[indexObj]) {
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
      setSelectedItem({ ...addressArr[indexObj], selectedIndex: indexObj });
      actions.setReturnLabel({
        ...returnLabel,
        homitagReturnAddress: addressArr[indexObj],
      });
    } else {
      setSelectedItem(null);
    }
    actions.setReturnAddress(addressArr);
    setTimeout(() => {
      setshowShippingModal(false);
    }, 1000);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.radioButton}
      onPress={() => setActive(index)}
    >
      <View style={styles.addressDetailContainer}>
        <Text
          style={[
            styles.addressName,
            { color: item?.default ? colors.green : colors.black },
          ]}
        >
          {item?.name}
        </Text>
        <Text
          style={[
            styles.adressDetail,
            { color: item?.default ? colors.green : colors.black },
          ]}
        >
          {`${item?.address_line_1 || ""} ${item?.address_line_2 || ""} \n${
            item?.city || ""
          }, ${item?.state || ""} ${item?.zipcode || ""}`}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setshowShippingModal(false);
          if (item) {
            navigation.navigate("AddressForm", {
              editable: true,
              selectedItem: {...item, selectedIndex:index},
              postDetail,
              provider: "fedex",
            });
          } else {
            setAlertContent({
              message: "You must select a address from list",
              type: "warning",
              visible: true,
            });
          }
        }}
      >
        <Icon
          icon={item.default ? "edit_active" : "edit_grey"}
          style={styles.editIcon}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
  return (
    <>
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: "#E8E8E8",
          paddingVertical: 20,
          marginBottom: 20,
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setshowShippingModal(true)
          }}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: 15,
              alignSelf: "flex-start",
            }}
          >
            Return to: <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={{ flex: 1,paddingLeft:20 }}>
            {(!selectedItem || selectedItem) && selectedItem?.selectedIndex == undefined  && (
              <Text
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: 15,
                  color: "#999999",
                }}
              >
                Enter a return address
              </Text>
            )}
            {selectedItem && selectedItem?.selectedIndex != undefined && (
              <View style={[styles.addressDetailContainer,{marginVertical:0}]}>
                <Text
                  style={{
                    fontFamily: "Montserrat-Bold",
                    fontSize: 15,
                  }}
                >
                  {selectedItem?.name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: 13,
                  }}
                >
                  {`${selectedItem?.address_line_1 || ""} ${
                    selectedItem?.address_line_2 || ""
                  } \n${selectedItem?.city || ""}, ${selectedItem?.state || ""} ${
                    selectedItem?.zipcode || ""
                  }`}
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
            }}
          >
            <Icon icon="chevron-right" style={{ width: 20, height: 20 }} />
          </View>
        </TouchableOpacity>
      </View>
      <Modal visible={showShippingModal} transparent>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
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
            <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}>
              Shipping Info
            </Text>
            <Text style={{ color: "white" }}>{` a`}</Text>
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            {returnAddressList?.length > 0 && (
              <FlatList
                data={returnAddressList}
                contentContainerStyle={{ flexGrow: 1 }}
                renderItem={renderItem}
                keyExtractor={(item) => item[0]}
                scrollEnabled={false}
              />
            )}
            <View style={styles.addressButtonContainer}>
              <TouchableOpacity
                style={[styles.addressButton]}
                onPress={() => {
                  setshowShippingModal(false);
                  navigation.navigate("AddressForm", {
                    postDetail,
                    provider: "fedex",
                  });
                }}
              >
                <Text style={styles.addressButtonText}>ADD AN ADDRESS</Text>
                <Icon icon="add" style={styles.iconAddStyle} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      {/* {returnAddressList?.length > 0 && (
        <FlatList
          data={returnAddressList}
          contentContainerStyle={{ flexGrow: 1 }}
          renderItem={renderItem}
          keyExtractor={(item) => item[0]}
          scrollEnabled={false}
        />
      )} */}

      {/* navigation.navigate('AddressForm', {
        editable: true, selectedItem, postDetail, provider,
      }); */}
    </>
  );
};
RetrunAddress.propTypes = {
  addressList: PropTypes.array,
  navigation: PropTypes.object,
  postDetail: PropTypes.object,
};

export default RetrunAddress;
