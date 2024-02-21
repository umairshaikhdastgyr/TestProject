import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  PixelRatio,
} from 'react-native';
import { Icon, BodyText, InputSearchLocation } from '#components';
import { Colors } from '#themes';

const InputSection = ({
  filterValues,
  setFilterValue,
  locationEnabled,
  onPressCurrentLocation,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        Platform.OS === 'ios' && styles.container_iosFix,
        style,
      ]}>
      <InputSearchLocation
        onChange={setFilterValue}
        placeholder="Address"
        value={filterValues.location}
        // allowAddress
      />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressCurrentLocation}
        style={styles.buttonContainer}>
        <Icon icon="localization" color="grey" style={styles.icon} />
        <BodyText bold style={{ color: Colors.blackLight }}>
          Use current location
        </BodyText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  container_iosFix: {
    zIndex: 2,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 8,
  },
  buttonContainer: {
    zIndex: -1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 10,
    alignSelf: 'flex-end',
    paddingRight: 8,
    paddingLeft: 2,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.inactiveText,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
  },
});

export default InputSection;
