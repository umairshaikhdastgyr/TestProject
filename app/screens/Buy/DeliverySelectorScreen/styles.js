import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "#themes";

const { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  "main-container": {
    flex: 1,
  },
  "input-container": {
    paddingVertical: 10,
  },
  currencyContainer: {
    marginTop: 20,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonsContainer: {
    flexDirection: "row",
    marginHorizontal: 15,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
