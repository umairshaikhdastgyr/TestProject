import { StyleSheet, PixelRatio } from "react-native";
import { Colors, Metrics, Fonts } from "#themes";
import { flex, paddings } from "#styles/utilities";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderWidth: 0,
  },
  margin: {
    marginTop: 20,
    marginBottom: 20,
  },
  partialLength: {
    width: "50%",
  },
  inputText: {
    height: 80,
    fontSize: Fonts.size.large,
    color: Colors.black,
    fontFamily: Fonts.family.regular,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    paddingVertical: 5,
    paddingLeft: 0,
  },
  MainContainer: {
    ...flex.directionRow,
    ...paddings["p-3"],
    flexWrap: "wrap",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { height: 0, width: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 54,
    elevation: 10,
    borderBottomWidth: 0,
  },
  button: {
    paddingHorizontal: 16,
    width: 250,
    alignSelf: "center",
    flexDirection: "row",
    height: 48,
    borderWidth: 1,
    borderColor: "#00BDAA",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button__text: {
    ...Fonts.style.buttonText,
    fontFamily: Fonts.family.semiBold,
    color: "#313334",
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },
  boostModal: {
    flex: 1,
  },
  modalContentContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mainCol: {
    width: 175,
    height: 211,
    marginLeft: 18,
    marginTop: 20,
    borderRadius: 8,
    elevation: 1,
    backgroundColor: "#fff",
  },
  ImgCol: {
    width: 174.5,
    height: 156,
    borderTopLeftRadius: 7.5,
    borderTopRightRadius: 7.5,
  },
  img: {
    width: "100%",
    height: 156,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: "hidden",
  },
  TitleCol: {
    width: 175,
    height: 55,
    borderTopWidth: 1,
    borderColor: "#F5F5F5",
    borderBottomLeftRadius: 7.5,
    justifyContent: "center",
    borderBottomRightRadius: 7.5,
  },
  titleTxt: {
    color: "#313334",
    fontSize: 15,
    left: 10,
  },
  subTitleTxt: {
    color: "#00BDAA",
    fontSize: 12,
    left: 10,
    top: 0,
  },
  Buttoncontainer: {
    width: "90%",
    paddingHorizontal: 16,
    alignSelf: "center",
    paddingVertical: 13,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
