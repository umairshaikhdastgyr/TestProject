import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getUpcoming } from '../redux/slices/TheMovieSlice';
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../theme/Colors';
import { WP } from '../theme/Dimensions';
import Styless from '../constants/Styless';

const genres = [
  { title: 'Comedies', imageURL: require("../assets/Comedies.png") },
  { title: 'Crime', imageURL: require("../assets/Crime.png") },
  { title: 'Family', imageURL: require("../assets/Family.png") },
  { title: 'Documentaries', imageURL: require("../assets/Documentaries.png") },
  { title: 'Dramas', imageURL: require("../assets/Dramas.png") },
  { title: 'Fantasy', imageURL: require("../assets/Fantasy.png") },
  { title: 'Holidays', imageURL: require("../assets/Holidays.png") },
  { title: 'Horror', imageURL: require("../assets/Horror.png") },
  { title: 'Sci-Fi', imageURL: require("../assets/Sci-Fi.png") },
  { title: 'Thriller', imageURL: require("../assets/Thriller.png") }
];

const SearchScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(getUpcoming(1));
  }, []);

  const renderMovieItem = ({ item }) => {
    return (
      <View style={styles.movieView}>
        <ImageBackground
          style={styles.movieContainer}
          source={item.imageURL}
        >
          <LinearGradient colors={['rgba(0,0,0,0)', Colors.black]} style={styles.gradient}>
            <Text style={styles.movieTitle}>{item.title}</Text>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.searchIcon} source={require('../assets/Search.png')} />
        <TextInput
          style={styles.input}
          placeholder='TV shows, movies and more'
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image style={styles.searchIcon} source={require('../assets/Close.png')} />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.flatList}
        data={genres}
        numColumns={2}
        keyExtractor={(item, index) => `${index}`}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>No item found</Text>
        )}
        renderItem={renderMovieItem}
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
    width: "89%",
    flexDirection: 'row',
    marginHorizontal: WP(6),
    marginVertical: WP(4),
    backgroundColor: Colors.grayMoreLight,
    borderRadius: WP(11),
    paddingHorizontal: WP(4),
    paddingVertical: WP(4),
  },
  searchIcon: {
    width: WP(5),
    height: WP(5),
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    marginLeft: WP(3),
  },
  flatList: {
    backgroundColor: Colors.grayMoreLight,
    paddingLeft: WP(3),
  },
  movieView: {
    width: "43%",
    marginLeft: WP(3.5)
  },
  movieContainer: {
    width: '100%',
    height: WP(25),
    backgroundColor: Colors.primary,
    borderRadius: WP(3),
    marginTop: WP(3.5),
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  gradient: {
    height: '40%',
    justifyContent: 'flex-end',
  },
  movieTitle: {
    ...Styless.semiBold(3.8, Colors.white),
    marginBottom: WP(5),
    marginLeft: WP(5),
  },
  emptyListText: {
    ...Styless.semiBold(4, Colors.primary),
    alignSelf: 'center',
    marginTop: WP(60),
  },
});

export default SearchScreen;
