import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Text, Image, SafeAreaView } from 'react-native';
import { styles } from './styles';
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';



const MyOrders = ({ navigation, route }) => {
    const [order, setOrder] = useState([]);

    useEffect(() => {
        getPostDetails()
      }, []);


    const getPostDetails = async () => {
        const post = await AsyncStorage.getItem("@orderDetails");
        const details = JSON.parse(post);
        if(details == null ){

        }else{
            
        setOrder(details.ret.data);
        }
      };

  return (
      <ScrollView>
    <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
        {order?.map((item, i) => (
        <TouchableOpacity style={styles.mainCol} onPress={() => navigation.navigate('NewMessageScreenSecond')}>
            <View style={styles.ImgCol}>
            <Image
                      source={{ uri: item?.Product?.ProductImages[0]?.urlImage }}
                      resizeMode="stretch"
                      style={styles.img} ></Image>
            </View>
            <View style={styles.TitleCol}>
                <Text style={styles.titleTxt}>{item.title}</Text>
                <Text style={styles.subTitleTxt}>Nice Shoes</Text>
            </View>
        </TouchableOpacity>
          ))} 
        
        </View>
      
    </SafeAreaView>
    </ScrollView>
  );
};



export default MyOrders;
