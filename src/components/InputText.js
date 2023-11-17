import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { Colors, Styless, WP } from '../constants';
import { PButton } from './Pressable';


export const regux = {
  NUMBER : /\D/g,
  NO_SPACE : /\s/g
}


export const InputText = forwardRef(({ preAdded , defultValue = '', sourceLeft, sourceRight, sourcePress=()=>{}, inputProps={}, validation, containerStyle, style, onChangeText, inputStyle, addInfo, infoStyle, sourceRightStyle, info},ref) => {
  const [value, setValue] = useState(defultValue)

  useImperativeHandle(ref,()=>({
    getValue(){
      return value
    },
    clear(){
      return setValue(defultValue)
    }
  }))

  return (
    <View style={[{  }, containerStyle]}>
      {inputProps.placeholder ?
      <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"flex-end"}}>
       <Text style={[Styless.regular(4, Colors.white), { marginBottom: WP(2) }]}>{inputProps.placeholder}</Text> 
       {addInfo ? <Text style={[Styless.regular(3, Colors.white), { marginBottom: WP(2) }]}>{addInfo}</Text> : null}
       </View> 
       : null}
      <View style={[{ flexDirection: "row", borderWidth: 1, borderColor: Colors.grayMain, alignItems: "center" , borderRadius:WP(2), backgroundColor:Colors.secondarylight}, style]}>
        {sourceLeft ? <Image
          style={[Styless.imageStyle(8), { marginLeft: WP(4) }]}
          source={sourceLeft}
        /> : null}
        <TextInput
         value={value}
          style={[Styless.regular(3.5, Colors.white), { flex: 1, height: WP(12), paddingLeft: WP(2), paddingLeft: WP(5) },inputStyle]}
          placeholderTextColor={Colors.graytext}
          {...inputProps}
          onChangeText={(text) => {
            let validText = text
            if(validation){
               validText = validText.replace(validation, "")
               validText.trim();
            }
            setValue(validText)
            onChangeText && onChangeText(validText)
          }}
        />
        {sourceRight ? <PButton
          onPress={sourcePress}
          style={{ backgroundColor: Colors.transparent, paddingHorizontal: WP(4) }}
          imageStyle={[Styless.imageStyle(8),sourceRightStyle]}
          icon={sourceRight}
        /> : null}
      </View>
      {info ? <Text style={[Styless.regular(3, Colors.white+80), { marginLeft:WP(2), marginTop:WP(1)},infoStyle]}>{info}</Text> : null}
    </View>
  );
});


export const InputPassword = forwardRef(({ inputProps = {}, validation, containerStyle, style, onChangeText, inputStyle , info, infoStyle}, ref) => {
  const [value, setValue] = useState('')
  const [showPass, setShowPass] = useState(false)

  useImperativeHandle(ref,()=>({
    getValue(){
      return value
    }
  }))

  return (
    <View style={[{}, containerStyle]}>
      {inputProps.placeholder ? <Text style={[Styless.regular(4, Colors.white), { marginBottom: WP(2) }]}>{inputProps.placeholder}</Text> : null}
      <View style={[{ flexDirection: "row", borderWidth: 1, borderColor: Colors.grayMain, alignItems: "center", borderRadius: WP(2) , backgroundColor:Colors.secondarylight}, style]}>
        <TextInput
          {...(validation ? { value: value } : {})}
          style={[Styless.regular(3.5, Colors.white), { flex: 1, height: WP(12), paddingLeft: WP(2), paddingLeft: WP(5) }, inputStyle]}
          placeholderTextColor={Colors.graytext}
          secureTextEntry={!showPass}
          {...inputProps}
          onChangeText={(text) => {
            const validText = text.trim()
            setValue(validText)
            onChangeText && onChangeText(validText)
          }}
        />
       <PButton
          onPress={() => {
            setShowPass((p) => !p)
          }}
          style={{ backgroundColor: Colors.transparent, paddingHorizontal: WP(4) }}
          imageStyle={Styless.imageStyle(8, Colors.white)}
          icon={showPass ? require('../assets/eye.png') : require('../assets/eyeCross.png')}
        /> 
      </View>
      {info ? <Text style={[Styless.regular(3, Colors.white+80), { marginLeft:WP(2), marginTop:WP(1)},infoStyle]}>{info}</Text> : null}
    </View>
  );
});

