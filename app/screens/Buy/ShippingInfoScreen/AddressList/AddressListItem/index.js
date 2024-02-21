import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { BodyText, Icon } from '#components';
import { useNavigation } from '@react-navigation/native';
import colors from '#themes/colors';
import { useSelector } from "react-redux";
import { selectUserData } from "#modules/User/selectors";

const AddressListItem = ({ item, index, handleOnPress }) => {
  const navigation = useNavigation();
  const { addAddressState, information: userInfo } = useSelector(
    selectUserData()
  );
  
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={{ paddingVertical: 25, flex: 1 }}
        onPress={() => handleOnPress(item, index)}
      >
        <BodyText style={{color:item.default?colors.green:colors.black}} bold size="medium" theme="regular">
          {item.name}
        </BodyText>
        <BodyText style={{color:item.default?colors.green:colors.black,marginTop: 2.5,fontSize:14}}  size="medium" >
          {`${item.address_line_1} ${item.address_line_2} \n${item.city}, ${item.state} ${item.zipcode}`}
        </BodyText>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.editIconContainer}
        onPress={() =>
          navigation.navigate('AddAddress', { editable: true, address: item, userInfo })
        }
      >
        <Icon icon={item.default?"edit_active":"edit_grey"} style={styles.editIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});

AddressListItem.propTypes = {
  item: PropTypes.object.isRequired,
  handleOnPress: PropTypes.func.isRequired,
};

export default AddressListItem;
