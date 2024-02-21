import React, { useCallback, useEffect } from "react";
import { NormalButton } from "#components";
import { View, Text, SafeAreaView } from "react-native";
import { styles } from "./styles";
import { userSelector } from "#modules/User/selectors";
import { useSelector, useDispatch } from "react-redux";
import LottieView from "lottie-react-native";
import { useFocusEffect } from "@react-navigation/native";

const AddPaymentConfirmScreen = ({ navigation, route }) => {
  const {
    user: {
      information: { id },
    },
  } = useSelector(userSelector);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ close });
    }, [])
  );

  const close = () => {
    navigation.navigate("ProfileMain");
  };
  const onBack = () => {
    navigation.navigate("PaymentManagement");
  };

  const onAddAnotherPayment = () => {
    navigation.navigate("AddPayment");
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route?.params?.headerTitle,
      headerRight: () => <Text />,
      headerLeft: () => <Text />,
    });
  }, [navigation, route]);

  const titleMessage = route?.params?.titleMessage ?? "";
  const subtitleMessage = route?.params?.subtitleMessage ?? "";

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 5 }}>
        <LottieView
          source={require("#assets/lottie/success.json")}
          style={{ width: 300, height: 130, marginBottom: -60 }}
          autoPlay
          loop={false}
        />
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.blackBoldText}>{titleMessage}</Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.blackText}>{subtitleMessage}</Text>
      </View>
      <View style={styles.bottomBtnsContaienr}>
        <NormalButton
          label="Done"
          onPress={onBack}
          buttonStyle={styles.btnContainer1}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddPaymentConfirmScreen;
