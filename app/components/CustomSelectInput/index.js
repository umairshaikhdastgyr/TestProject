import React from 'react';
import { string, oneOfType } from 'prop-types';

import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { BodyText, Label } from '#components';
import { Colors } from '#themes';

const CustomSelectInput = ({
  value,
  placeholder,
  onPress,
  actionLabel,
  showActionButton,
  numberOfLines,
  disabled,
  bottomLine,
}) => (
  <TouchableOpacity
    style={[
      bottomLine ? styles.CustomSelectInput : styles.CustomSelectInputNoLine,
      numberOfLines > 1 && { minHeight: numberOfLines * 30 },
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <BodyText
      style={styles.bodyText}
      size="medium"
      theme={!value ? 'inactive' : 'black'}
      numberOfLines={numberOfLines}
      onPress={!disabled ? onPress : () => {}}
    >
      {value || placeholder}
    </BodyText>
    {showActionButton && (
      <View style={styles.touchable}>
        <Label bold size="medium" type={disabled ? 'disabled' : 'underline'}>
          {actionLabel}
        </Label>
      </View>
    )}
  </TouchableOpacity>
);

CustomSelectInput.propTypes = {
  placeholder: string,
  // value: oneOfType(['string', 'number']),
  actionLabel: string,
};

CustomSelectInput.defaultProps = {
  actionLabel: 'SELECT',
  showActionButton: true,
  numberOfLines: 1,
  disabled: false,
  bottomLine: true,
};

const styles = StyleSheet.create({
  CustomSelectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: Colors.grey,
  },
  CustomSelectInputNoLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 8,
  },
  bodyText: {
    flex: 1,
    lineHeight: 22,
    alignSelf: 'flex-start',
  },
  touchable: {
    paddingVertical: 4,
  },
});

export default CustomSelectInput;
