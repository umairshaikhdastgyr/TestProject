import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../theme/Colors';
import YouTube from 'react-native-youtube';
import { WP } from '../theme/Dimensions';

const VideoScreen = ({ route }) => {
  const params = route?.params;
  const navigation = useNavigation();
  const [customer, setCustomer] = useState([]);

  useEffect(() => {
  
  }, []);

 
  return (
    <View style={styles.container}>
      <YouTube
        apiKey='AIzaSyBgjelZxMZrPgRZAV2Tw3loiNRtoKK3d64'
        videoId={params?.key} // The YouTube video ID
        play // control playback of video with true/false
        fullscreen // control whether the video should play in fullscreen or inline
        loop={false} // control whether the video should loop when ended
        onError={e => navigation.goBack()}
        style={{ alignSelf: 'stretch', height: "100%" }}
        onProgress={(progress)=>{
          console.log("@#4234234234324", progress);
        }}
      />
      <Pressable
      style={{width:WP(15), height:WP(15),position:"absolute", top:WP(5), right:0}}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Image style={{width:WP(10), height:WP(10), resizeMode:"contain", tintColor:Colors.white}} source={require('../assets/Close.png')} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

export default VideoScreen;
