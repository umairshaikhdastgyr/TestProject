import { StyleSheet, PixelRatio } from "react-native";
import { Colors, Metrics, Fonts } from "#themes";
import { flex, paddings } from "#styles/utilities";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  IconContainer: {
    width: "100%",
    marginTop: "30%",
    alignItems: "center",
  },
  titletxt: {
    fontSize: 15,
    marginTop: 6,
    fontFamily: Fonts.family.normal,
  },
  subtitletxt: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 18,
    fontFamily: Fonts.family.semiBold,
  },
  button: {
    width: 283,
    height: 54,
    marginTop: "30%",
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#7471FF",
    borderRadius: 10,
  },
  btnText: {
    fontSize: 16,
    color: "#7471FF",
  },
});
