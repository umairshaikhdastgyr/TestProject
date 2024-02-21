import { StyleSheet, PixelRatio } from "react-native";
import { Metrics, Fonts, Colors } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    backgroundColor: Colors.white,
  },
  headerRightContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  activeText: {
    color: Colors.active,
    fontFamily: Fonts.family.regular,
    fontWeight: "600",
    fontSize: Fonts.size.medium,
  },
  headerIcon: {
    width: 8,
    height: 8,
    marginLeft: 3,
    resizeMode: "contain",
  },
  subPhotoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  userPhotoContainer: {
    alignSelf: "center",
    marginTop: Metrics.height / 20,
  },
  userPhotoTempImg: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  userPhotoImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },
  addImg: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  bottomButtonContainer: {
    height: 100,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 3,
    shadowOpacity: 0.05,
  },
  activeBtn: {
    backgroundColor: Colors.primary,
  },
  inactiveBtn: {
    backgroundColor: Colors.inactiveShape,
  },
  actionSheetTitleText: {
    color: Colors.active,
    fontFamily: Fonts.family.regular,
    fontWeight: "600",
    fontSize: Fonts.size.medium,
  },
  modalSearchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  modalContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  modalTextInputContainer: {
    width: "100%",
    borderRadius: 4,
    borderTopColor: "#313334",
    borderBottomColor: "#313334",
    borderLeftColor: "#313334",
    borderRightColor: "#313334",
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderLeftWidth: 1 / PixelRatio.get(),
    borderRightWidth: 1 / PixelRatio.get(),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginTop: 10,
  },
  modalTextInput: {
    ...Fonts.style.inputText,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    height: 42,
    borderRadius: 4,
  },
  modalPredefinedText: {
    color: Colors.black,
    ...Fonts.style.inputText,
    fontWeight: "bold",
  },
  modalDescriptionText: {
    ...Fonts.style.inputText,
  },
  topContainer: {
    zIndex: 2,
    height: 60,
  },
  bottomContainer: {
    zIndex: 2,
    height: 100,
  },
  warningText: {
    color: Colors.alert,
    ...Fonts.style.homiTagText,
    textAlign: "center",
    marginTop: Metrics.calcHeight(2),
  },
});
