import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import { Colors, Styless, WP } from '../constants';

export const Pressable = ({onPress, children, style, props }) => {
  return (
    <TouchableOpacity 
    style={[{justifyContent:"center", alignItems:"center"}, style]}
    {...props} onPress={onPress} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
};

export const PButton = ({ onPress, props, text, style, icon , textStyle, imageStyle, leftIcon, leftImageStyle}) => {
  return (
    <TouchableOpacity
      style={[{ backgroundColor: Colors.primary, justifyContent: "center", alignItems: "center" , height:WP(11), flexDirection:"row", borderRadius:WP(2)}, style, props?.disabled ?{opacity:0.6} : {}]}
      {...props} onPress={onPress} activeOpacity={0.7}>
      {leftIcon ? <Image
        style={[Styless.imageStyle(3.5),leftImageStyle]}
        source={leftIcon}
      /> : null}  
      {text ?<Text style={[Styless.semiBold(4, Colors.white),textStyle]}>{text}</Text> : null}
      {icon ? <Image
        style={[Styless.imageStyle(3.5),imageStyle]}
        source={icon}
      /> : null}
    </TouchableOpacity>
  );
};


