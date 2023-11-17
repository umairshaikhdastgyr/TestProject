import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Styless, WP } from '../constants';
import { getProduct } from '../constants/ApiController';

const ProductScreen = ({ route }) => {
  const params = route?.params;
  const navigation = useNavigation();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    getCustomer();
  }, []);

  const getCustomer = () => {
    getProduct(params)
      .then((res) => {
        if (res) {
          setCustomer(res);
        } else {
          // Handle error or show a message
        }
      })
      .catch((error) => {
        console.error("API call error:", error);
        // Handle error or show a message
      });
  };

    if (!customer) {
        return <View style={styles.container}/>
    }

    return (
        <View style={styles.container}>
            <View style={styles.itemContainer}>
                <Text style={styles.title}>{customer.title}</Text>
                <Text style={styles.description}>Description: {customer.description}</Text>
                <Text style={styles.description}>Price: {customer.price}</Text>
                <Text style={styles.description}>Discount Percentage: {customer.discountPercentage}</Text>
                <Text style={styles.description}>Rating: {customer.rating}</Text>
                <Text style={styles.description}>Stock: {customer.stock}</Text>
                <Text style={styles.description}>Category: {customer.category}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    padding:WP(5)
  },
  itemContainer: {
    borderBottomColor: Colors.secondarylightMore,
    borderBottomWidth: 2,
    paddingVertical: WP(5),
  },
  title: Styless.regular(4.5, Colors.primary),
  description: {
    ...Styless.regular(3.5, Colors.white),
    marginTop:WP(3)
},
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: Styless.regular(3.5, Colors.white),
  category: Styless.regular(3.5, Colors.white),
  emptyText: {
    alignSelf: "center",
    paddingVertical: WP(5),
    ...Styless.regular(4, Colors.white),
  },
  addButton: {
    width: WP(14),
    height: WP(14),
    borderRadius: WP(7),
    position: "absolute",
    bottom: WP(10),
    right: WP(10),
  },
  addButtonImage: Styless.imageStyle(6, Colors.white),
});

export default ProductScreen;
