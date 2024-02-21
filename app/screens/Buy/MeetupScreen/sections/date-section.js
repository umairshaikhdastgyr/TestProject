import React from 'react';

import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Heading, RangeSliderInput, BodyText, Divider, Icon } from '#components';
import { margins, flex } from '#styles/utilities';

import moment from 'moment';

const DateSection = ({ value, filterValues, setFilterValue, setDateTimeVisible }) => {
  return (
    <View style={styles.container}>
      <Divider style={styles.divider} />
      <TouchableOpacity onPress={() => { setDateTimeVisible(true); }} style={{paddingVertical: 15}}>
        <View style={[flex.directionRow, flex.justifyContentSpace]}>
        
          <BodyText size="medium" bold={true} style={{color: '#313334'}}>
            {moment(value).format("MMMM DD, YYYY")}
          </BodyText>
          <BodyText size="medium" bold={true} style={{color: '#313334'}}>
            {moment(value).format("hh:mm A")}
          </BodyText>
          <Icon icon={'chevron-right'} style={{top: -2.5}}/>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    marginBottom: 20,
  },
  container: {
    padding: 20,
  },
});

export default DateSection;
