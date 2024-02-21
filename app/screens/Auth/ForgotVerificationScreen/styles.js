import { StyleSheet } from "react-native";
import { Colors, Fonts, Metrics } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
  },
  headerContainer: {
    minHeight: Metrics.calcHeight(20),
    flex: 0.4,
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
  descriptionText: {
    ...Fonts.style.homiTagText,
    color: Colors.black,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 20,
  },
  titleText: {
    ...Fonts.style.buttonText,
    color: Colors.black,
    textAlign: "center",
    fontWeight: "500",
  },
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
  verificationCodeContainer: {
    height: 130,
    backgroundColor: Colors.lightGrey,
    marginTop: 30,
  },
  buttonsContainer: {
    marginTop: Metrics.height / 20,
    alignSelf: "center",
  },
  bottomBtnContainer: {
    height: 50,
    justifyContent: "flex-end",
    marginVertical: 30,
  },
  statusContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: Colors.primary,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  activeBtn: {},
  inactiveBtn: {
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
});
