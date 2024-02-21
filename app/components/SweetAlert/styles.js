import { StyleSheet } from "react-native";
import { Colors, Fonts, Metrics } from "#themes";
import { Dimensions } from "react-native";

export const styles = StyleSheet.create({
  modalContainer: {
    alignItems: "center",
    justifyContent: "center",

    width: '80%',
    backgroundColor:'#ffffff',
    borderRadius:5
  },
  modalTouchContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  titleText: {
    fontFamily: Fonts.family.semiBold,
    color: "#313334",
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center"
  },
  msgText: {
    fontFamily: Fonts.family.Regular,
    color: "#313334",
    fontWeight: "400",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center"
  }
});
