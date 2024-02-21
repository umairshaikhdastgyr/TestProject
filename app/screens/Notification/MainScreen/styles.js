import { StyleSheet } from "react-native";
import { Colors, Fonts, Metrics } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  headerContainer: {
    backgroundColor: Colors.primary
  },
  headerRightContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
  },
  whiteText: {
    color: Colors.white,
    fontFamily: Fonts.family.regular,
    fontWeight: "600",
    fontSize: Fonts.size.medium
  },
  headerIcon: {
    width: 8,
    height: 8,
    marginLeft: 3,
    resizeMode: "contain"
  },
  previewImage: {
    width: Metrics.calcWidth(92),
    height: Metrics.calcHeight(45),
    margin: Metrics.calcWidth(4)
  },
  introLabelContainer: {
    flexDirection: "row",
    height: Metrics.height / 10,
    justifyContent: "center",
    alignItems: "center"
  },
  arrowTouchContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  introLabelText: {
    ...Fonts.style.h4,
    textAlign: "center",
    color: Colors.black,
    marginHorizontal: 20
  },
  descripText: {
    ...Fonts.style.linkText,
    textAlign: "center",
    color: Colors.black,
    marginHorizontal: 30,
    marginTop: 5
  },
  dotsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: Metrics.height / 40
  },
  activeDot: {
    backgroundColor: Colors.active,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.inactiveShape
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
  button: {
    width: Metrics.width - 80,
    backgroundColor: Colors.primary
  }
});
