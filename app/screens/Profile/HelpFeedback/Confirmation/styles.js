import { StyleSheet, PixelRatio } from "react-native";
import { Colors, Metrics, Fonts } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  contentContainer: {
    flexDirection: "column",
    marginVertical: 30,
    paddingHorizontal: 15,
    alignItems: "center",
    marginTop: 170,
    flex: 1
  },
  containerTitle: {
    ...Fonts.style.shareText,
    color: Colors.black,
    marginBottom: 20,
    marginVertical: 20
  },
  containerItemText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    marginHorizontal: 65,
    textAlign: "center"
  },
  button:{
    width:283,
    height:54,
    marginTop:'30%',
    borderWidth:1.5,
    alignItems:'center',
    justifyContent:'center',
    borderColor:"#7471FF",
    borderRadius:10
},
btnText:{
    fontSize:16,
    color:'#7471FF'
}
});
