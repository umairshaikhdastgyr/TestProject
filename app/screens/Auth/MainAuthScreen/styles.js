import { StyleSheet } from "react-native";
import { Colors, Metrics, Fonts } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  headerContainer: {
    //height: Metrics.calcScreenHeight(32),
    flex: 0.5,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: {
    height: Metrics.height / 6,
    resizeMode: "contain",
  },
  mainContainer: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
  },
  space: {
    marginTop: Metrics.calcScreenHeight(3.5),
  },
  underlineText: {
    ...Fonts.style.linkText,
    color: Colors.inactiveText,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  grayText: {
    ...Fonts.style.linkText,
    color: Colors.inactiveText,
    textAlign: "center",
    marginTop: Metrics.calcScreenHeight(4),
    lineHeight: 20,
  },
  grayText1: {
    ...Fonts.style.linkText,
    color: Colors.inactiveText,
    textAlign: "center",
    lineHeight: 20,
  },
  bottomContainer: {
    // marginTop: Metrics.calcScreenHeight(3),
    justifyContent: "flex-end",
  },
  bottomSubContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  activeText: {
    color: Colors.active,
  },
  textBtnContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 90,
  },
  backBtnContainer: {
    position: "absolute",
    right: 5,
    top: 5,
    minWidth: 40,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  backBtnContainer1: {
    position: "absolute",
    left: 5,
    top: 5,
    width: 55,
    justifyContent: "center",
    padding: 15,
  },
  whiteText: {
    color: Colors.white,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.medium,
  },
  nextIcon: {
    width: 10,
    height: 10,
    resizeMode: "contain",
    marginLeft: 5,
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});
