import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, Text, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../theme/Colors';
import LinearGradient from 'react-native-linear-gradient';
import { WP } from '../theme/Dimensions';
import { getMovieDetailes, getMovieVideo } from '../services/WatchService';
import { imageURL } from '../axiosInterceptor/api';
import { Pressable } from '../components/Pressable';
import Styless from '../constants/Styless';

const MovieDetailesScreen = ({ route }) => {
  const params = route?.params;
  const navigation = useNavigation();
  const [movieDetailes, setMovieDetailes] = useState([]);

  useEffect(() => {
    _getMovieDetailes();
  }, []);

  const _getMovieDetailes = async () => {
    const _movieDetailes = await getMovieDetailes(params.id);
    setMovieDetailes(_movieDetailes);
  };

  const _getMovieVideo = async () => {
    const movieVideo = await getMovieVideo(params.id);
    if(movieVideo?.results && movieVideo.results.length != 0){
      navigation.navigate("VideoScreen", movieVideo.results[0])
    }
  };

  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    return `#${randomColor}`;
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        source={{ uri: imageURL + params.poster_path }}
      >
        <Pressable style={{ flexDirection: "row", position:"absolute", top:WP(8) }}
        onPress={()=>navigation.goBack()}
        >
          <Image
            style={{width:WP(10), height:WP(7), resizeMode:"contain"}}
            source={require('../assets/UP.png')}
          />
           <Text style={Styless.semiBold(4, Colors.white)}>Watch</Text>
        </Pressable>
        <LinearGradient
          colors={['rgba(0,0,0,0)', Colors.black]}
          style={styles.gradient}
        >
          <Text style={[Styless.semiBold(4, Colors.white), styles.dateText]}>
            In theaters December {params.release_date}
          </Text>

          <Pressable style={styles.getTicketsButton}>
            <Text style={Styless.semiBold(4, Colors.white)}>Get Tickets</Text>
          </Pressable>

          <Pressable style={styles.watchTrailerButton}
            onPress={_getMovieVideo}
          >
            <Image
              style={styles.arrowIcon}
              source={require("../assets/arrow.png")}
            />
            <Text style={Styless.semiBold(4, Colors.white)}>Watch Trailer</Text>
          </Pressable>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <Text style={[Styless.semiBold(6.5, Colors.primary), styles.genresText]}>
          Genres
        </Text>

        <FlatList
          style={styles.genresContainer}
          data={movieDetailes.genres}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index)=> `${index}`}
          renderItem={({item, index}) => (
            <Text
              key={index}
              style={[
                Styless.semiBold(4, Colors.white),
                styles.genreText,
                {
                  marginLeft: index ? WP(4) : 0,
                  backgroundColor: generateColor(),
                },
              ]}
            >
              {item.name}
            </Text>
          )}
        />

        <View style={styles.separator} />

        <Text style={[Styless.semiBold(6.5, Colors.primary), styles.overviewText]}>
          Overview
        </Text>
        <Text style={Styless.regular(4, Colors.grayDark)}>
          {movieDetailes?.overview}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageBackground: {
    width: '100%',
    height: WP(100),
    justifyContent: 'flex-end',
  },
  gradient: {
    width: '100%',
    height: '70%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: WP(10),
  },
  dateText: {
    marginBottom: WP(3),
  },
  getTicketsButton: {
    backgroundColor: Colors.secondary,
    width: '60%',
    height: WP(16),
    borderRadius: WP(4),
  },
  watchTrailerButton: {
    width: '60%',
    height: WP(16),
    borderRadius: WP(4),
    borderWidth: 2,
    borderColor: Colors.secondary,
    marginTop: WP(4),
    flexDirection: 'row',
  },
  arrowIcon: {
    width: WP(4.5),
    height: WP(4.5),
    justifyContent: 'flex-end',
    resizeMode: 'contain',
    marginRight: WP(2),
  },
  contentContainer: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: WP(10),
  },
  genresText: {
    marginTop: WP(5),
  },
  genresContainer: {
    flexDirection: 'row',
    marginTop: WP(4),
  },
  genreText: {
    marginLeft: WP(4),
    paddingHorizontal: WP(3),
    paddingVertical: WP(2),
    borderRadius: WP(4),
    overflow: 'hidden',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.grayLight,
    marginVertical: WP(5),
  },
  overviewText: {
    marginBottom: WP(5),
  },
});

export default MovieDetailesScreen;
