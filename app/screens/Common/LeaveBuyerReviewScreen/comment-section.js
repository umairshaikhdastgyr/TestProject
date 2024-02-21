import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors, Fonts } from '#themes';
import { InputText } from '#components';

const BuyerCommentSection = ({ comment, setComment }) => (
  <View style={styles.container}>
    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20}}>
      
    <Text
      style={{
        fontFamily: Fonts.family.semiBold,
        fontSize: 14,
        // textAlign: 'left',
        // width: '100%',
        
      }}
      >
      Feel free to elaborate further:
    </Text>
    <Text
      style={{
       color:'#B9B9B9'
      }}
      >
      0/1500 
    </Text>
      </View>

    <View style={{ width: '100%' }}>
      <InputText
        placeholder="Type Here"
        // placeholderTextColor={Colors.black}
        multiline
        numberOfLines={4}
        placeholderTextColor={"#B9B9B9"}
        textAlign="left"
        value={comment}
        fullWidth
        onChangeText={value => setComment(value)}
        maxLength={500}
        returnKeyType={'default'}
        style={{ fontSize: 14, paddingHorizontal: 20 }}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    justifyContent: 'center',
  },
});
export default BuyerCommentSection;
