
import React, { useState,useEffect } from 'react';
import { View, StyleSheet, TextInput, Text,TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const PriceRange = ({
    setFilterValue,
    filterValues
}) => {
  
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);

  useEffect(() => {
    const mdigit=filterValues?.priceRange[0];
    setMin(mdigit);
    const maxdigit=filterValues?.priceRange[1];
    setMax(maxdigit);
  }, [])

  const changeMin=(e)=>{
    const digit=Number(e);
    setMin(digit);
    const data=[digit,filterValues?.priceRange[1]];

    setFilterValue({ priceRange: data }); 
  }

  const changeMax=(e)=>{
    const digit=Number(e);
    setMax(digit);
    const data=[filterValues?.priceRange[0],digit];

    setFilterValue({ priceRange: data });   
  }
  return (
    <>
     
      <View style={{width:'90%', alignSelf:'center', marginTop:'6%'}}>
        
          <Text style={{fontSize:18, color:'#313334', fontWeight:'700'}}>Price Range</Text>

        
      </View>

      <View style={{width:'92%', alignSelf:'center', flexDirection:'row', marginTop:'5%', marginBottom:'10%' }}>
        <View style={{width:'45%', }}>
          <View style={{flexDirection:'row', borderWidth:1, borderColor:'#969696', borderRadius:7, width:155, height:45}}>

         <Text style={{fontSize:20, top:7, color:'#969696', marginLeft:4}}>$</Text>
        <TextInput
              style={styles.textArea1}
              placeholder="Min"
              maxLength={7}
              value={JSON.stringify(filterValues?.priceRange[0])}

              keyboardType="numeric"
              onChangeText={(e)=>changeMin(e)}
              minLength={0}
              placeholderTextColor="grey"
              
            />

            <TouchableOpacity onPress={()=> {
                setFilterValue({ priceRange: [0,filterValues?.priceRange[1]] }); 

            }
            }>
            <Ionicons
              name="close-outline"
              size={35}
              style={{right:4.5, top:3,}}
              color="#969696"
            />
            </TouchableOpacity>
            </View>
        </View>
        <View style={{width:'10%', alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontSize:16, color: "#ADB2B6",}}>to</Text>
        </View>
        <View style={{width:'45%', alignItems:'flex-end'}}>
        <View style={{flexDirection:'row', borderWidth:1, borderColor:'#969696', borderRadius:7, width:155, height:45}}>
        <Text style={{fontSize:20, color:'#969696', top:7, marginLeft:4}}>$</Text>
            <TextInput
              style={styles.textArea1}
              placeholder="Max"
              keyboardType="numeric"
              maxLength={7}
              value={JSON.stringify(filterValues?.priceRange[1])}
              onChangeText={(e)=>changeMax(e)}
              placeholderTextColor="grey"
            />
            <TouchableOpacity onPress={()=> {
                setFilterValue({ priceRange: [filterValues?.priceRange[0], 0] }); 
            }}>
            <Ionicons
              name="close-outline"
              size={35}
              style={{right:4.5, top:3,}}
              color="#969696"
            />
            </TouchableOpacity>
            </View>
        </View>
      </View>
     
    </>
  );
};

const styles = StyleSheet.create({
  
  
  textArea1: {
    width: "65%",
    fontSize: 16,
    marginLeft:2,
    justifyContent: "flex-start",
    color: "#969696",
  },
});

export default PriceRange;
