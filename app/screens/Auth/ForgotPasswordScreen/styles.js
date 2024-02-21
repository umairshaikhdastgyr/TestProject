import { StyleSheet } from "react-native";
import { Metrics, Colors, Fonts } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
  },
  logoImg: {
    height: Metrics.height / 6,
    resizeMode: "contain",
  },
  headerContainer: {
    height: Metrics.calcHeight(30),
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  mainContentContainer: {
    marginTop: Metrics.calcHeight(5),
    alignItems: "center",
  },
  titleText: {
    ...Fonts.style.buttonText,
    color: Colors.black,
    textAlign: "center",
    fontWeight: "500",
  },
  descriptionText: {
    ...Fonts.style.homiTagText,
    color: Colors.black,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 20,
  },
  input: {
    fontFamily: Fonts.family.regular,
    fontWeight: "normal",
    fontSize: 13,
    marginTop: 12,
    paddingBottom: 2,
  },
  sendBtnContainer: {
    marginTop: Metrics.calcHeight(6),
  },
  sendBtnContainer1: {
    marginTop: Metrics.calcHeight(6),
    backgroundColor: Colors.inactiveShape,
  },
  linkText: {
    ...Fonts.style.linkText,
    color: Colors.inactiveText,
    textDecorationLine: "underline",
  },
  linkBtnContainer: {
    marginTop: Metrics.calcHeight(3),
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
  statusContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: Colors.primary,
  },
  hintText: {
    ...Fonts.style.detailText,
    fontWeight: "600",
    color: Colors.active,
    textAlign: "center",
    marginTop: 10,
    marginHorizontal: 15,
  },
});
