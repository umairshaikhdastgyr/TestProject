import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import {
  DeliveryFilter,
  RangeSliderFilter,
  SelectFilter,
} from '#screens/Explore/FilterScreen/components';

import { selectFiltersData } from '#modules/Filters/selectors';
import {
  setProperties,
  persistPropertiesValues,
  setPropertiesValues,
} from '#modules/Filters/actions';
import { useActions } from '#utils';
import PriceRange from './PriceRange';

const Vehicles = ({
  deliveryGrouped,
  subCategories,
  priceRange,
  filterValues,
  setFilterValue,
  navigation,
  categoryCustomProperties,
  setCustomPropertiesProps,
}) => {
  /* Selectors */
  const { properties, propertiesValues } = useSelector(selectFiltersData());
  const { filterValues: filterValuesPersisted } = useSelector(
    selectFiltersData(),
  );

  /* States */
  const [propertiesFilterValues, setPropertiesFilterValues] = useState({});

  /* Actions */
  const actions = useActions({
    setProperties,
    persistPropertiesValues,
    setPropertiesValues,
  });

  /* Effects */
  useEffect(() => {
    if (
      filterValues.subCategories[0] &&
      filterValues.subCategories[0].customProperties
    ) {
      actions.setProperties(
        filterValues.subCategories[0].customProperties.properties,
      );
      if (
        filterValues.subCategories[0] !== filterValuesPersisted.subCategories[0]
      ) {
        setDefaultPropertyValues(
          filterValues.subCategories[0].customProperties.properties,
        );
      }
    }
  }, [filterValues.subCategories]);

  useEffect(() => {
    setPropertiesFilterValues(propertiesValues);
  }, [propertiesValues]);

  useEffect(() => {
    setCustomPropertiesProps(propertiesFilterValues);
  }, [propertiesFilterValues]);

  useEffect(() => {
    //console.log(properties);
    //console.log(propertiesValues);
  }, [properties]);

  /* Methods */
  const setDefaultPropertyValues = customPropertiesToParse => {
    const propertiesValuesToSet = {};
    customPropertiesToParse.forEach(property => {
      if (
        ['list', 'tags', 'color-list', 'vertical-list'].includes(property.type)
      )
        propertiesValuesToSet[property.name] = [];
      if (property.type === 'string') propertiesValuesToSet[property.name] = '';
      if (property.type === 'integer')
        propertiesValuesToSet[property.name] = [property.min, property.max];
      if (property.type === 'year-integer') {
        const maxYear = Number(moment().format('YYYY'));
        propertiesValuesToSet[property.name] = [maxYear - 30, maxYear + 1];
      }
    });
    propertiesValuesToSet.model = [];
    actions.setPropertiesValues(propertiesValuesToSet);
  };

  const renderProperty = property => {
    if(property.hideOnFilters && property.hideOnFilters === true){
      return null;
    } else {
      if (
        ['list', 'tags', 'string', 'color-list', 'vertical-list'].includes(
          property.type,
        )
      ) {
        return (
          <>
            <SelectFilter
              key={property.name}
              title={property.name}
              values={propertiesFilterValues[property.name]}
              placeholder={`${
                property.type === 'string' ? 'Type a' : 'Select a'
              } ${property.name}`}
              onPress={() => handlePressAddFilters(property)}
            />
            {property.name === 'make' && (
              <SelectFilter
                key="model"
                title="model"
                values={propertiesFilterValues.model}
                placeholder="Select a Model"
                disabled={propertiesValues.make.length === 0}
                onPress={() => handlePressAddFilters({ name: 'model' })}
              />
            )}
          </>
        );
      } else if (property.type === 'integer') {
        let integerData = propertiesFilterValues[property.name];
        if (integerData === undefined) {
          integerData = [property.min, property.max];
        }
        return (
          <RangeSliderFilter
            key={property.name}
            title={property.name}
            min={property.min}
            max={property.max}
            symbol=""
            values={integerData}
            onValuesChange={values =>
              setPropertyFilterValue({ [property.name]: values })
            }
          />
        );
      } else if (property.type === 'year-integer') {
        const maxYear = Number(moment().format('YYYY'));
        let yearData = propertiesFilterValues[property.name];
        if (yearData === undefined) {
          yearData = [maxYear - 30, maxYear + 1];
        }
        return (
          <RangeSliderFilter
            key={property.name}
            title={property.name}
            min={maxYear - 30}
            max={maxYear + 1}
            symbol=""
            values={yearData}
            onValuesChange={values =>
              setPropertyFilterValue({ [property.name]: values })
            }
          />
        );
      }
    }
  };

  const setPropertyFilterValue = value =>
    setPropertiesFilterValues({
      ...propertiesFilterValues,
      ...value,
    });

  const handlePressAddFilters = property => {
    actions.persistPropertiesValues(propertiesFilterValues);
    navigation.navigate('AddFilter', { tabName: property.name });
  };

  const allowShowProperties = Boolean(
    filterValues.subCategories[0] && filterValues.subCategories[0].id,
  );

  return (
    <>
      <DeliveryFilter
        title="Type of Vehicle"
        options={subCategories}
        name="subCategories"
        setFilterValue={setFilterValue}
        singleInMultioption
        value={
          filterValues.subCategories[0] ? filterValues.subCategories[0].id : ''
        }
      />
      {/* <RangeSliderFilter
        title="Price Range"
        min={priceRange.min}
        max={priceRange.max}
        symbol="$"
        values={filterValues.priceRange}
        onValuesChange={values => setFilterValue({ priceRange: values })}
      /> */}
      
      
     <PriceRange setFilterValue={setFilterValue} filterValues={filterValues}  />

      {allowShowProperties &&
        properties.map(property => renderProperty(property))}
    </>
  );
};

export default Vehicles;
