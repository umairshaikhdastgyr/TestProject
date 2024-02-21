import React, { useCallback } from "react";

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

const CARD_WIDTH = width / 2 - 30;

const CONTENTS = [
  {
    title: "Step 1",
    icon: "print_icon",
    detail: "Print your shipping label and packing slip.",
    iconStyle: {
      width: 24,
      height: 32,
    },
  },
  {
    title: "Step 2",
    icon: "package_icon",
    detail: "Drop your package at the nearest [carrier] store.",
    iconStyle: {
      width: 24,
      height: 28,
    },
  },
  {
    title: "Step 3",
    icon: "tick_icon",
    detail: "Cofirm your shipment on the Purchase Details page.",
    iconStyle: {
      width: 32.4,
      height: 24,
    },
  },
  {
    title: "Step 4",
    icon: "clock_icon",
    detail: "Await confirmation that the buyer received your item.",
    iconStyle: {
      width: 24,
      height: 24,
    },
  },
];

const DropOffScreen = ({ navigation, route }) => {
  useFocusEffect(
    useCallback(() => {
      navigation.setParams({
        handleCloseAction: () => {
          navigation.goBack();
        },
      });
    }, [])
  );

  const provider = route?.params?.provider ?? "";
  const styles = StyleSheet.create({
    detailText: {
      fontFamily: "Montserrat-Regular",
      fontSize: 13,
      color: "#313334",
      textAlign: "center",
    },
    detailContainer: {
      marginTop: 30,
      marginBottom: 50,
      paddingHorizontal: 20,
    },
    contentItemConainer: {
      width: CARD_WIDTH,
      height: 180,
      borderRadius: 8,
      flexDirection: "column",
      marginLeft: 20,
      marginBottom: 22,
      backgroundColor: "white",
      shadowColor: "black",
      shadowOffset: {
        height: 0,
        // width: 5,
      },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
    },
    contentItemHeader: {
      paddingVertical: 12,
      backgroundColor: "#00BDAA",
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
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
      fontWeight: "500",
      lineHeight: 18,
      textAlign: "center",
    },
  });

  const renderItem = ({ item, index }) => (
    <View style={styles.contentItemConainer}>
      <View style={styles.contentItemHeader}>
        <Text style={styles.itemHeaderText}>{item.title}</Text>
      </View>
      <View style={styles.contentIconContainer}>
        <Icon icon={item.icon} style={item.iconStyle} />
      </View>
      <View style={styles.itemDetailContainer}>
        <Text style={styles.itemDetailText}>
          {index === 1
            ? `Drop your package at the nearest ${provider?.toUpperCase()} store.`
            : item.detail}
        </Text>
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
              {`Please bring your label to the nearest ${provider?.toUpperCase()} location and ship your item in the next 3 days.`}
            </Text>
          </View>
          <View
            style={
              {
                // paddingHorizontal: 20, flex: 1,
                // marginHorizontal: 20,
              }
            }
          >
            <FlatList
              contentContainerStyle={{ flexGrow: 1 }}
              data={CONTENTS}
              renderItem={renderItem}
              numColumns={2}
              keyExtractor={(item, index) => item + index}
            />
          </View>
          <View />
        </View>
        <FooterAction
          mainButtonProperties={{
            label: "Done",
            onPress: () => {
              navigation.goBack();
            },
          }}
        />
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default DropOffScreen;
