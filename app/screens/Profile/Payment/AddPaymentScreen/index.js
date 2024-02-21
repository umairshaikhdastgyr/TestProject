import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Icon } from "#components";
import { styles } from "./styles";

const METHODS = [
  {
    title: "Bank transfer in USD ($)",
    description: "Get paid in 5-7 business days. No fees.",
  },
  // {
  //   title: 'Paypal in USD ($)',
  //   description: 'Get paid in 3-4 hours. May include fees.',
  // },
  {
    title: "Add Card in USD ($)",
    description: "Get paid in 3-4 hours. May include fees.",
  },
];

const AddPaymentScreen = ({ navigation, route }) => {
  const onPress = (index) => {
    switch (index) {
      case 0:
        navigation.navigate("PaymentBankTransfer");
        break;
      // case 1:
      //   navigation.navigate("PayPalLogin");
      //   break;
      case 1:
        navigation.navigate("PaymentCard");
        break;
      default:
        break;
    }
  };

  const renderMethodItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.methodItemContainer}
        onPress={() => onPress(index)}
      >
        <View style={styles.mainItemContainer}>
          <Text style={styles.blackBoldText}>{item.title}</Text>
          <Text style={styles.headerText}>{item.description}</Text>
        </View>
        <Icon icon="chevron-right" style={styles.arrowIcon} />
      </TouchableOpacity>
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>COUNTRY</Text>
        <View style={styles.headerContentContainer}>
          <Text style={styles.headerText}>United States</Text>
          <Icon icon="chevron-down" style={styles.arrowIcon} />
        </View>
      </View>
      <FlatList
        data={METHODS}
        renderItem={renderMethodItem}
        keyExtractor={(item, index) => `key-${index}`}
        ItemSeparatorComponent={renderSeparator}
        style={styles.listContainer}
        scrollEnabled={false}
      />
    </SafeAreaView>
  );
};

export default AddPaymentScreen;
