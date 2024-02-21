import { StyleSheet, PixelRatio } from "react-native";
import { Colors, Metrics, Fonts } from "#themes";
import { flex, paddings } from '#styles/utilities';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center'
    },
    contentContainer: {
        width:'100%',
        alignItems:'center',
        flexDirection:'row',
        flexWrap:'wrap'
    }, 
    mainCol:{
        width:175, 
        height:211,  
        marginLeft:18, 
        marginTop:20, 
        borderRadius:8, 
        elevation:1, 
        backgroundColor:'#fff'
    },
    ImgCol:{
        width:174.5, 
        height:156, 
        borderTopLeftRadius:7.5, 
        borderTopRightRadius:7.5,
    },
    img:{
        width: '100%', 
        height: 156, 
        borderTopLeftRadius:8, 
        borderTopRightRadius:8, 
        overflow:'hidden'
    },
    TitleCol:{
        width:175, 
        height:55, 
        borderTopWidth:1, 
        borderColor:'#F5F5F5', 
        borderBottomLeftRadius:7.5, 
        justifyContent:'center', 
        borderBottomRightRadius:7.5,
    },
    titleTxt:{
        color:'#313334', 
        fontSize:15, 
        left:10, 
    },
    subTitleTxt:{
        color:'#00BDAA', 
        fontSize:12, 
        left:10, top:0
    }
});
