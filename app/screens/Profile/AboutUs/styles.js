import { StyleSheet, PixelRatio } from "react-native";
import { Colors, Metrics, Fonts } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  contentContainer: {
    flexDirection: "column",
    marginVertical: 30,
    paddingHorizontal: 15
  },
  containerTitle: {
    ...Fonts.style.shareText,
    color: Colors.black,
    marginBottom: 20
  },
  containerItemText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black
  },
  itemText: {
    ...Fonts.style.homiBodyText,
    color: Colors.white,
    textAlign: "center",
    fontSize: 15
  },
  titleText: {
    ...Fonts.style.h6,
    color: Colors.white,
    fontWeight: "700",
    fontSize: 32,
    marginTop: 1,
    textAlign: "center"
  },
  aboutContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    height: 160,
    marginTop: 10
  }
});
