import React from "react";

import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Animated,
  Text,
  TouchableOpacity,
  Share,
} from "react-native";
import { Icon } from "#components";
import { Fonts } from "#themes";
import { getFirebaseLink } from "#utils";

const { width } = Dimensions.get("window");

const HeaderSupplierProfile = ({ navigation, headerOpacity, supplierData }) => {
  const handleGoBack = () => navigation.goBack();

  const openShareItemOptions = async () => {
    const link = await getFirebaseLink(`?supplierId=${supplierData.id}`);

    const shareOptions = {
      title: "Share Item",
      message: `Checkout ${supplierData?.name} in Homitag ${link}`,
    };
    await Share.share(shareOptions);
  };

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

        <Text style={styles.headerText}>Profile</Text>

        <TouchableOpacity
          style={{ padding: 16 }}
          onPress={openShareItemOptions}
        >
          <Icon icon="share" color="active" style={{ width: 30, height: 30 }} />
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

export default HeaderSupplierProfile;
