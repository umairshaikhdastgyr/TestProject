import React from 'react';
import { View, TouchableOpacity, SafeAreaView, Text } from "react-native";
import { styles } from "./styles";
import Icon from "react-native-vector-icons/FontAwesome5";

const NewMessageConfirmationScreen = ({ navigation, route }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.IconContainer}>
          <Icon color="#00BDAA" size={45} name="check" />
          <Text style={styles.titletxt}>Thank You</Text>
          <Text style={styles.subtitletxt}>
            We will get in touch with {"\n"}you right away
          </Text>

          {/*Button start*/}
          <TouchableOpacity onPress={() => navigation.navigate("ProfileMain")}>
            <View style={styles.button}>
              <Text style={styles.btnText}>Back to Profile</Text>
            </View>
          </TouchableOpacity>
          {/*Button End*/}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewMessageConfirmationScreen;
