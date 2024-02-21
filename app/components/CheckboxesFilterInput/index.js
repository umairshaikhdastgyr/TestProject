import React, { useState } from 'react';
import { arrayOf, shape, string } from 'prop-types';

import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Icon } from '#components';
import { Colors, Fonts } from '#themes';

const CheckboxesFilterInput = ({
  options,
  mainValues,
  childValues,
  onMainPress,
  onChildPress,
}) => {
  /* States */
  const [showChildList, setShowChildList] = useState(
    mainValues.includes(options.id) &&
      childValues.length === options.childCategory.length,
  );

  /* Methods */
  const handleToggleChildList = () => {
    setShowChildList(!showChildList);
  };

  const mainIsSelected =
    mainValues.includes(options.id) &&
    childValues.length === options.childCategory.length;
  return (
    <View style={styles.body}>
      <View style={styles.checkboxMainBody}>
        <TouchableOpacity
          style={{
            ...styles.checkboxSquare,
            ...(mainIsSelected && styles.squareActive),
          }}
          onPress={() => onMainPress(options)}
        />
        {childValues.length > 0 && <View style={styles.mainSemiActive} />}
        <Text
          style={{
            ...styles.text,
            ...(mainIsSelected && styles.textActive),
          }}
        >
          {options.name}
        </Text>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={handleToggleChildList}
        >
          {!showChildList && (
            <Icon icon="add" style={styles.addIcon} size="small" />
          )}
          {showChildList && (
            <Icon icon="less" style={styles.lessIcon} size="small" />
          )}
        </TouchableOpacity>
      </View>
      {options.childCategory.map(child => (
        <View
          key={child.id}
          style={{
            ...styles.checkboxChilds,
            ...(showChildList && styles.childsActive),
          }}
        >
          <View style={styles.checkboxChildBody}>
            <TouchableOpacity
              style={{
                ...styles.checkboxSquare,
                ...(childValues.includes(child.id) && styles.squareActive),
              }}
              onPress={() => onChildPress(child)}
            />
            <Text
              style={{
                ...styles.text,
                ...(childValues.includes(child.id) && styles.textActive),
              }}
            >
              {child.name}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

CheckboxesFilterInput.defaultProps = {
  values: [],
};

const styles = StyleSheet.create({
  body: {
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
    paddingVertical: 16,
  },
  checkboxMainBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  checkboxChilds: {
    display: 'none',
  },
  childsActive: {
    display: 'flex',
  },
  checkboxChildBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingLeft: 32,
  },
  checkboxSquare: {
    borderWidth: 1,
    borderColor: Colors.inactiveText,
    height: 20,
    width: 20,
    marginRight: 12,
  },
  squareActive: {
    borderColor: Colors.active,
    backgroundColor: Colors.active,
  },
  mainSemiActive: {
    width: 10,
    height: 2,
    backgroundColor: Colors.active,
    position: 'absolute',
    left: 5,
    top: 25,
  },
  iconWrapper: {
    marginLeft: 'auto',
  },
  text: {
    fontFamily: Fonts.family.regular,
    fontSize: 15,
    color: Colors.black,
  },
  textActive: {
    fontWeight: '600',
  },
});

CheckboxesFilterInput.propTypes = {
  options: shape({
    label: string,
    value: string,
    childList: arrayOf(shape({})),
  }).isRequired,
};

export default CheckboxesFilterInput;
