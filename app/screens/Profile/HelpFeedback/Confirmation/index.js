import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { styles } from "./styles";
import Icon from "../../../../assets/icons";
import { Utilities } from "#styles";

const FeedbackConfirmationScreen = ({ navigation, route }) => {
  const handleButton = () => {
    if (route?.params?.isAuth) {
      navigation.navigate("MainAuth");
    } else {
      navigation.navigate("ProfileMain");
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Image source={Icon.check_marked} />
          <Text style={styles.containerTitle}>Thank You</Text>
          <Text style={styles.containerItemText}>
            We will get in touch with you right away
          </Text>
          {/*Button start*/}
          <TouchableOpacity onPress={handleButton}>
            <View style={styles.button}>
              <Text style={styles.btnText}>
                {route?.params?.isAuth ? "Back to Login" : "Back to Profile"}
              </Text>
            </View>
          </TouchableOpacity>
          {/*Button End*/}
        </View>
      </SafeAreaView>
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default FeedbackConfirmationScreen;
