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
  }
});
