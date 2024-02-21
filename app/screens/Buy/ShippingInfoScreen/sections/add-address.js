import React, {useState} from 'react';
import {View, StyleSheet, Text, Keyboard, TouchableOpacity} from 'react-native';
import {Heading, InputText, CheckBoxSquare, Toast} from '#components';
import {TextInputMask} from 'react-native-masked-text';
import {Colors, Fonts, Metrics} from '#themes';
import states from '#utils/us_states.json';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserData} from '#modules/User/selectors';
import ModalSelector from 'react-native-modal-selector';
import colors from '#themes/colors';

const AddAddressForm = ({
  address,
  handleOnChange,
  isDefault,
  onDefaultChange,
  errorMessage,
  toastMessage,
  showDefaultBtn,
}) => {
  const {addressListState, addAddressState, paymentMethodDefault} = useSelector(
    selectUserData(),
  );
  const [stateModal, showStateModal] = useState(false);
  return (
    <>
      <Toast
        message={toastMessage.message}
        isVisible={toastMessage.isVisible}
      />
      <Heading
        type="bold"
        style={{fontSize: 15, textAlign: 'left', color: '#313334'}}>
        Full Name
      </Heading>
      <InputText
        placeholder="Full Name"
        placeholderTextColor={Colors.inactiveText}
        name="name"
        value={address.name}
        fullWidth
        textAlign="left"
        onChangeText={value => handleOnChange('name', value)}
        onSubmitEditing={() => Keyboard.dismiss()}
        style={{fontSize: 16, paddingLeft: 0}}
        bottomLineColor={colors.blackLight}
      />
      <Heading type="bold" style={styles.heading}>
        Address 1
      </Heading>
      <InputText
        placeholder="Address 1"
        placeholderTextColor={Colors.inactiveText}
        name="address_line_1"
        value={address.address_line_1}
        fullWidth
        textAlign="left"
        onChangeText={value => handleOnChange('address_line_1', value)}
        onSubmitEditing={() => Keyboard.dismiss()}
        style={{fontSize: 16, paddingLeft: 0}}
        bottomLineColor={colors.blackLight}
      />
      <Heading type="bold" style={styles.heading}>
        Address 2
      </Heading>
      <InputText
        placeholder="Address 2"
        placeholderTextColor={Colors.inactiveText}
        name="address_line_2"
        value={address.address_line_2}
        fullWidth
        textAlign="left"
        onChangeText={value => handleOnChange('address_line_2', value)}
        onSubmitEditing={() => Keyboard.dismiss()}
        style={{fontSize: 16, paddingLeft: 0}}
        bottomLineColor={colors.blackLight}
      />
      <Heading type="bold" style={styles.heading}>
        City
      </Heading>
      <InputText
        placeholder="City"
        placeholderTextColor={Colors.inactiveText}
        name="city"
        value={address.city}
        fullWidth
        textAlign="left"
        onChangeText={value => handleOnChange('city', value)}
        onSubmitEditing={() => Keyboard.dismiss()}
        style={{fontSize: 16, paddingLeft: 0}}
        bottomLineColor={colors.blackLight}
      />
      <Heading type="bold" style={styles.heading}>
        State
      </Heading>
      <ModalSelector
        cancelStyle={{display: 'none'}}
        optionContainerStyle={{
          marginVertical: 20,
          backgroundColor: '#FFFFFF',
        }}
        optionStyle={{borderBottomWidth: 0, paddingVertical: 15}}
        optionTextStyle={{
          fontFamily: 'Montserrat-SemiBold',
          color: '#000000',
          textAlign: 'left',
        }}
        animationType="fade"
        visible={stateModal}
        onModalClose={() => {
          showStateModal(false);
        }}
        data={states.map((a, b) => {
          return {...a, key: b};
        })}
        initValue=""
        onChange={item => {
          handleOnChange('state', item.value);
        }}
        customSelector={
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              showStateModal(true);
            }}>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: colors.blackLight,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color:
                    address?.state?.length == 0
                      ? Colors.inactiveText
                      : Colors.black,
                  fontFamily: 'Montserrat-Regular',
                  marginTop: 8,
                  marginBottom: 3,
                }}>
                {address?.state?.length == 0 ? 'State' : address?.state}
              </Text>
            </View>
            {/* <InputText
              placeholder="State"
              placeholderTextColor={Colors.inactiveText}
              name="city"
              value={address.state}
              fullWidth
              textAlign="left"
              editable={false}
              onChangeText={(value) => handleOnChange("city", value)}
              onSubmitEditing={() => Keyboard.dismiss()}
              style={{fontSize:16,paddingLeft:0}}
              bottomLineColor={colors.blackLight}

            /> */}
          </TouchableOpacity>
        }></ModalSelector>
      <Heading type="bold" style={styles.heading}>
        Zip Code
      </Heading>
      <TextInputMask
        placeholder="Zip Code"
        placeholderTextColor={Colors.inactiveText}
        type="custom"
        keyboardType="numeric"
        onChangeText={value => handleOnChange('zipcode', value)}
        options={{mask: '99999-9999'}}
        value={address.zipcode}
        style={
          errorMessage.zipcode
            ? [styles.zipInput, styles.invalidField]
            : styles.zipInput
        }
        onSubmitEditing={() => Keyboard.dismiss()}
        maxLength={5}
      />
      {errorMessage.zipcode ? (
        <Text style={styles.invalidErrorMessage}>{errorMessage.zipcode}</Text>
      ) : null}
      <View style={{marginTop: 25}}>
        {addressListState?.data?.length &&
        addressListState?.data?.length >= 1 &&
        !address?.default ? (
          <CheckBoxSquare
            label="Set as default"
            active={isDefault}
            onChange={onDefaultChange}
          />
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    marginTop: 20,
    fontSize: 15,
    textAlign: 'left',
    color: '#313334',
  },
  zipInput: {
    ...Fonts.style.homiBodyTextMedium,
    color: Colors.black,
    borderBottomWidth: 1,
    borderBottomColor: Colors.blackLight,
    paddingTop: 10,
    paddingBottom: 6,
    paddingLeft: 0,
    fontSize: 16,
  },
  invalidField: {
    borderBottomColor: Colors.red,
  },
  invalidErrorMessage: {
    color: Colors.red,
  },
});

AddAddressForm.defaultProps = {
  isDefault: false,
  errorMessage: {
    address: '',
    zipcode: '',
  },
  toastMessage: {
    isVisble: false,
    message: '',
  },
  onDefaultChange: () => [],
  handleOnChange: () => [],
  address: {
    name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zipcode: '',
  },
};

AddAddressForm.propTypes = {
  address: PropTypes.object.isRequired,
  isDefault: PropTypes.bool.isRequired,
  onDefaultChange: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  errorMessage: PropTypes.object.isRequired,
  toastMessage: PropTypes.object.isRequired,
};

export default AddAddressForm;
