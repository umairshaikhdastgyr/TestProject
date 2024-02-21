import React from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

export const BirthDatePicker = ({
  isShowDatePicker,
  value,
  onChangeDate,
  onCancel,
  onConfirm,
  subtract18Years = false,
}) => {
  return (
    <DateTimePickerModal
      date={value}
      isVisible={isShowDatePicker}
      mode="date"
      onConfirm={onConfirm}
      onCancel={onCancel}
      maximumDate={
        subtract18Years
          ? new Date(moment(new Date()).subtract(18, "years"))
          : new Date()
      }
    />
  );
};
