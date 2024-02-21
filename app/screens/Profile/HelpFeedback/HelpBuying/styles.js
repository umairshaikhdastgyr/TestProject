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
  buttonContainer: {
    backgroundColor: Colors.white,
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#DADADA",
    paddingBottom: 30,
    paddingTop: 20
  },

  containerTitle: {
    ...Fonts.style.shareText,
    color: Colors.black,
    fontSize: 18,
    fontWeight: 'bold'
  },
  leftExpressionButtonText: {
    ...Fonts.style.shareText,
    color: Colors.active
  },
  rightExpressionButtonText: {
    ...Fonts.style.shareText,
    color: Colors.red
  },
  expressionButton: {
    marginLeft: 40
  },
  containerItemText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black
  }
});
