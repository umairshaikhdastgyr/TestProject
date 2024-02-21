import { StyleSheet, PixelRatio } from "react-native";
import { Colors, Metrics, Fonts } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 80,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowRadius: 3,
    shadowOpacity: 0.05
  },
  mainButtonStyle: { backgroundColor: Colors.active },

  contentContainer: {
    flexDirection: "column",
    alignItems: "center",
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
    color: Colors.black,
    textAlign: "center"
  }
});
