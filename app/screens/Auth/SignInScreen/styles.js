import { StyleSheet } from "react-native";
import { Colors, Fonts, Metrics } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
  },
  headerContainer: {
    flex: 1,
    minHeight: Metrics.calcHeight(20),
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: {
    height: Metrics.height / 6,
    resizeMode: "contain",
  },
  titleText: {
    ...Fonts.style.buttonText,
    fontWeight: "500",
    color: Colors.black,
    textAlign: "center",
  },
  mainContentContainer: {
    marginTop: Metrics.calcHeight(5),
  },
  input: {
    fontFamily: Fonts.family.regular,
    fontWeight: "normal",
    fontSize: 17,
    marginTop: 12,
  },
  loginBtnContainer: {
    marginTop: Metrics.calcHeight(2),
  },
  underlineText: {
    ...Fonts.style.linkText,
    color: Colors.inactiveText,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  btnContainer: {
    marginTop: Metrics.calcHeight(3),
    alignSelf: "center",
  },
  grayText: {
    ...Fonts.style.linkText,
    color: Colors.inactiveText,
    textAlign: "center",
    marginTop: Metrics.calcHeight(2),
    lineHeight: 20,
  },
  bottomContainer: {
    marginVertical: 10,
    flex: 1,
    justifyContent: "flex-end",
  },
  warningText: {
    color: Colors.alert,
    ...Fonts.style.homiTagText,
    textAlign: "center",
    marginTop: Metrics.calcHeight(2),
  },
  statusContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: Colors.primary,
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  backBtnContainer: {
    position: "absolute",
    left: 20,
    top: 20,
    height: 40,
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  space: {
    marginTop: Metrics.calcScreenHeight(3.5),
  },
});
