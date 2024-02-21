import { StyleSheet, PixelRatio } from "react-native";
import { Colors, Metrics, Fonts } from "#themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  itemContainer: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  contentContainer: {
    flexDirection: "column",
    marginVertical: 15,
    paddingHorizontal: 15
  },
  containerTitle: {
    ...Fonts.style.shareText,
    color: Colors.black,
    marginBottom: 20
  },
  containerItemText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black
  },
  safeContainer: {
    position: "relative",
    flex: 1
  },
  inputWrapper__input: {
    fontFamily: Fonts.family.regular,
    color: Colors.inactiveText,
    fontWeight: "400",
    fontSize: 13,
    paddingLeft: 0,
    flex: 1,
    position: "relative",
    zIndex: 3,
    marginRight: 30
  },
  inputActive: {
    fontFamily: Fonts.family.semiBold,
    fontWeight: "500",
    color: Colors.black
  },
  search_close__icon: {
    top: 6,
    marginRight: 0,
    position: "absolute",
    right: 2
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.inactiveText,
    height: 40,
    paddingHorizontal: 10,
    paddingRight: 4,
    borderRadius: 7,
    backgroundColor: "white"
  },
  inputWrapperFocus: {
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: { height: 0, width: 2 },
    shadowRadius: 4
  },
  headerFilter: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    height: 76,

    backgroundColor: "white",
    position: "relative",
    zIndex: 10
  },

  itemText: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    lineHeight: 18,
    marginLeft: 10
  },
  rightIcon: {
    height: 17,
    resizeMode: "contain"
  },
  title__text: {
    fontFamily: Fonts.family.regular,
    fontSize: 12,
    fontWeight: "500",
    color: Colors.inactiveText,
    marginLeft: 10,
    marginBottom: 15
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
  btnContainer: {
    backgroundColor: "#7471FF"
  },
  inputContainer: {
    marginHorizontal: 20,
    marginTop: Metrics.height / 30
  },
  inputLabel: {
    ...Fonts.style.homiBodyText,
    color: Colors.black,
    marginBottom: 5
  },
  inputText: {
    fontSize: Fonts.size.large,
    color: Colors.black,
    fontFamily: Fonts.family.regular,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    paddingVertical: 5,
    paddingLeft: 0
  },
  redText: {
    ...Fonts.style.homiTagText,
    color: Colors.red
  }
});
