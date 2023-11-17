import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Styless, WP } from '../constants';
import { PButton } from '../components/Pressable';
import { searchProducts } from '../constants/ApiController';
import { InputText } from '../components/InputText';

const SearchScreen = ({ route }) => {
    const params = route?.params;
    const navigation = useNavigation();
    const [customer, setCustomer] = useState([]);
    const timeRef = useRef(null);


    const getCustomer = (text) => {
        searchProducts(text)
            .then((res) => {
                if (res?.products) {
                    setCustomer(res?.products);
                } else {
                    // Handle error or show a message
                }
            })
            .catch((error) => {
                console.error("API call error:", error);
                // Handle error or show a message
            });
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.category}>{item.category}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>

            <InputText
                containerStyle={{ margin: WP(5) }}
                inputProps={{
                    placeholder: "Search"
                }}
                onChangeText={(text) => {
                    timeRef.current && clearTimeout(timeRef.current)
                     timeRef.current = setTimeout(() => {
                        if (text.trim() !== '') {
                            getCustomer(text);
                        }else{
                            setCustomer([])
                        }
                      }, 500);
                }}
            />
            <FlatList
                style={styles.flatList}
                data={customer}
                refreshing={false}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>No Item Found</Text>
                )}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondary,
    },
    flatList: {
        flex: 1,
        paddingHorizontal: WP(7),
    },
    itemContainer: {
        borderBottomColor: Colors.secondarylightMore,
        borderBottomWidth: 2,
        paddingVertical: WP(5),
    },
    title: Styless.regular(4.5, Colors.primary),
    description: Styless.regular(3.5, Colors.white),
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

export default SearchScreen;
