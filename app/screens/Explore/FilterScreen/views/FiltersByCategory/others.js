import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, TextInput, Text } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import PriceRange from "./PriceRange";

import {
  DeliveryFilter,
  RangeSliderFilter,
} from '#screens/Explore/FilterScreen/components';
import QuickDeliveryMethodsPicker from '../../../MainScreen/views/ProductsFilters/quick-delivery-methods-picker';

const Others = ({
  deliveryGrouped,
  setFilterValue,
  filterValues,
  priceRange,
  categoryCustomProperties,
}) => {
  return (
    <>
      {categoryCustomProperties?.allowDeliveryFilters && (
        <QuickDeliveryMethodsPicker fromFilter={true} filterValues={filterValues} setFilterValue={setFilterValue}/>
      )}
     <PriceRange setFilterValue={setFilterValue} />
    </>
  );
};

const styles = StyleSheet.create({
  
  
  textArea1: {
    width: "80%",
    fontSize: 18,
    justifyContent: "flex-start",
    color: "#969696",
  },
});

export default Others;
