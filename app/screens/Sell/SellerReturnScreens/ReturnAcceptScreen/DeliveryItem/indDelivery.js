
import React from 'react';
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,Keyboard
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors, Fonts } from '#themes';
import { Icon } from '#components';
import SelectedPhotos from '../../../MainScreen/views/selected-photos';
import {
  InputText,
} from "#components";
const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 20,
    marginVertical: 18,
  },

  inputLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    color: '#000',
    fontWeight: '600',
  },
  uploadLabelText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: '#313334',
    fontWeight: '500',
    marginLeft: 5,
  },
  uploadLabelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.active,
    borderWidth: 1,
    borderRadius: 25,
    padding: 12,
  },
  inputText: {
    fontSize: 15,
    color: '#000000',
    fontFamily: Fonts.family.regular,
    borderBottomWidth: 1,
    borderBottomColor: '#B9B9B9',
    padding: 0,
    paddingVertical: 5
  },
  carrierInputText: {
    fontSize: 15,
    color: Colors.active,
    fontFamily: Fonts.family.regular,
    padding: 0
  },
  carrierInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#B9B9B9',
    paddingBottom: 0,
    paddingLeft: 0,
  },

  carrierInputSelect: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    color: '#313334',
    fontWeight: '600',
    textDecorationLine: 'underline',
    margin: 10,
  },
  redText: {
    ...Fonts.style.homiTagText,
    color: Colors.red,
  },
  scrollContainer: {
    marginBottom: 100,
    paddingHorizontal: 20,
    marginTop: 20,
  },
});

const IndDelivery = ({
  onSetLabel,
  shProvider,
  navigation,
  returnLabel,
  actions,
  type,
}) => (
  <>

    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { marginBottom: 20 }]}>Add Label :</Text>
      <TouchableOpacity style={styles.uploadLabelButton} onPress={onSetLabel}>
        <Icon icon="camera_active" />
        <Text style={styles.uploadLabelText}>
          {type === 'edit'
            ? 'Choose Another Label'
            : 'Upload Label'}
        </Text>
      </TouchableOpacity>
    </View>
    <SelectedPhotos type="edit-label" />
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Carrier</Text>
      <View style={styles.carrierInputContainer}>
        <View style={{ flex: 1 }}>
          <TextInput
            placeholderTextColor={Colors.inactiveText}
            placeholder="Choose an Option"
            style={styles.carrierInputText}
            value={shProvider}
            editable={false}
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('SelectCarrier')}>
          <Text style={styles.carrierInputSelect}>SELECT</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Tracking Number</Text>
      <TextInput
        placeholderTextColor={Colors.inactiveText}
        placeholder="Type Here"
        style={styles.inputText}
        value={returnLabel.trackingNumber}
        onChangeText={(text) => actions.setReturnLabel({ ...returnLabel, trackingNumber: text })}
        onSubmitEditing={()=>{Keyboard.dismiss()}}
        returnKeyType='done'
        blurOnSubmit
      />

    </View>
    {/* <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Shipping Cost</Text>
              <TextInput
                placeholderTextColor={Colors.inactiveText}
                placeholder="Type Here"
                style={styles.inputText}
                value={returnLabel.shippingCost}
                onChangeText={(text) => moneyChecker(text)}
              />
              {errAmount !== '' && <Text style={styles.redText}>{errAmount}</Text>}
            </View> */}
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Instructions (optional)</Text>
      <InputText
        placeholder="Type Here"
        fullWidth
        textAlign="left"
        value={returnLabel.instruction}
        onChangeText={(text) => actions.setReturnLabel({ ...returnLabel, instruction: text })}
        maxLength={500}
        returnKeyType="done"
        multiline
        numberOfLines={6}
        style={{ fontSize: 15 }}
        onSubmitEditing={()=>{Keyboard.dismiss()}}
        blurOnSubmit
      />
      {/* <TextInput
        placeholderTextColor={Colors.inactiveText}
        placeholder="Type Here"
        style={styles.inputText}
        value={returnLabel.instruction}
        multiline
        numberOfLines={4}
        onChangeText={(text) => actions.setReturnLabel({ ...returnLabel, instruction: text })}
      /> */}

    </View>

  </>
);

export default IndDelivery;
