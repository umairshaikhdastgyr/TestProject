import React from "react";

import { TouchableOpacity } from "react-native";
import { Icon } from "#components";

const EditButton = ({ navigation, to, params }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate(to, params)}>
      <Icon icon="edit" color="grey" />
    </TouchableOpacity>
  );
};
export default EditButton;
