import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "#themes";
const { width } = Dimensions.get("window");

export default StyleSheet.create({
  productsList: {},
  ["productsList__item--even"]: {
    marginRight: 0,
  },
  tile: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
    marginRight: 16,
    marginBottom: 16,
    width: width / 2 - 24,
    overflow: "hidden",
  },
  tile__picture: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tile__body: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingRight: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
    height: 35,
    backgroundColor: "#ffffff",
    zIndex: 99,
  },
  tile__price: {
    marginTop: -1,
    alignItems: "center",
  },
  tile__icons: {
    flexDirection: "row",
  },
  icons__left: {
    marginRight: 2,
  },
  tile__like: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: 10,
  },
});
