import React from 'react';
import {bool} from 'prop-types';

import {ScrollView, View} from 'react-native';
import {Heading, Tag} from '#components';
import {paddings, borders, flex, margins} from '#styles/utilities';
import {startCase} from 'lodash';

const Delivery = ({
  title,
  options,
  name,
  value,
  multioption,
  singleInMultioption,
  setFilterValue,
}) => {
  /* Methods */
  const handleOnPressOption = option => {
    if (multioption) {
      let valuesToUpdate = [...value];
      if (!value.find(({id}) => id === option.id)) {
        valuesToUpdate.push(option);
      } else {
        valuesToUpdate = valuesToUpdate.filter(({id}) => id !== option.id);
      }
      setFilterValue({[name]: valuesToUpdate});
    } else if (singleInMultioption) {
      setFilterValue({[name]: option.id ? [option] : []});
    } else {
      setFilterValue({[name]: option.id !== value.id ? option : {}});
    }
  };
  return (
    <View style={{...paddings['py-5'], ...borders.bb}}>
      <Heading type="bodyText" style={{...margins['ml-4'], ...margins['mb-4']}}>
        {startCase(title)}
      </Heading>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 20,
        }}>
        {options.map(option => (
          <Tag
            key={option.id}
            label={option.name.toUpperCase()}
            active={
              !multioption
                ? option.id === value
                : value.find(({id}) => id === option.id)
            }
            onPress={() => handleOnPressOption(option)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

Delivery.propTypes = {
  multioption: bool,
  singleInMultioption: bool,
};

export default Delivery;
