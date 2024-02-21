import { StyleSheet, PixelRatio } from "react-native";
import { Colors, Fonts, Metrics } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
  },
  headerContainer: {
    height: 80,
    backgroundColor: Colors.primary,
  },
  profileInfoContainer: {
    marginTop: -50,
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 8,
    minHeight: 240,
    paddingBottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 4,
  },
  accountDeactivatedText: {
    color: "red",
    marginTop: 16,
    marginHorizontal: 20,
    fontFamily: Fonts.family.Regular,
    fontSize: 12,
    textAlign: "center",
  },
  profileHeaderContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 30,
    alignItems: "center",
  },
  avatarImg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    resizeMode: "cover",
  },
  profileSubHeaderContainer: {
    marginLeft: 20,
    flex: 1,
    justifyContent: "flex-start",
  },
  blackBoldText: {
    ...Fonts.style.h6,
    color: Colors.black,
    lineHeight: 22,
  },
  graySmallText: {
    ...Fonts.style.homiTagText,
    color: Colors.inactiveText,
    lineHeight: 16,
  },
  blackSmallText: {
    ...Fonts.style.homiTagText,
    lineHeight: 18,
    color: Colors.black,
    textAlign: "center",
    marginVertical: 20,
  },
  profileCompleteContainer: {
    height: 35,
    marginHorizontal: 30,
  },
  profileCompleteBtn: {
    minWidth: 170,
    width: Metrics.width / 2,
    marginTop: 15,
  },
  profileBarInactive: {
    height: 1 / PixelRatio.get(),
    backgroundColor: Colors.inactiveShape,
    position: "absolute",
    left: 0,
    right: 0,
    top: 1.5,
  },
  profileBarActive: {
    position: "absolute",
    height: 3,
    top: 0,
    left: 0,
    backgroundColor: Colors.active,
  },
  completePercentText: {
    position: "absolute",
    top: 15,
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.family.medium,
    color: Colors.active,
  },
  itemContainer: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  icon: {
    height: 20,
    resizeMode: "contain",
  },
  itemText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    lineHeight: 18,
    marginLeft: 10,
  },
  rightIcon: {
    height: 17,
    resizeMode: "contain",
  },
});
