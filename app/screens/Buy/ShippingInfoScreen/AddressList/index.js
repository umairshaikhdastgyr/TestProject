import * as React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import PropTypes from "prop-types";

import AddressListItem from "./AddressListItem";
import AddressListFooter from "./AddressListFooter";

import { Colors } from "#themes";

const AddressList = ({ addressList, handleAddressOnPress }) => {
  const navigation = useNavigation();
  const handleFooterOnPress = () => navigation.navigate("AddAddress");
  addressList?.sort((x, y) => {
    return x.default === y.default ? 0 : x.default ? -1 : 1;
  });
  return (
    <FlatList
      data={addressList}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item, index }) => (
        <AddressListItem item={item} index={index} handleOnPress={handleAddressOnPress} />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListFooterComponent={<AddressListFooter onPress={handleFooterOnPress} />}
      style={styles.container}
      contentContainerStyle={styles.content}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.grey,
  },
});

AddressList.defaultProps = {
  addressList: [],
  handleAddressOnPress: () => [],
};

AddressList.propTypes = {
  addressList: PropTypes.array.isRequired,
  handleAddressOnPress: PropTypes.func.isRequired,
};

export default AddressList;
