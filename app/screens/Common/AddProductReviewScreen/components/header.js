import React from "react";

import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Animated,
  Text,
  TouchableOpacity,
} from "react-native";
import { Icon } from "#components";
import { Fonts } from "#themes";
const { width } = Dimensions.get("window");

const HeaderProductReviews = ({ handleGoBack, headerOpacity }) => {
  return (
    <View style={[styles.header, { height: 60 }]}>
      <Animated.View
        style={[
          styles.headerActive,
          { opacity: headerOpacity, height: 60 },
        ]}
      >
        <TouchableOpacity onPress={handleGoBack} style={{ padding: 16 }}>
          {Platform.OS === "ios" && <Icon icon="chevron-left_grey" />}
          {Platform.OS === "android" && <Icon icon="back_grey" />}
        </TouchableOpacity>

        <Text style={styles.headerText}>Add Review</Text>

        <TouchableOpacity style={{ padding: 16 }}>
          <Icon icon="more_grey" style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width,
    backgroundColor: "transparent",
  },
  headerActive: {
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 3,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width,
  },
  headerText: {
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.h6,
    color: "#313334",
  },
});

export default HeaderProductReviews;
