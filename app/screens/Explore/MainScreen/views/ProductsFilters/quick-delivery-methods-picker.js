import React from 'react';
import { useSelector } from 'react-redux';

import { View, StyleSheet, ScrollView } from 'react-native';
import { Tag, Heading } from '#components';

import { Colors } from '#themes';

import { selectFiltersData } from '#modules/Filters/selectors';
import { persistFilterValues } from '#modules/Filters/actions';
import { useActions } from '#utils';
import { paddings, borders, flex, margins } from '#styles/utilities';

const QuickDeliveryMethodsPicker = ({fromFilter, filterValues, setFilterValue}) => {
  /* Selectors */
  const {
    filterValues: { quickDeliveries },
  } = useSelector(selectFiltersData());

  /* Actions */
  const actions = useActions({ persistFilterValues });

  /* Methods */
  const handlePickOption = option => {
    if(fromFilter === true){
      if(filterValues.quickDeliveries.length > 0 && filterValues.quickDeliveries[0].key === option.key){
        handlePickAllOption();
      } else {
        let optionsToSet = [];
        optionsToSet.push(option);

        setFilterValue({
          quickDeliveries: optionsToSet
        });
      }
    } else {
      if(quickDeliveries.length > 0 && quickDeliveries[0].key === option.key){
        handlePickAllOption();
      } else {
        let optionsToSet = [];
        optionsToSet.push(option);

        actions.persistFilterValues({
          quickDeliveries: optionsToSet,
        });
      }
    }
  };

  const handlePickAllOption = () => {
    if(fromFilter === true){
      setFilterValue({
        quickDeliveries: []
      });
    } else {
      actions.persistFilterValues({
        quickDeliveries: [],
      });
    }
  }

  const isActive = (option) => {
    if(fromFilter === true){
      if(filterValues.quickDeliveries.length > 0 && filterValues.quickDeliveries[0].key === option.key){
        return true;
      } else {
        return false;
      }
    } else {
      if(quickDeliveries.length > 0 && quickDeliveries[0].key === option.key){
        return true;
      } else {
        return false;
      }
    }
  }

  /* Helper Variables */
  const options = [
    //{ key: 1, ids: [], label: 'All' },
    { key: 1, ids: ['b74eb94a-4fd2-44ae-9828-4ddab1368d5e','6d820c00-87e5-482a-801d-da6c5fcec4b3', '0de53a42-574a-4180-a5a5-aea0b7d6131a'], label: 'All' },
    { key: 2, ids: ['b74eb94a-4fd2-44ae-9828-4ddab1368d5e'], label: 'Pick up' },
    { key: 3, ids: ['6d820c00-87e5-482a-801d-da6c5fcec4b3', '0de53a42-574a-4180-a5a5-aea0b7d6131a'], label: 'Shipping' },
  ];

  // removed this filter 
  return null;

  return (
    <View style={ fromFilter === true ? styles['container-pickers-filter'] : styles['container-pickers']}>
      { fromFilter === true &&
        <Heading
          type="bodyText"
          style={{ ...margins['ml-4'], ...margins['mt-4'] }}
        >Delivery</Heading>
      }
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles['container-scrollview']}
      >
        {options.map(option => (
          <Tag
            key={option.key}
            label={option.label.toUpperCase()}
            active={isActive(option)}
            onPress={() => handlePickOption(option)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  'container-pickers': {
    backgroundColor: Colors.lightGrey,
    zIndex: 4,
  },
  'container-pickers-filter': {
    ...borders.bb,
    backgroundColor: '#FFFFFF',
    zIndex: 4,
    paddingBottom: 20,
  },
  'container-scrollview': {
    paddingHorizontal: 20,
    paddingTop: 16,
  }
});

export default QuickDeliveryMethodsPicker;
