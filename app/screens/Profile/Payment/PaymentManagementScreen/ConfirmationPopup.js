import { Fonts } from '#themes';
import colors from '#themes/colors';
import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ConfirmationPopup = ({
  isVisible,
  title,
  description,
  onClose,
  primaryButtonText = 'Delete',
  secondaryButtonText = 'Cancel',
  onPressPrimaryButton,
  onPressSecondaryButton,
}) => {
  return (
    <Modal visible={isVisible} transparent onDismiss={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#00000060',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: 12,
              paddingVertical: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#F5F5F5',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.family.semiBold,
              }}
            >
              {title}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: Fonts.family.regular,
              padding: 18,
              textAlign: 'center',
            }}
          >
            {description}
          </Text>
          <TouchableOpacity
            onPress={() => {
              onPressPrimaryButton();
              onClose();
            }}
            style={[
              styles.modalTouchContainer,
              {
                width: '80%',
                borderRadius: 4,
                padding: 12,
                marginTop: 8,
                marginBottom: !onPressSecondaryButton ? 28 : 0,
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.msgText,
                {
                  color: 'white',
                },
              ]}
            >
              {primaryButtonText}
            </Text>
          </TouchableOpacity>
          {onPressSecondaryButton && (
            <TouchableOpacity
              onPress={() => {
                onPressSecondaryButton();
                onClose();
              }}
              style={[
                styles.modalTouchContainer,
                {
                  width: '80%',
                  borderRadius: 4,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  marginTop: 18,
                  marginBottom: 18,
                  backgroundColor: 'white',
                },
              ]}
            >
              <Text
                style={[
                  styles.msgText,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                {secondaryButtonText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  modalTouchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: Fonts.family.semiBold,
    color: '#313334',
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  msgText: {
    fontFamily: Fonts.family.semiBold,
    color: '#313334',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ConfirmationPopup;
