import React from 'react';

import {
  DeliveryFilter,
  RangeSliderFilter,
  CheckboxesFilter,
} from '#screens/Explore/FilterScreen/components';
import QuickDeliveryMethodsPicker from '../../../MainScreen/views/ProductsFilters/quick-delivery-methods-picker';
import PriceRange from './PriceRange';

const BoyAndChild = ({
  deliveryGrouped,
  subCategories,
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
      {/* <RangeSliderFilter
        title="Price Range"
        min={priceRange.min}
        max={priceRange.max}
        symbol="$"
        values={filterValues.priceRange}
        onValuesChange={values => setFilterValue({ priceRange: values })}
      /> */}
      

      <PriceRange setFilterValue={setFilterValue} filterValues={filterValues}  />

      <CheckboxesFilter
        title="Select"
        options={subCategories}
        mainValues={filterValues.subCategories}
        childValues={filterValues.subCategoriesChilds}
        setFilterValue={setFilterValue}
      />
    </>
  );
};

export default BoyAndChild;
