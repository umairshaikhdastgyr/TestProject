import { StyleSheet } from "react-native";
import { Colors, Fonts, Metrics } from "#themes";
import { Dimensions } from "react-native";

export const styles = StyleSheet.create({
  modalContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: Dimensions.get("window").width - 80
  },
  modalTouchContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  titleText: {
    fontFamily: Fonts.family.semiBold,
    color: "#313334",
    fontWeight: "600",
    fontSize: 18,
    textAlign: "left",
    flex: 1,
    paddingVertical: 15
  },
  msgText: {
    fontFamily: Fonts.family.Regular,
    color: "#313334",
    fontWeight: "normal",
    fontSize: 13,
    marginBottom: 40,
    textAlign: "left"
  },
  topContainer: {
    flexDirection: "row",
    borderColor: "#F5F5F5",
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingRight: 5
  },
  exitBt: {
    padding: 15
  },
  logoutBt: {
    padding: 10,
    height: 30,
    width: 30,
    marginTop: 5
  },
  contentContainer: {
    padding: 20
  }, margin: {
    margin: 20,
  }
});
