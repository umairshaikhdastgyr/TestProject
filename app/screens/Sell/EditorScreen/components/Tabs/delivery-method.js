import React from "react";
import { View, ScrollView } from "react-native";
import { BodyText } from "#components";
import { flex } from "#styles/utilities";
import styles from "../../styles";

import DeliveryItem from "../../../DeliveryMethodsScreen/DeliveryItem";

const DeliveryMethodTab = ({
  deliveryMethods,
  packageProperties,
  setPackageProperties,
  packagePropertiesError,
  handlePackagePropertiesOnChange,
  handlePackagePropertiesOnBlur,
  formData,
  setDeliveryFormData,
  updateDeliveryFormData,
  errShipPriceErr,
  setErrShipPriceErr,
  sendAlert,
  setErrHomiLabel,
  errHomiLabel,
  getMinimumShipRate,
  minShippingRate,
  subCategoryIsSelected,
  locationCountryIsValid,
}) => {
  if (Number(formData.price) <= 0) {
    return (
      <View style={styles.emptyContainer}>
        <BodyText
          size="medium"
          theme="active"
          align="center"
          style={{ color: "rgba(49, 51, 52, 0.67)", marginBottom: 20 }}
        >
          Please input a valid price in "Price" tab.
        </BodyText>
      </View>
    );
  }

  if (!subCategoryIsSelected) {
    return (
      <View style={styles.emptyContainer}>
        <BodyText
          size="medium"
          theme="active"
          align="center"
          style={{ color: "rgba(49, 51, 52, 0.67)", marginBottom: 20 }}
        >
          Please select a category in the "Category" tab to configure the
          delivery methods.
        </BodyText>
      </View>
    );
  }

  if (!locationCountryIsValid) {
    return (
      <View style={styles.emptyContainer}>
        <BodyText
          size="medium"
          theme="active"
          align="center"
          style={{ color: "rgba(49, 51, 52, 0.67)", marginBottom: 20 }}
        >
          Please select a location in the "Post Detail" tab to configure the
          delivery methods.
        </BodyText>
      </View>
    );
  }

  return (
    <View style={[flex.grow1, flex.justifyContentStart]}>
      <ScrollView
        style={{ flexGrow: 1 }}
        contentContainerStyle={styles.scrollContainer}
      >
        {deliveryMethods?.data?.map((itemData, index) => {
          if (itemData.code == "pickup") {
            // Temparary removed for first release
            return null;
          }
          return (
            <DeliveryItem
              packageProperties={packageProperties}
              setPackageProperties={setPackageProperties}
              packagePropertiesError={packagePropertiesError}
              handlePackagePropertiesOnChange={handlePackagePropertiesOnChange}
              handlePackagePropertiesOnBlur={handlePackagePropertiesOnBlur}
              key={index}
              itemData={itemData}
              formData={formData}
              setDeliveryFormData={setDeliveryFormData}
              updateDeliveryFormData={updateDeliveryFormData}
              deliveryMethodsCount={deliveryMethods.data.length}
              errTotalPriceErr={errShipPriceErr}
              setErrTotalPriceErr={setErrShipPriceErr}
              sendAlert={sendAlert}
              setErrHomiLabel={setErrHomiLabel}
              errHomiLabel={errHomiLabel}
              getMinimumShippingRate={getMinimumShipRate}
              minShippingRate={minShippingRate}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default DeliveryMethodTab;
