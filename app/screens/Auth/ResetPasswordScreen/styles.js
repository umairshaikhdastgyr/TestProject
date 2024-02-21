import { StyleSheet } from "react-native";
import { Colors, Metrics, Fonts } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
  },
  statusContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: Colors.primary,
  },
  headerContainer: {
    height: Metrics.calcHeight(30),
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnContainer: {
    position: "absolute",
    left: 20,
    top: 20,
    height: 40,
    width: 40,
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  logoImg: {
    height: Metrics.height / 12,
    resizeMode: "contain",
  },
  contentContainr: {
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
    paddingTop: Metrics.calcHeight(5),
  },
  titleText: {
    ...Fonts.style.buttonText,
    color: Colors.black,
    textAlign: "center",
    fontWeight: "500",
  },
  input: {
    fontFamily: Fonts.family.regular,
    fontWeight: "normal",
    fontSize: 13,
    marginTop: 12,
    paddingBottom: 0,
  },
  button: {
    marginTop: Metrics.calcScreenHeight(6),
  },
  button1: {
    marginTop: Metrics.calcScreenHeight(6),
    backgroundColor: Colors.inactiveShape,
  },
  alertContainer: {
    width: Metrics.width - 80,
    backgroundColor: Colors.white,
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  checkIcon: {
    width: 50,
    height: 30,
    resizeMode: "contain",
  },
  alertBoldText: {
    lineHeight: 18,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.large,
    color: Colors.black,
    textAlign: "center",
    marginTop: 30,
  },
  alertText: {
    lineHeight: 18,
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    textAlign: "center",
    marginTop: 30,
  },
  activeColorText: {
    color: Colors.active,
    ...Fonts.style.detailText,
    textAlign: "center",
    marginTop: 10,
  },
});
