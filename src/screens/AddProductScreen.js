import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors, Styless, WP } from '../constants';
import { PButton } from '../components/Pressable';
import {  InputText } from '../components/InputText';
import { addProducts } from '../constants/ApiController';
import { useNavigation } from '@react-navigation/native';

const AccountScreen = ({route}) => {
    const params = route?.params;

    const navigation = useNavigation();
    const [title,setTitle] = useState('');
    const [description, setGescription] = useState('');
    const [price, setprice] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [rating, setRating] = useState('');

    

    const _addProducts = () => {
        if (title != "" && description != "" && price != "" && discountPercentage != "" && rating != "") {
            addProducts({ title, description, price, discountPercentage, rating })
                .then((res) => {
                    console.log("324235234523", res);
                    if (res?.id) {
                        params.onSubmit()
                        navigation.goBack();
                    } else {
                        // Handle error or show a message
                    }
                })
                .catch((error) => {
                    console.error("API call error:", error);
                    // Handle error or show a message
                });
        } else {
            alert("All fields are required.")
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.loginContainer}>
                <InputText
                    containerStyle={styles.inputContainer}
                    inputProps={{
                        placeholder: "Enter title",
                    }}
                    onChangeText={(text) => setTitle(text)}
                />

                <InputText
                    containerStyle={styles.inputContainer}
                    inputProps={{
                        placeholder: "Enter Description",
                    }}
                    onChangeText={(text) => setGescription(text)}
                />


                <InputText
                    containerStyle={styles.inputContainer}
                    inputProps={{
                        placeholder: "Enter price",
                    }}
                    onChangeText={(text) => setprice(text)}
                />


                <InputText
                    containerStyle={styles.inputContainer}
                    inputProps={{
                        placeholder: "Enter discoun percentag",
                    }}
                    onChangeText={(text) => setDiscountPercentage(text)}
                />


                <InputText
                    containerStyle={styles.inputContainer}
                    inputProps={{
                        placeholder: "Enter rating",
                    }}
                    onChangeText={(text) => setRating(text)}
                />


                <PButton
                    style={styles.loginButton}
                    text={'Add product'}
                    onPress={_addProducts}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondary,
        paddingHorizontal: WP(7),
    },
    userInfoContainer: {
        flex: 1,
        alignItems: "center",
        marginTop: WP(5),
    },
    loginContainer: {
        flex: 1,
        marginTop: WP(5),
    },
    label: Styless.regular(3, Colors.white),
    info: Styless.regular(4, Colors.white),
    inputContainer: {
        marginTop: WP(5),
    },
    loginButton: {
        marginTop: WP(6),
    },
    logoutButton: {
        marginTop: WP(6),
        width: "100%",
    },
});

export default AccountScreen;
