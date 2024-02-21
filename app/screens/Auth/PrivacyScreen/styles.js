import { StyleSheet } from "react-native";
import { Colors, Fonts } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: Fonts.size.large,
    fontFamily: Fonts.family.regular,
    color: Colors.black,
    lineHeight: 22,
  },
  titleText: {
    fontSize: Fonts.size.large,
    fontFamily: Fonts.family.semiBold,
    color: Colors.black,
    lineHeight: 18,
    marginVertical: 30,
  },
});
