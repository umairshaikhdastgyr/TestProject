import { StyleSheet, Dimensions } from "react-native";
import { Colors, Fonts } from "#themes";

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  inputDescriptionWrapper: {
    paddingHorizontal: 20,
    height: 120,
    paddingBottom: 40,
    backgroundColor: Colors.lightGrey,
  },

  reasonContainer: {
    marginBottom: 20,
    flexDirection: "column",
    justifyContent: "space-around",
    marginLeft: 20,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 30,
    borderColor: Colors.lightGrey,
  },
  "section-container": {
    paddingHorizontal: 20,
    paddingVertical: 32,
    // borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
    marginBottom: 50,
  },
  "header-title-count": {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  blackBoldText: {
    ...Fonts.style.headerText,
    color: Colors.black,
  },
  topContainer: {
    height: 120,
    width: width - 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
    marginBottom: 3,
  },
  imgsContainer: {
    paddingRight: 15,
  },
  imgContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 1,
  },
  imgElement: {
    width: 60,
    height: 60,
  },
  textsContainer: {
    flexDirection: "column",
    maxWidth: width - 30 - 75,
  },

  titleText: {
    marginBottom: 5,
    fontFamily: "Montserrat-Regular",
    fontWeight: "500",
    fontSize: 15,
  },
  titleTextProduct: {
    fontFamily: "Montserrat-Medium",
    fontWeight: "500",
    fontSize: 12,
    color: "#696969",
  },
});

export default styles;
