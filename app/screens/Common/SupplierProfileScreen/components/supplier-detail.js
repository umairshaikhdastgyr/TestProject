import React from "react";

import { StyleSheet, View, Text } from "react-native";
import { StarsRate, Button } from "#components";
import { Fonts } from "#themes";
import { flex, margins, paddings } from "#styles/utilities";
import { handleGotoChatScreen } from "#screens/Common/helper-functions";
import { TouchableOpacity } from "react-native-gesture-handler";
import { selectUserData } from "#modules/User/selectors";
import { useSelector } from "react-redux";
import { MainAuthStackNavigation } from "../../../../navigators/MainAuthStackNavigation";

const SupplierDetail = ({ supplierData, navigation, postData }) => {
  const { information: userInfo } = useSelector(selectUserData());
  const onReview = () => {
    navigation.navigate("Review", {
      id: supplierData?.id,
      reviews: supplierData?.reviews,
      rating: supplierData?.rating,
      name: `${supplierData?.storefront?.name} Review's`,
    });
  };

  const handleSendMessage = () => {
    if (!userInfo.id) {
      MainAuthStackNavigation(navigation);
    } else {
      handleGotoChatScreen({
        navigation,
        sellerDetails: supplierData,
        isFromSupplierProfile: true,
        postDetail: postData,
      });
    }
  };

  return (
    <View style={[flex.alignItemsCenter, paddings["p-3"]]}>
      <Text style={[styles.headerText, margins["mb-3"]]}>{`${
        supplierData?.storefront?.name ?? ""
      }`}</Text>
      <TouchableOpacity
        onPress={onReview}
        style={[flex.directionRow, flex.alignItemsCenter, margins["mb-3"]]}
      >
        <StarsRate value={supplierData?.rating} />
        <Text style={[margins["ml-2"], styles.reviewCount]}>
          {supplierData?.reviews == 0 ? "" : `(${supplierData?.reviews})`}
        </Text>
      </TouchableOpacity>
      <Button
        label="Send Message"
        size="large"
        style={[margins["mb-3"]]}
        onPress={handleSendMessage}
      />
      {/* <Text style={[styles.storeDescription]}>
        {supplierData?.storefront?.description ?? ''}
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.h6,
    color: "#313334",
  },
  reviewCount: {
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.medium,
  },
  storeDescription: {
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.regular,
    textAlign: "center",
  },
});

export default SupplierDetail;
