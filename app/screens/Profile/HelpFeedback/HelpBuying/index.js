import React, { useEffect, useState } from "react";
import { Text, View, SafeAreaView,TouchableOpacity, ScrollView  } from "react-native";
import { styles } from "./styles";
import { sendExpression } from "../../../../modules/General/actions";
import { useSelector, useDispatch } from "react-redux";
import { generalSelector } from "../../../../modules/General/selectors";
import { userSelector } from "#modules/User/selectors";
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { Utilities } from "#styles";
import usePrevious from "#utils/usePrevious";
const HelpBuyingScreen = ({ navigation, route }) => {
  const [helpful, setHelpful] = useState(null);

  const {
    user: {
      information: { id }
    }
  } = useSelector(userSelector);
  const dispatch = useDispatch();
  const { sendExpressionState } = useSelector(generalSelector);
  const qa = route?.params?.qa ?? { title: "", content: "" };

  useEffect(() => {
    if (helpful == true || helpful == false) {
      onSendExpression();
    }
  }, [helpful]);

  const onSendExpression = () => {
    const contentId = qa.id;
    const params = {
      wasHelpful: helpful,
      userId: id
    };
    dispatch(sendExpression({ contentId, body: { params } }));
    navigation.navigate("HelpFeedback");
  };

  const renderBottom = () => {
    return (
      <View style={styles.buttonContainer}>
        <View style={{ marginLeft: 30 }}>
          <Text style={styles.containerTitle}>Was this helpful?</Text>
        </View>
        <TouchableOpacity
          style={styles.expressionButton}
          onPress={() => setHelpful(true)}
        >
          <Text style={styles.leftExpressionButtonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.expressionButton}
          onPress={() => setHelpful(false)}
        >
          <Text style={styles.rightExpressionButtonText}>No</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const { width } = useWindowDimensions();
  const source = {
    html: `
  <p>
   ${qa.content}
  </p>`
  };
  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.contentContainer}>
            <Text style={[styles.containerTitle]}>{qa.title}</Text>
            <RenderHtml
              contentWidth={width}
              source={source}
            />
            {/* <Text style={styles.containerItemText}>{qa.content}</Text> */}
          </View>
        </ScrollView>
        {renderBottom()}
      </SafeAreaView>
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default HelpBuyingScreen;
