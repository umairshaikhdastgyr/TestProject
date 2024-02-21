import React from 'react';

import {View} from 'react-native';
import {Heading, CustomSelectInput} from '#components';
import {paddings, borders} from '#styles/utilities';

import {persistLocationSearchPreValues} from '#modules/Filters/actions';
import {useActions} from '#utils';

const Location = ({filterValues, navigation}) => {
  /* Actions */
  const actions = useActions({
    persistLocationSearchPreValues,
  });

  /* Methods */
  const handlePressLocationInput = () => {
    actions.persistLocationSearchPreValues({
      location: filterValues.location,
      distance: filterValues.distance,
    });
    navigation.navigate('FilterSearchLocation');
  };

  return (
    <View style={[paddings['px-4'], paddings['py-5'], borders.bb]}>
      <Heading type="bodyText">Location</Heading>
      <CustomSelectInput
        actionLabel="UPDATE"
        onPress={handlePressLocationInput}
        placeholder="City or zip code"
        value={
          filterValues.location.formattedAddress
            ? `${filterValues.location.city}, ${filterValues.location.state}`
            : ''
        }
      />
    </View>
  );
};

export default Location;
