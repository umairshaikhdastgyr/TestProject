import React from 'react';
import { useSelector } from 'react-redux';

import { View } from 'react-native';
import { Heading, RadioInputs } from '#components';
import { paddings, borders, margins } from '#styles/utilities';

import { selectFiltersData } from '#modules/Filters/selectors';

const SortBy = ({ filterValues, setFilterValue }) => {
  /* Selectors */
  const { filterOptions } = useSelector(selectFiltersData());

  return (
    <View
      style={{
        ...paddings['px-4'],
        ...paddings['py-5'],
        ...paddings['pb-1'],
        ...borders.bb,
      }}
    >
      <Heading type="bodyText" style={margins['mb-5']}>
        Sort By
      </Heading>
      <RadioInputs
        options={filterOptions.sortBy}
        name="sortBy"
        value={filterValues.sortBy}
        onChange={(name, value) => setFilterValue({ [name]: value })}
      />
    </View>
  );
};

export default SortBy;
