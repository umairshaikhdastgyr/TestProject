import React, { useState, useEffect, useCallback } from "react";
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
import { getUserFollowing } from "#services/apiUsers";
import { getUserInfo } from "#modules/User/actions";
import { BallIndicator } from "react-native-indicators";
import { getAddress } from "#utils";
import { Utilities } from "#styles";
import { Colors } from "#themes";
import { styles } from "./styles";
import images from "#assets/images";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

const FollowingScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const GetUserInfo = (user) => dispatch(getUserInfo(user));
  const [following, setFollowing] = useState([]);
  const [isFetching, setFetching] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isSubscribed = true;
      const fetchFollowing = async () => {
        setFetching(true);
        const res = await getUserFollowing(route?.params?.id ?? null);
        const errorMsg = _.get(res, "result.content.message", null);
        if (isSubscribed) {
          setFetching(false);
          if (errorMsg) {
            return alert(errorMsg);
          }
          setFollowing(res?.data);
        }
      };
      fetchFollowing();
      return () => (isSubscribed = false);
    }, [])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route?.params?.title ?? "Following",
      headerRight: null,
    });
  }, [navigation, route]);

  const onPress = (data) => {
    GetUserInfo({
      userId: data?.id,
      params: { light: true },
    });
    navigation.push("FollowerDetail", { data, from: "following" });
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
          icon="invite-friend"
          text="No Following yet."
          style={styles.emptyState}
          iconStyle={styles.iconStyle}
        />
        <Button
          label="Search Deals"
          theme="secondary"
          size="large"
          onPress={() => navigation.navigate("ExploreMain")}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isFetching && (
        <FlatList
          data={following}
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
export default FollowingScreen;
