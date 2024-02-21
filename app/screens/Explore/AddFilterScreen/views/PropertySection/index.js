import React from 'react';

import { StyleSheet, View, ScrollView } from 'react-native';
import TagList from './tag-list';
import ItemList from './item-list';
import RangeSlider from './range-slider';
import StringFilter from './string-filter';
import ColorList from './color-list';
import VerticalList from './vertical-list';
import { paddings } from '#styles/utilities';
import { Colors } from '#themes';
import moment from 'moment';

const PropertySection = ({
  property,
  values,
  setFilterValue,
  valuesToCall,
  onlySelection,
}) => {
  const childProps = {
    property,
    values,
    setFilterValue,
    name: property.name,
    valuesToCall,
    onlySelection,
  };

  // Pasrse property values
  if (property.type === 'integer') {
    childProps.min = property.min;
    childProps.max = property.max;
  } else if (property.type === 'year-integer') {
    const maxYear = Number(moment().format('YYYY'));
    childProps.min = maxYear - 30;
    childProps.max = maxYear + 1;
  }

  return (
    <View style={styles.container}>
      {property.type === 'tags' && <TagList {...childProps} />}
      {(!onlySelection || onlySelection === false) &&
        ['integer', 'year-integer'].includes(property.type) && (
          <View style={[paddings['py-4'], paddings['px-4']]}>
            <RangeSlider {...childProps} />
          </View>
        )}
      {onlySelection &&
        onlySelection === true &&
        ['year-integer'].includes(property.type) && (
          <VerticalList {...childProps} />
        )}
      {onlySelection && onlySelection === true && property.type === 'integer' && (
        <View style={paddings['p-4']}>
          <ScrollView style={{ flexGrow: 1, minHeight: 300 }}>
            <StringFilter {...childProps} keyboardType={'number-pad'} />
          </ScrollView>
        </View>
      )}
      {property.type === 'list' && (
        <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
          <ItemList {...childProps} />
        </ScrollView>
      )}
      {property.type === 'string' && (
        <View style={paddings['p-4']}>
          <ScrollView style={{ flexGrow: 1, minHeight: 300 }}>
            <StringFilter {...childProps} />
          </ScrollView>
        </View>
      )}
      {property.type === 'color-list' && <ColorList {...childProps} />}
      {property.type === 'vertical-list' && <VerticalList {...childProps} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 300,
    backgroundColor: Colors.creamBackground,
  },
});

export default PropertySection;
