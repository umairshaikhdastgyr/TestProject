import React, { useState } from "react";
import {
  View,
  Text,
  PixelRatio,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
  ScrollView
} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Accordion from "react-native-collapsible/Accordion";
import { Colors, Fonts } from "#themes";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalConatiner: {
    marginTop: Platform.OS === "ios" ? 50 : 5,
    width: width - 50,
    height: height - 75,
    backgroundColor: "#fcfcfc",
  },
  headerConatiner: {
    backgroundColor: "#7471FF",
    paddingBottom: 38,
  },
  detailConatiner: {
    backgroundColor: "#FFF",
    padding: 40,
    paddingTop: 30,
  },
  dataConatiner: {
    backgroundColor: "#fcfcfc",
  },
  bottomConatiner: {
    paddingVertical: 10,
    borderBottomColor: "#F5F5F5",
    borderBottomWidth: 1,
  },
  headerDetail: {
    marginTop: 3,
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerTitle: {
    marginTop: 7,
    fontFamily: "Montserrat-Regular",
    fontWeight: "800",
    fontSize: 32,
    color: "#FFFFFF",
    textAlign: "center",
  },
  closeIconContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: 20,
    marginRight: 15,
  },
  detailText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#313334",
    textAlign: "center",
  },
  listHeader: {
    paddingVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  listContent: {
    marginLeft: 20,
    marginRight: 40,
    marginBottom: 10,
  },
  headerText: {
    ...Fonts.style.headerText,
    color: Colors.black,
    marginRight: -20,
  },

  sectionContainerStyle: {
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: Colors.lightGrey,
  },
  accordianHeaderTitleConatiner: {
    width: width - 100,
  },
  accordianContentDetailText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#969696",
    textAlign: "justify",
  },
});

const AccordianHeader = (section, index, isActive) => (
  <View style={styles.listHeader}>
    <Entypo
      color={isActive ? "#00BDAA" : "#000"}
      size={30}
      style={styles.arrowIcon}
      name={isActive ? "chevron-small-up" : "chevron-small-right"}
    />
    <View style={styles.accordianHeaderTitleConatiner}>
      <Text
        style={[styles.headerText, { color: isActive ? "#00BDAA" : "#000" }]}
      >
        {section?.title}
      </Text>
    </View>
  </View>
);

const AccordianContent = (section) => (
  <View style={styles.listContent}>
    <Text style={styles.accordianContentDetailText}>{section.content}</Text>
  </View>
);

const ProtectionModal = ({ isVisible, onTouchOutside, contents }) => {
  const [activeSections, setActiveSections] = useState([]);
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType='fade'
      onRequestClose={() => onTouchOutside(false)}
    >
      <View style={{ padding: 80,paddingHorizontal:20,backgroundColor:'#00000080',flex:1 }}>
        <View style={{borderRadius:10,overflow:'hidden',flex:1}}>
        <View style={styles.headerConatiner}>
          <View style={styles.closeIconContainer}>
            <TouchableOpacity onPress={() => onTouchOutside(false)}>
              <EvilIcons color="#fff" size={30} name="close" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>HOMITAG</Text>
          <Text style={styles.headerDetail}>SHIPPING BUYER PROTECTION</Text>
        </View>
        <View style={styles.detailConatiner}>
          <Text style={styles.detailText}>
            We want to ensure the best experience for you. That’s why we’ve
            created the Homitag Buyer Protection
          </Text>
        </View>
        <ScrollView style={styles.dataConatiner}>
          {contents && contents[0] ? (
            <Accordion
              sections={contents ? contents[0]?.Contents : []}
              activeSections={activeSections}
              renderHeader={AccordianHeader}
              renderContent={AccordianContent}
              onChange={setActiveSections}
              touchableComponent={TouchableOpacity}
              sectionContainerStyle={styles.sectionContainerStyle}
            />
          ) : null}
        </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ProtectionModal;
