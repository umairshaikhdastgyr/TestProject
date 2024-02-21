import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal as RNModal, // Rename Modal to RNModal to avoid naming conflicts
} from 'react-native';
import { Colors, Fonts } from '#themes';
import PropTypes from 'prop-types';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { Button } from '#components';

const { width } = Dimensions.get('window');

const QuantityModal = ({
  availableQuantity,
  isVisible,
  onPress,
  quantitySelected,
  handleIncrement,
  handleDecrement,
  handleRemove,
}) => {
  const renderDecrementButton = () => {
    if (quantitySelected > 1) {
      return (
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={handleDecrement}
          style={styles.iconContainer}
        >
          <Entypo color={Colors.darkGrey} size={22} name="minus" />
        </TouchableOpacity>
      );
    }
    return (
      <View style={[styles.iconContainer, { borderColor: Colors.gray }]}>
        <Entypo color={Colors.gray} size={22} name="minus" />
      </View>
    );
  };

  const renderIncrementButton = () => {
    if (quantitySelected < availableQuantity) {
      return (
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={handleIncrement}
          style={styles.iconContainer}
        >
          <Entypo color={Colors.darkGrey} size={22} name="plus" />
        </TouchableOpacity>
      );
    }
    return (
      <View style={[styles.iconContainer, { borderColor: Colors.gray }]}>
        <Entypo color={Colors.gray} size={22} name="plus" />
      </View>
    );
  };

  return (
    <RNModal // Use RNModal from react-native
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onPress}
    >
       <View style={{flex:1, paddingTop: 216, backgroundColor:'rgba(0,0,0,0.5)'}}>
      <View style={styles.modalContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{`Select Quantity (Max ${availableQuantity})`}</Text>
          <TouchableOpacity onPress={onPress}>
            <EvilIcons color={Colors.blackLight} size={30} name="close" />
          </TouchableOpacity>
        </View>
        <View style={styles.detailContainer}>
          <View style={styles.controlContainer}>
            {renderDecrementButton()}
            <Text style={styles.quantitySelected}>{quantitySelected}</Text>
            {renderIncrementButton()}
          </View>
          <Button size="large" onPress={onPress} style={styles.doneButton} label="Done" />
        </View>
      </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: width - 50,
    backgroundColor: '#fcfcfc',
    alignSelf: 'center',
    marginTop: 100,
    borderRadius: 10
  },
  headerContainer: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },
  headerTitle: {
    fontFamily: Fonts.family.regular,
    fontWeight: '600',
    fontSize: 15,
  },
  detailContainer: {
    padding: 30,
  },
  controlContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  quantitySelected: {
    fontFamily: Fonts.family.semiBold,
    fontSize: 15,
    marginHorizontal: 12,
  },
  headerDetail: {
    marginTop: 3,
    fontFamily: Fonts.family.regular,
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  detailText: {
    fontFamily: Fonts.family.regular,
    fontSize: 13,
    color: '#313334',
    textAlign: 'center',
  },
  doneButton: {
    marginTop: 20,
  },
});

QuantityModal.defaultProps = {
  isVisible: false,
  quantitySelected: 1,
  onPress: () => [],
  handleIncrement: () => [],
  handleDecrement: () => [],
  handleRemove: () => [],
};

QuantityModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  quantitySelected: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  handleIncrement: PropTypes.func.isRequired,
  handleDecrement: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default React.memo(QuantityModal);
