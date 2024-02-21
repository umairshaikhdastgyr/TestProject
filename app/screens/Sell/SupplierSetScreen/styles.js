import { StyleSheet, PixelRatio } from "react-native";
import { Colors, Metrics, Fonts } from "#themes";

export const styles = StyleSheet.create({
  button: {
  paddingHorizontal: 16,
  backgroundColor:'#7471FF',
  width:335,
  alignSelf:'center',
  flexDirection:'row',
  height:52,
  borderWidth:1,
  borderColor:'#7471FF',
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
},
button__text: {
  ...Fonts.style.buttonText,
  fontFamily: Fonts.family.semiBold,
  color: '#fff',
  fontWeight: '600',
  fontSize: 16,
  textAlign: 'center',
},
});
