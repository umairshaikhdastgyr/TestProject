import React from 'react';

import {
  DeliveryFilter,
  RangeSliderFilter,
  TypesFilter,
} from '#screens/Explore/FilterScreen/components';
import QuickDeliveryMethodsPicker from '../../../MainScreen/views/ProductsFilters/quick-delivery-methods-picker';
import PriceRange from './PriceRange';

const AutomotiveParts = ({
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

      <TypesFilter
        title="Types"
        options={subCategories}
        values={filterValues.subCategories}
        setFilterValue={setFilterValue}
      />
    </>
  );
};

export default AutomotiveParts;
