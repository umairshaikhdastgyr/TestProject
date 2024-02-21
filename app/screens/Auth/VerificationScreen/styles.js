import { StyleSheet } from "react-native";
import { Colors, Fonts, Metrics } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  descriptionText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    textAlign: "center",
    marginVertical: Metrics.height / 15,
  },
  verificationCodeContainer: {
    height: 130,
    backgroundColor: Colors.lightGrey,
  },
  buttonsContainer: {
    marginTop: Metrics.height / 15,
    alignSelf: "center",
    height: 80,
    justifyContent: "space-between",
  },
  bottomButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonSubContainer: {
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  activeBtn: {
    backgroundColor: Colors.primary,
  },
  inactiveBtn: {
    backgroundColor: Colors.inactiveShape,
  },
  codeInputContainer: {},
  codeInput: {
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inactiveShape,
    height: 50,
    marginHorizontal: 20,
  },
  smsLabel: {
    ...Fonts.style.linkText,
    color: Colors.inactiveText,
    textAlign: "center",
    marginTop: 10,
  },
  warningText: {
    color: Colors.alert,
    ...Fonts.style.homiTagText,
    textAlign: "center",
    marginTop: Metrics.calcHeight(2),
    marginHorizontal: 10,
  },
});
