import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { StyleSheet, View } from "react-native";

import { selectSellData } from "#modules/Sell/selectors";
import { setFormValue, getListingType } from "#modules/Sell/actions";

import { useActions } from "#utils";


const ListingType = ({ fromEditor }) => {
  /* Selectors */
  const { listingTypeList, formData } = useSelector(selectSellData());

  /* Actions */
  const actions = useActions({ setFormValue, getListingType });

  useEffect(() => {
    if (fromEditor && fromEditor === true && listingTypeList.length === 0) {
      actions.getListingType();
    }
  }, []);

  useEffect(() => {
    const listingType = listingTypeList.find(
      (element) => element.name == "Goods"
    );
    if (listingType && !fromEditor && formData?.postTitle == "") {
      let deliveryMethodsSelected = [];
      let paymentMethodsSelected = [];
      actions.setFormValue({
        ...formData,
        listingType:
          listingType.id !== formData.listingType.id ? listingType : "",
        category: {},
        subCategory: {},
        postTitle: "",
        postDescription: "",
        location: {},
        condition: [1],
        price: "",
        isNegotiable: false,
        shareOnFacebook: false,
        deliveryMethodsSelected,
        paymentMethodsSelected,
        customProperties: {},
      });
    }
  }, [listingTypeList]);

  return (
    <View style={styles.container}>
      {/* <View style={[styles.heading, flex.directionRow]}>
        <Heading type="bodyText" bold>
          Select Listing Type
        </Heading>
        <Heading type="bodyText" style={{ color: "red" }} bold>
          *
        </Heading>
      </View>

      <View style={styles.listingContainer}>
        {listingTypeList &&
          listingTypeList
            .filter((item) => item.name !== "Other")
            .map((listingType, index) => {
              if(index){
                return null;
              }
              return (
                <TypeTag
                  key={listingType.id}
                  icon={listingType.iconUrl}
                  label={listingType.name}
                  theme="wild"
                  style={[
                    styles.typeTag,
                    index + 1 === listingTypeList.length && styles.typeTagLast,
                  ]}
                  onPress={() => {
                    const isVehicle = listingType?.name === "Vehicle";
                    const vehicleDeliveryMethod =
                      defaultVehicleDeliveryMethod();
                    let deliveryMethodsSelected = [];
                    let paymentMethodsSelected = [];
                    if (isVehicle) {
                      deliveryMethodsSelected = [vehicleDeliveryMethod];
                      paymentMethodsSelected =
                        vehicleDeliveryMethod.PaymentMethods;
                    }

                    actions.setFormValue({
                      listingType:
                        listingType.id !== formData.listingType.id
                          ? listingType
                          : "",
                      category: {},
                      subCategory: {},
                      postTitle: "",
                      postDescription: "",
                      location: {},
                      condition: [1],
                      price: "",
                      isNegotiable: false,
                      shareOnFacebook: false,
                      deliveryMethodsSelected,
                      paymentMethodsSelected,
                      customProperties: {},
                    });
                  }}
                  active={formData.listingType.id === listingType.id}
                />
              );
            })}
      </View>
      <Divider /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  heading: {
    marginBottom: 16,
  },
  listingContainer: {
    flexDirection: "row",
    paddingHorizontal: 4,
    marginBottom: 24,
  },
  typeTag: {
    marginRight: 10,
    flex: 1,
  },
  typeTagLast: {
    marginRight: 0,
  },
});

export default ListingType;
