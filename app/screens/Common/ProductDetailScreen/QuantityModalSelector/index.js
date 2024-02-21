import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
  Modal,
} from "react-native";
import { flex, paddings, margins } from "#styles/utilities";
import { Icon, Button } from "#components";
import { Fonts } from "#themes";
import QuantityTouchable from "./quantity-touchable";

const QuantityModalSelector = ({
  quantity,
  setQuantity,
  availableQuantity,
  showModal,
  toggleModal,
}) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [overQuantitySelected, setOverQuantitySelected] = useState(false);

  const [dialogStyle, setDialogStyle] = useState({ borderRadius: 5 });

  useEffect(() => {
    const _keyboardDidShow = () => {
      setDialogStyle({
        borderRadius: 5,
        marginBottom: Platform.OS === "ios" ? 300 : 0,
      });
    };

    const _keyboardDidHide = () => {
      setDialogStyle({ borderRadius: 5 });
    };

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      _keyboardDidShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      _keyboardDidHide
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleDone = () => {
    setQuantity((prevState) => parseInt(prevState, 10).toString());
    setShowManualInput(false);
    toggleModal();
  };

  const handleChoosePlusQuantity = (text) => {
    const value = parseInt(text, 10);

    if (value > availableQuantity) {
      setQuantity(availableQuantity.toString());
      setOverQuantitySelected(true);
    } else if (text === "-1") {
      setQuantity(null);
    } else if (text === "0") {
      setQuantity("1");
    } else {
      setQuantity(text);
    }
  };

  useEffect(() => {
    if (quantity >= 6 && showModal) {
      setShowManualInput(true);
    }
  }, [quantity, showModal]);

  const handleChooseQuantity = (value) => setQuantity(value);

  const quantityIsInvalid = () => {
    if (!quantity) {
      return true;
    }

    if (parseInt(quantity, 10) < 1) {
      return true;
    }

    if (isNaN(parseInt(quantity, 10))) {
      return true;
    }
  };

  return (
    <View style={[flex.directionRow, flex.alignItemsCenter]}>
      <Text style={[paddings["px-2"], styles.qtyText]}>QTY:</Text>
      <TouchableOpacity
        onPress={toggleModal}
        style={[
          flex.directionRow,
          flex.justifyContentSpace,
          flex.alignItemsCenter,
          paddings["py-2"],
          paddings["px-3"],
          { borderWidth: 1, borderRadius: 7, borderColor: "#747474" },
        ]}
      >
        <Text style={[styles.countText]}>{quantity}</Text>
        <View style={[paddings["pl-2"]]}>
          <Icon resizeMode="center" icon="chevron-down" size="small" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        onRequestClose={toggleModal}
        animationType="fade"
        transparent
      >
        <View
          style={{
            backgroundColor: "#00000080",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ backgroundColor: "#ffffff", padding: 20,borderRadius:10,width:'80%' }}>
            <View
              style={[
                flex.directionRow,
                flex.justifyContentSpace,
                flex.alignItemsCenter,
              ]}
            >
              <Text style={styles.modalTitle}>Select Quantity</Text>
              <TouchableOpacity onPress={toggleModal}>
                <Icon icon="close" color="active" size="medium" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalTitleSeparator} />

            <QuantityTouchable
              value="1"
              isSelected={quantity === "1" && !showManualInput}
              availableQuantity={availableQuantity}
              onChooseQuantity={handleChooseQuantity}
              afterPressCallback={() => setShowManualInput(false)}
            />
            <QuantityTouchable
              value="2"
              isSelected={quantity === "2" && !showManualInput}
              availableQuantity={availableQuantity}
              onChooseQuantity={handleChooseQuantity}
              afterPressCallback={() => setShowManualInput(false)}
            />
            <QuantityTouchable
              value="3"
              isSelected={quantity === "3" && !showManualInput}
              availableQuantity={availableQuantity}
              onChooseQuantity={handleChooseQuantity}
              afterPressCallback={() => setShowManualInput(false)}
            />
            <QuantityTouchable
              value="4"
              isSelected={quantity === "4" && !showManualInput}
              availableQuantity={availableQuantity}
              onChooseQuantity={handleChooseQuantity}
              afterPressCallback={() => setShowManualInput(false)}
            />
            <QuantityTouchable
              value="5"
              isSelected={quantity === "5" && !showManualInput}
              availableQuantity={availableQuantity}
              onChooseQuantity={handleChooseQuantity}
              afterPressCallback={() => setShowManualInput(false)}
            />
            <QuantityTouchable
              value="+"
              isSelected={showManualInput}
              availableQuantity={availableQuantity}
              onChooseQuantity={() => handleChoosePlusQuantity("-1")}
              afterPressCallback={() => {
                setShowManualInput(true);
                setOverQuantitySelected(false);
              }}
            />

            {showManualInput && availableQuantity >= 6 && (
              <View>
                <TextInput
                  style={styles.quantityManualInput}
                  placeholder="Add Quantity Here"
                  placeholderTextColor="#969696"
                  keyboardType="numeric"
                  onChangeText={handleChoosePlusQuantity}
                  value={quantity && quantity.toString()}
                  autoFocus
                />
                {overQuantitySelected && (
                  <Text
                    style={styles.quantityManualInputHint}
                  >{`Maximum quantity ${availableQuantity}`}</Text>
                )}
              </View>
            )}
            <Button
              label="Done"
              style={styles.doneButton}
              onPress={handleDone}
              disabled={quantityIsInvalid()}
              size="large"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  qtyText: {
    color: "#616161",
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.large,
  },
  countText: {
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.medium,
    marginRight: 5,
  },
  modalTitle: {
    color: "#313334",
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.large,
  },
  modalTitleSeparator: {
    backgroundColor: "#F5F5F5",
    height: 1,
    marginTop: 15,
    marginBottom: 20,
  },
  quantityManualInput: {
    fontFamily: Fonts.family.regular,
    textAlign: "center",
    borderBottomWidth: 1,
    borderColor: "#DADADA",
    marginHorizontal: 10,
    marginBottom: 10,
    color: "black",
  },
  quantityManualInputHint: {
    fontFamily: Fonts.family.regular,
    textAlign: "center",
    marginHorizontal: 10,
    color: "gray",
    fontSize: 10,
    ...margins["mb-4"],
  },
  doneButton: {
    ...paddings["py-3"],
  },
});

export default QuantityModalSelector;
