import { StyleSheet, PixelRatio } from "react-native";
import { Colors, Fonts, Metrics } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  headerRightContainer: {
    flexDirection: "row"
  },
  moreIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain"
  },
  rightIconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  rightIconContainer1: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5
  },
  infoContainer: {
    alignItems: "center",
    marginTop: 30,
    marginHorizontal: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 4,
    backgroundColor: Colors.white,
    borderRadius: 5
  },
  userImgContainer: {
    width: 100,
    height: 100,
    marginBottom: 10,
    marginTop: -10,
    borderRadius: 50,
    overflow: "hidden"
  },
  userImg: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 50
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    resizeMode: "contain"
  },
  titleText: {
    ...Fonts.style.h6,
    color: Colors.black,
    lineHeight: 22,
    marginVertical: 5,
    textAlign: "center"
  },
  greyText: {
    ...Fonts.style.homiBodyTextMedium,
    color: Colors.inactiveText,
    lineHeight: 16
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    height: 30
  },
  graySmallText: {
    textDecorationLine: "underline",
    ...Fonts.style.label,
    textAlignVertical: "center",
    marginLeft: 5,
    color: Colors.inactiveText
  },
  userProductContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 10,
    minHeight: 40,
    width: 160
  },
  itemContainer: {
    height: 40,
    justifyContent: "space-between"
  },
  activeBoldText: {
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.medium,
    color: Colors.active,
    lineHeight: 18,
    textAlign: "center"
  },
  verifyStatusContainer: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  blackText: {
    color: Colors.black,
    ...Fonts.style.homiBodyTextMedium
  },
  verifyIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
    marginHorizontal: 5
  },
  followBtn: {
    width: (Metrics.width / 5) * 3
  },
  reviewContentContainer: {
    marginTop: 30,
    backgroundColor: Colors.white
  },
  reviewItemContainer: {
    marginHorizontal: 20,
    minHeight: 150,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "rgba(0, 0, 0, 0.55)",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    marginVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  space: {
    height: 20
  },
  blackBoldText: {
    color: Colors.black,
    fontSize: Fonts.size.large,
    fontFamily: Fonts.family.semiBold,
    lineHeight: 18,
    textAlign: "center"
  },
  separator: {
    height: 10
  },
  grayText: {
    ...Fonts.style.homiTagText,
    color: Colors.inactiveText,
    textAlign: "center",
    lineHeight: 16
  },
  linkText: {
    color: Colors.active,
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.family.semiBold,
    lineHeight: 16,
    textAlign: "center",
    textDecorationLine: "underline"
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15
  },
  nextIcon: {
    width: 30,
    height: 10,
    resizeMode: "contain",
    marginLeft: 5
  },
  ideaBoardImgsContainer: {
    height: 200,
    marginHorizontal: 20,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 3,
    shadowOpacity: 0.1,
    backgroundColor: Colors.width
  },
  ideaBoardImgsSubContainer: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  ideaImg: {
    width: Metrics.width - 40,
    height: 150,
    resizeMode: "cover",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  activeText: {
    color: Colors.active,
    ...Fonts.style.label,
    marginTop: 5
  },
  ideaBoardInfoContainer: {
    height: 50,
    justifyContent: "center",
    paddingLeft: 10,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  productsList: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 5
  },
  ["productsList__item--even"]: {
    marginRight: 0
  },
  tile: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 3,
    marginRight: 16,
    marginBottom: 16,
    width: Metrics.width / 2 - 24
  },
  tile__picture: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  tile__body: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 0
  },
  tile__shipping: {
    paddingHorizontal: 16,
    paddingBottom: 12
  },
  tile__info: {
    paddingRight: 4,
    flex: 1
  },
  tile__price: {
    paddingTop: 1,
    alignItems: "flex-end"
  },
  tile__like: {
    position: "absolute",
    left: 13,
    top: 9
  }
});
