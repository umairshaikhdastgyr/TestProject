import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import _ from "lodash";
import * as Progress from "react-native-progress";
import { Icon, EmptyState, Button, CachedImage } from "#components";
import { getUserFollowers } from "#services/apiUsers";
import { getUserInfo } from "#modules/User/actions";
import { BallIndicator } from "react-native-indicators";
import { getAddress } from "#utils";
import { Utilities } from "#styles";
import { Colors } from "#themes";
import { styles } from "./styles";
import images from "#assets/images";
import { useDispatch } from "react-redux";

const FollowersScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const GetUserInfo = (user) => dispatch(getUserInfo(user));
  const [followers, setFollowers] = useState([]);
  const [isFetching, setFetching] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    const fetchFollowers = async () => {
      setFetching(true);
      const res = await getUserFollowers(route?.params?.id ?? null);
      const errorMsg = _.get(res, "result.content.message", null);
      if (isSubscribed) {
        setFetching(false);
        if (errorMsg) {
          return alert(errorMsg);
        }
        setFollowers(res?.data);
      }
    };
    fetchFollowers();
    return () => (isSubscribed = false);
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route?.params?.title ?? "Followers",
      headerRight: null,
    });
  }, [navigation, route]);

  const onPress = (data) => {
    GetUserInfo({
      userId: data?.id,
      params: { light: true },
    });
    navigation.push("FollowerDetail", { data, from: "follower" });
  };

  const errorVal = [undefined, null, "null"];

  const renderItem = ({ item, index }) => {
    const imgURI = _.get(item, "profilepictureurl", null);
    const firstName = _.get(item, "firstName", "Undefined");
    const lastName = _.get(item, "lastName", "Undefined");
    const location = _.get(item, "location", null);
    const address = location && getAddress(location);
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onPress(item)}
      >
        <View style={styles.imgContainer}>
          {
            <CachedImage
              source={
                errorVal.includes(imgURI)
                  ? images.userPlaceholder
                  : { uri: imgURI }
              }
              style={styles.followerImg}
              indicator={Progress.Pie}
              indicatorProps={{
                size: 30,
                borderWidth: 0,
                color: Colors.primary,
                unfilledColor: Colors.white,
              }}
            />
          }
        </View>
        <View style={styles.itemSubContainer}>
          <Text style={styles.blackText}>{`${firstName} ${lastName}`}</Text>
          <Text style={styles.greyText}>{address || "No Location"}</Text>
        </View>
        <Icon icon="chevron-right" color="grey" style={styles.arrowIcon} />
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          icon="in-person"
          text="You have no Followers yet"
          style={styles.emptyState}
          iconStyle={styles.iconStyle}
        />
        <Button
          label="Start Selling"
          theme="secondary"
          size="large"
          onPress={() => navigation.navigate("SellMain")}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isFetching && (
        <FlatList
          data={followers}
          renderItem={renderItem}
          keyExtractor={(item, index) => `key-${index}`}
          style={styles.listContainer}
          ListEmptyComponent={renderEmpty()}
        />
      )}
      {isFetching && (
        <View style={Utilities.style.activityContainer}>
          <BallIndicator size={30} color={Colors.active} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default FollowersScreen;
