import { StyleSheet, Platform } from "react-native";
import { Colors, Fonts, Metrics } from "#themes";
import colors from "#themes/colors";

// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBackground,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  btnContainer: {
    backgroundColor: Colors.primary,
    width: Metrics.width - 100,
  },
  btnContainer1: {
    backgroundColor: Colors.inactiveShape,
    width: Metrics.width - 100,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  dropDownInputText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    height: 30,
  },
  labelText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    fontSize: 20,
    fontFamily: Fonts.family.semiBold,
    color: colors.active,
  },
  redText: {
    ...Fonts.style.homiTagText,
    fontSize: 12,
    color: Colors.red,
    marginTop: 15,
    textAlign: "center",
  },
  dropDownInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: Colors.grey,
    borderBottomWidth: 1,
  },
  downIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  blackBoldText: {
    fontSize: 18,
    fontFamily: Fonts.family.semiBold,
    textAlign: "center",
    color: Colors.black,
    marginBottom: 5,
  },
  inputContainer: {
    marginTop: Metrics.height / 30,
    alignItems: "center",
    justifyContent: "center",
  },
  blackText: {
    ...Fonts.style.homiTagText,
    color: Colors.black,
    textAlignVertical: "center",
    textAlign: "center",
    color: colors.darkGrey2,
  },

  amountContainer: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.grey,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Platform.OS === "android" ? 0 : 5,
  },
  inputText: {
    fontSize: 26,
    fontFamily: Fonts.family.semiBold,
    color: colors.active,
    textAlign: "left",
    minWidth: "20%",
  },
  transferOptionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    borderBottomWidth: 1,
    paddingBottom: 20,
    borderBottomColor: colors.grey + "80",
  },
  transferOptions: {
    borderWidth: 2,
    borderRadius: 5,
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  transferOptionText: {
    fontFamily: Fonts.family.semiBold,
    marginTop: 10,
  },
  transferOptionFee: {
    fontFamily: Fonts.family.regular,
  },
  lockIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
    marginRight: 5,
  },
  imgStripe: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
  bottomDescriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    flex: 1,
    justifyContent: "center",
  },
  verify_label_background: {
    backgroundColor: Colors.primary,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  verify_lebel_text: {
    fontFamily: Fonts.family.regular,
    fontWeight: "600",
    fontSize: Fonts.size.large,
    color: Colors.white,
  },
  inValid_user_id: {
    fontFamily: Fonts.family.regular,
    fontWeight: "600",
    fontSize: Fonts.size.medium,
    textAlign:'center',
    marginVertical: 10,
    color: colors.red
  },
});
