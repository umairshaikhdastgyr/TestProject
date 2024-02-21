import { StyleSheet } from "react-native";
import { Colors, Fonts, Metrics } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
  },
  headerContainer: {
    flex: 1,
    minHeight: Metrics.calcHeight(35),
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
    fontWeight: "400",
    color: Colors.black,
    textAlign: "center",
  },
  mainContentContainer: {
    marginTop: Metrics.calcScreenHeight(4),
  },
  input: {
    fontFamily: Fonts.family.regular,
    fontWeight: "normal",
    fontSize: 13,
    marginTop: 12,
    paddingBottom: 2,
  },
  hintText: {
    ...Fonts.style.detailText,
    fontWeight: "600",
    color: Colors.active,
    textAlign: "center",
    marginTop: 10,
    marginHorizontal: 15,
  },
  button: {
    marginTop: 30,
  },
  underlineText: {
    ...Fonts.style.linkText,
    color: Colors.inactiveText,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  btnContainer: {
    marginTop: Metrics.calcScreenHeight(2.5),
    alignSelf: "center",
  },
  grayText: {
    ...Fonts.style.linkText,
    color: Colors.inactiveText,
    textAlign: "center",
    lineHeight: 20,
  },
  bottomContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
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
});
