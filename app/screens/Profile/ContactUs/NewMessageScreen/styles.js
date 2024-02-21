import { StyleSheet, PixelRatio } from "react-native";
import { Colors } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textCard: {
    height: 80,
    padding: 20,
    alignContent: "center",
    color: Colors.white,
    backgroundColor: Colors.primary,
  },
  row: {
    flexDirection: "row",
  },
  text: {
    padding: 10,
  },
  contentContainer: {
    flexDirection: "column",
    marginVertical: 30,
    paddingHorizontal: 15,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  margin: {
    marginTop: 20,
    marginBottom: 20,
  },
});
