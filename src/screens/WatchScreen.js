import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SliceTheMovie, getUpcoming } from '../redux/slices/TheMovieSlice';
import { imageURL } from '../axiosInterceptor/api';
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../theme/Colors';
import { WP } from '../theme/Dimensions';
import Styless from '../constants/Styless';

const WatchScreen = ({ route }) => {
  const params = route?.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { upcomingMovies } = useSelector(SliceTheMovie);

  useEffect(() => {
    dispatch(getUpcoming(1));
  }, []);

  const renderMovieItem = ({ item }) => {
    return (
      <TouchableOpacity
      onPress={()=> navigation.navigate("MovieDetailesScreen", item)}
      >
        <ImageBackground
          style={styles.movieContainer}
          source={{ uri: imageURL + item.poster_path }}
        >
          <LinearGradient colors={['rgba(0,0,0,0)', Colors.black]} style={styles.gradient}>
            <Text style={styles.movieTitle}>{item.title}</Text>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  // const handleEndReached = () => {
  //   // You can load more data when reaching the end
  //   dispatch(getUpcoming(upcomingPageNo + 1));
  // };

  const searchIconPress = () => {
    navigation.navigate("SearchScreen")
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={Styless.semiBold(4)}>Watch</Text>
        <TouchableOpacity
        onPress={searchIconPress}
        >
          <Image style={styles.searchIcon} source={require('../assets/Search.png')} />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.flatList}
        data={upcomingMovies}
        keyExtractor={(item)=> `${item.id}`}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>No item found</Text>
        )}
        renderItem={renderMovieItem}
        // onEndReached={handleEndReached} Not using pagination because ID is not unique 
        // onEndReachedThreshold={0.1}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: WP(6),
  },
  searchIcon: {
    width: WP(5),
    height: WP(5),
    resizeMode: 'contain',
  },
  flatList: {
    paddingHorizontal: WP(5),
    backgroundColor: Colors.grayMoreLight
  },
  movieContainer: {
    width: '100%',
    height: WP(40),
    backgroundColor: Colors.primary,
    borderRadius: WP(3),
    marginTop: WP(5),
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  gradient: {
    height: '30%',
    justifyContent: 'flex-end',
  },
  movieTitle: {
    ...Styless.bold(4, Colors.white),
    marginBottom: WP(5),
    marginLeft: WP(5),
  },
  emptyListText: {
    ...Styless.semiBold(4, Colors.primary),
    alignSelf: 'center',
    marginTop: WP(60),
  },
});

export default WatchScreen;
