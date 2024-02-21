import React, { useState } from "react";
import { View, SafeAreaView } from "react-native";
import { styles } from "./styles";
import {
  FooterAction,
  BoldText,
  BodyText,
  Button,
  RadioButton,
} from "#components";

const NewMessageScreen = ({ navigation, route }) => {
  const [checked, setChecked] = useState("No");
  return (
    <SafeAreaView style={styles.container}>
      {renderTextWithBackground()}
      <View style={styles.contentContainer}>
        <BodyText>Did you purchase item(s) with shipping?</BodyText>
        <View>
          <View style={styles.margin}>
            <RadioButton
              isActive={checked === "No"}
              label="No"
              onPress={() => setChecked("No")}
            />
          </View>
          <View>
            <RadioButton
              isActive={checked === "Yes"}
              label="Yes"
              onPress={() => setChecked("Yes")}
            />
          </View>
        </View>
        {checked == "No" ? (
          <View style={styles.margin}>
            <Button
              label="Help Center"
              theme="secondary"
              size="large"
              onPress={() => onHelpCenter(navigation)}
            />
          </View>
        ) : null}
      </View>
      {checked == "Yes" ? (
        <View style={styles.footer}>{renderButton(navigation)}</View>
      ) : null}
    </SafeAreaView>
  );
};

const onHelpCenter = (navigation) => {
  navigation.navigate("HelpFeedback");
};
const renderTextWithBackground = () => {
  return (
    <BodyText style={styles.textCard}>
      <BoldText>Note: </BoldText>
      Only buyers who purchased items through shipping can contact us.
    </BodyText>
  );
};
const renderButton = (navigation) => {
  return (
    <FooterAction
      mainButtonProperties={{
        label: "Next",
        onPress: () => {
          navigation.navigate("NewMessageContactUsSecondScreen");
        },
      }}
    />
  );
};

export default NewMessageScreen;
