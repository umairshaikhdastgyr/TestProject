import React, { useCallback, useEffect } from "react";

import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
} from "react-native";
import { Icon, FooterAction } from "#components";
import { flex, safeAreaNotchHelper } from "#styles/utilities";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width / 2 - 35;

const CONTENTS = [
  {
    title: "Tip 1: Box Info",
    icon: "box_active",
    detail:
      "Make sure your box matches the size and weight of your item. If reusing a box, be sure to cover any old shipping labels.",
    iconStyle: {
      width: 24,
      height: 28.06,
    },
  },
  {
    title: "Tip 2: Cushioning",
    icon: "cushion_active",
    detail:
      "Add cushioning to support your item. Packing peanuts and newspapers can work great for this.",
    iconStyle: {
      width: 36,
      height: 36,
    },
  },
  {
    title: "Tip 3: Apply Label",
    icon: "apply_active",
    detail:
      "Make sure to firmly place the shipping label on the box’s largest side. Add a packing pouch for extra security.",
    iconStyle: {
      width: 30,
      height: 30,
    },
  },
  {
    title: "Tip 4: Seal Your Box",
    icon: "seal_active",
    detail:
      "Be sure to apply at least 3 strips of tape across all flaps and seams. Be sure to use packing tape and not duct or masking tape. ",
    iconStyle: {
      width: 36,
      height: 36,
    },
  },
];

const PackingTipsScreen = ({ navigation, route }) => {
  useFocusEffect(
    useCallback(() => {
      navigation.setParams({
        handleCloseAction: () => {
          navigation.goBack();
        },
      });
    }, [])
  );

  const styles = StyleSheet.create({
    detailText: {
      fontFamily: "Montserrat-Regular",
      fontSize: 13,
      color: "#313334",
      textAlign: "center",
    },
    detailContainer: {
      marginTop: 30,
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    contentItemConainer: {
      width: CARD_WIDTH,
      borderWidth: 2,
      borderColor: "#00BDAA",
      // height: 236,
      borderRadius: 8,
      flexDirection: "column",
      margin: 7.5,
      paddingBottom: 10,
    },
    contentItemHeader: {
      paddingVertical: 12,
      backgroundColor: "#00BDAA",
    },
    itemHeaderText: {
      fontFamily: "Montserrat-Regular",
      fontSize: 13,
      color: "#FFF",
      textAlign: "center",
      fontWeight: "600",
    },
    contentIconContainer: {
      paddingVertical: 15,
      alignItems: "center",
    },
    iconStyle: {
      width: 24,
      height: 28.06,
    },
    itemDetailContainer: {
      paddingHorizontal: 10,
    },
    itemDetailText: {
      fontFamily: "Montserrat-Regular",
      fontSize: 13,
      color: "#969696",
      fontWeight: "600",
      lineHeight: 18,
    },
  });

  const renderItem = ({ item }) => (
    <View style={styles.contentItemConainer}>
      <View style={styles.contentItemHeader}>
        <Text style={styles.itemHeaderText}>{item.title}</Text>
      </View>
      <View style={styles.contentIconContainer}>
        <Icon icon={item.icon} style={item.iconStyle} />
      </View>
      <View style={styles.itemDetailContainer}>
        <Text style={styles.itemDetailText}>{item.detail}</Text>
      </View>
    </View>
  );
  return (
    <>
      <SafeAreaView style={flex.grow1}>
        {/* <Header /> */}
        <View style={[flex.grow1]}>
          <View style={styles.detailContainer}>
            <Text style={styles.detailText}>
              Please consider these packing tips to ensure the shipping process
              goes as smoothly as possible.
            </Text>
          </View>
          <View style={{ paddingHorizontal: 20, flex: 1 }}>
            <FlatList data={CONTENTS} renderItem={renderItem} numColumns={2} keyExtractor={(item, index) => item + index} />
          </View>
          <View />
        </View>
        {/* <FooterAction
          mainButtonProperties={{
            label: 'Next',
            subLabel:
              deliveryMethodType === 'homitagshipping'
                ? 'LABEL GENERATOR'
                : 'SHIPPING LABEL',
            onPress: () => {
              if (deliveryMethodType === 'homitagshipping') {
                navigation.navigate('LabelGenerator', {
                  postDetail,
                  provider,
                  orderData,
                });
              } else {
                navigation.navigate('ShipIndLabel', {
                  postDetail,
                  provider,
                  orderData,
                });
              }
            },
          }}
        /> */}
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default PackingTipsScreen;
