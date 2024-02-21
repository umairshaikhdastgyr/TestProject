import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Modal, ModalContent} from 'react-native-modals';
import {Colors, Fonts, Metrics} from '#themes';


let actualDateString = '';
let actualTimeString = '';

const CustomDateTimePicker = ({visible, value, onCancel, onConfirm}) => {
  const [date, setDate] = useState(value);
  const [type, setType] = useState('date');

  useEffect(() => {
    if (visible === true) {
      setDate(value);
    }
  }, [visible]);

  const onChangeDate = (event, d) => {
    //check for android / ios
    if (Platform.OS === 'ios') {
      setDate(new Date(d));
    } else {
      switch (event.type) {
        case 'dismissed':
          onCancel();
          break;
        case 'set':
          if (type === 'date') {
            actualDateString = d;
            setType('time');
          } else if (type === 'time') {
            actualTimeString = d;
            onCancel();
            setType('date');

            const dateObj = new Date(actualDateString);
            const timeObj = new Date(actualTimeString);
            const dateTimeObj = new Date(
              dateObj.getFullYear(),
              dateObj.getMonth(),
              dateObj.getDate(),
              timeObj.getHours(),
              timeObj.getMinutes(),
              timeObj.getSeconds(),
            );
            onConfirm(dateTimeObj);
          }
          break;
        default:
          onCancel();
          break;
      }
    }
  };

  const onConfirmPrev = () => {
    onConfirm(date);
  };

  if (Platform.OS === 'ios') {
    return (
      <Modal.BottomModal
        visible={visible}
        onTouchOutside={() => {
          onCancel();
        }}>
        <ModalContent style={styles.datePickerContainer}>
          <View style={styles.datePickerButtonContainer}>
            <TouchableOpacity style={styles.buttonContainer} onPress={onCancel}>
              <Text style={styles.pickerText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={onConfirmPrev}>
              <Text style={styles.pickerText}>Confirm</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={date || new Date()}
            mode="datetime"
            is24Hour={false}
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()}
            minuteInterval={10}
          />
        </ModalContent>
      </Modal.BottomModal>
    );
  } else {
    if (visible === true) {
      return (
        <DateTimePicker
          value={date || new Date()}
          mode={type}
          is24Hour={false}
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()}
          minuteInterval={10}
        />
      );
    } else {
      return null;
    }
  }
};

const styles = StyleSheet.create({
  datePickerContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.15,
  },
  datePickerButtonContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inactiveShape,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerText: {
    ...Fonts.style.buttonText,
    color: Colors.black,
  },
});

export default CustomDateTimePicker;
