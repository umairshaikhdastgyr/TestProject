import * as React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { BodyText } from '#components';
import { Colors } from '#themes';

const DeliveryItemPackage = ({
  errorMessage,
  handleOnBlur,
  handleOnChange,
  packageProperties,
}) => {
  const renderTextInput = (key = '', label = '') => {
    return (
      <View style={[styles.row, { marginRight: 12 }]}>
        <View style={{ position: 'relative' }}>
          <TextInput
            value={packageProperties[key]}
            onBlur={handleOnBlur}
            maxLength={key === 'pounds' ? 3 : 2}
            keyboardType={'numeric'}
            onChangeText={value => handleOnChange(key, value)}
            style={styles.input}
          />
          {/* {errorMessage && errorMessage[key] !== null && (
            <BodyText style={styles.errorMessage}>
              {errorMessage[key] || ''}
            </BodyText>
          )} */}
        </View>
        <BodyText style={[styles.text, { color: 'red' }]}>{label}*</BodyText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.row, { paddingTop: 0, marginBottom: 20 }]}>
        <View style={{ marginRight: 8, flexDirection: 'row' }}>
          <BodyText style={styles.title}>Package Weight:</BodyText>
          {/* <BodyText style={[styles.title, { color: 'red' }]}>*</BodyText> */}
        </View>
        {renderTextInput('pounds', 'lb')}

        {renderTextInput('ounces', 'oz')}
      </View>
      <View>
        <View style={{ flexDirection: 'row' }}>
          <BodyText style={[styles.title]}>Package Dimensions:</BodyText>
          {/* <BodyText style={[styles.title, { color: 'red' }]}>*</BodyText> */}
        </View>
        <View style={[styles.row]}>
          <View style={[{ flexDirection: 'row' }, styles.fixWidth]}>
            <BodyText style={[styles.title]}>Length:</BodyText>
            {/* <BodyText style={[styles.title, { color: 'red' }]}>*</BodyText> */}
          </View>
          {renderTextInput('length', 'in.')}
        </View>
        <View style={[styles.row]}>
          <View style={[{ flexDirection: 'row' }, styles.fixWidth]}>
            <BodyText style={[styles.title]}>Width:</BodyText>
            {/* <BodyText style={[styles.title, { color: 'red' }]}>*</BodyText> */}
          </View>
          {renderTextInput('width', 'in.')}
        </View>
        <View style={[styles.row]}>
          <View style={[{ flexDirection: 'row' }, styles.fixWidth]}>
            <BodyText style={[styles.title]}>Height:</BodyText>
            {/* <BodyText style={[styles.title, { color: 'red' }]}>*</BodyText> */}
          </View>
          {renderTextInput('height', 'in.')}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  text: {
    color: Colors.black,
    marginLeft: 4,
  },
  title: {
    fontWeight: 'bold',
    color: Colors.darkGrey,
  },
  fixWidth: {
    width: 65,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 6,
    width: 66,
    paddingVertical: 10,
  },
  errorMessage: {
    color: Colors.red,
    position: 'absolute',
    bottom: -16,
  },
});

DeliveryItemPackage.defaultProps = {
  errorMessage: {},
  packageProperties: {
    pounds: null,
    ounces: null,
    length: null,
    width: null,
    height: null,
    _meta: {
      isCompleted: false,
      isModified: false,
    },
  },
};

DeliveryItemPackage.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  errorMessage: PropTypes.object.isRequired,
  packageProperties: PropTypes.object.isRequired,
};

export default DeliveryItemPackage;