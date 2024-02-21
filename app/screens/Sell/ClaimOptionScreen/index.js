import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Text,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import ProductDetail from "../OldOrderStatusScreen/product-detail";
import { getOrderById, getReturnOrder } from "#modules/Orders/actions";
import { useActions } from "#utils";
import { Colors } from "#themes";
import { SweetDialog, SweetAlert, Icon, FooterAction } from "#components";

import fonts from "#themes/fonts";
import colors from "#themes/colors";
import Ionicons2 from "react-native-vector-icons/Ionicons";
import DocumentPicker from "react-native-document-picker";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import RNFS from "react-native-fs";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  itemDetailText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 13,
    color: "#969696",
    fontWeight: "500",
    lineHeight: 18,
    textAlign: "center",
  },
  itemDetailContainer: {
    paddingHorizontal: 10,
  },
  itemHeaderText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 13,
    color: "#FFF",
    textAlign: "center",
    fontWeight: "600",
  },
  contentIconContainer: {
    paddingVertical: 15,
    alignItems: "center",
  },
  contentItemHeader: {
    paddingVertical: 12,
    backgroundColor: "#00BDAA",
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  contentItemConainer: {
    flex: 1,
    height: 220,
    borderRadius: 8,
    flexDirection: "column",
    margin: 7.5,
    backgroundColor: "white",
    elevation: 6,
  },
  transaction_label: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#313334",
    lineHeight: 18,
  },
  transaction_id: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#313334",
    lineHeight: 18,
    fontWeight: "600",
  },
  horizontal_line: {
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    width: width - 40,
    marginVertical: 25,
  },
  detail_text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#313334",
    lineHeight: 18,
    marginHorizontal: 20,
    textAlign: "center",
  },
  text_head: {
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
    color: "#313334",
    lineHeight: 18,
    marginHorizontal: 20,
    fontWeight: "600",
    // textAlign: 'center',
  },
  text_head_container: {
    width,
    marginVertical: 32,
  },
  activeCircle: {
    width: 16,
    height: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.active,
    backgroundColor: Colors.active,
    marginRight: 12,
  },
  reason_conatiner: {
    flexDirection: "row",
    width: width - 40,
    alignItems: "flex-start",
  },
  reason_detail_conatiner: {
    flexDirection: "row",
    width: width - 40,
    marginTop: 12,
    borderRadius: 4,
    backgroundColor: "#EDEDED",
    padding: 10,
  },
  reason_container_text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
    fontWeight: "600",
    color: "#313334",
    lineHeight: 18,
  },
  reason_detail_text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#767676",
  },
  order_detail_link: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "#313334",
    lineHeight: 18,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

const ClaimOptionScreen = ({ navigation, route }) => {
  const screenDetails = route?.params?.screenDetails ?? null;
  const userProductDetail = route?.params?.userProductDetail ?? null;
  const orderData = route?.params?.orderData ?? null;
  const chatItem = route?.params?.chatItem ?? null;

  const [disputeScreen, setdisputeScreen] = useState(false);
  const [disputeRequestText, setDisputeRequestText] = useState("");

  const [raiseDisputeLoading, setraiseDisputeLoading] = useState(false);

  const actions = useActions({
    getOrderById,
    getReturnOrder,
  });

  useEffect(() => {
    // actions.getReturnOrder({ returnId });
  }, []);

  //   const goToOrderStatusScreen = () => {
  //     // setShowAlert(false);
  //     navigation.navigate("OrderStatus", {
  //       orderData: returnRequest?.data?.Order,
  //       type: "SELLER",
  //       chatItem,
  //       orderId: returnRequest?.data?.Order.id,
  //     });
  //   };

  const pickFIle = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      const resizeImage = await ImageResizer.createResizedImage(
        res.uri,
        720,
        1280,
        "JPEG",
        60
      );
      const photoBase64 = await RNFS.readFile(resizeImage.uri, "base64");
      const returnLabelImage = `data:image/jpeg;base64,${photoBase64}`;
      // actions.setPhotoList([
      //   {
      //     type: 'selected-photo',
      //     image: returnLabelImage,
      //     uri: resizeImage.uri,
      //     ext: 'jpeg',
      //   },
      // ]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, { flex: 1 }]}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        >
          <View>
            <ScrollView
              contentContainerStyle={{ justifyContent: "space-between" }}
              style={{ flex: 1 }}
            >
              <View style={{}}>
                {screenDetails?.id && (
                  <ProductDetail
                    screenDetails={screenDetails}
                    userProductDetail={userProductDetail}
                  />
                )}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 15,
                    marginTop: 25,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.family.bold,
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    Claim Status:
                  </Text>
                  <Text
                    onPress={() => {
                      setdisputeScreen(false);
                      // showOrderClaimHistory(orderData);
                      // setCancellationRequestModal(false);
                      // setDeniedScreen(false);
                    }}
                    style={{
                      fontFamily: fonts.family.semiBold,
                      fontSize: 11,
                      color: colors.green,
                      marginLeft: 10,
                      textDecorationLine: "underline",
                      textAlign: "center",
                    }}
                  >
                    BUYER FILED CLAIM
                  </Text>
                </View>

                {disputeScreen ? (
                  <>
                    <Text
                      style={{
                        fontFamily: fonts.family.semiBold,
                        fontSize: 15,
                        textAlign: "left",
                        marginTop: 20,
                        marginLeft: 20,
                      }}
                    >
                      Explaination
                    </Text>
                    <TextInput
                      placeholder="Add Comment Here"
                      style={{
                        fontFamily: "Montserrat-SemiBold",
                        fontSize: 16,
                        width: "100%",
                        height: 100,
                        paddingRight: 20,

                        marginHorizontal: 20,
                        padding: 0,
                        borderBottomColor: "#96969660",
                        borderBottomWidth: 1,
                      }}
                      numberOfLines={5}
                      multiline={true}
                      value={disputeRequestText}
                      onChangeText={(text) => {
                        setDisputeRequestText(text);
                      }}
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
                      blurOnSubmit
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginHorizontal: 15,
                        marginTop: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setdisputeScreen(false);
                          navigation.navigate("ClaimPhotos", {
                            order: orderData,
                          });
                        }}
                        style={{
                          flexDirection: "row",
                          marginRight: 5,
                          alignItems: "center",
                          justifyContent: "center",
                          flex: 1,
                          borderColor: colors.active,
                          borderWidth: 1,
                          borderRadius: 5,
                          padding: 7.5,
                        }}
                      >
                        <Ionicons2
                          size={20}
                          name="camera-outline"
                          color={colors.active}
                        />
                        <Text
                          style={{
                            fontFamily: fonts.family.regular,
                            color: colors.active,
                            fontSize: 12,
                            marginLeft: 5,
                          }}
                        >
                          ATTACH CAMERA
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          pickFIle();
                        }}
                        style={{
                          flexDirection: "row",
                          marginLeft: 5,
                          alignItems: "center",
                          justifyContent: "center",
                          flex: 1,
                          borderColor: colors.active,
                          borderWidth: 1,
                          borderRadius: 5,
                          padding: 7.5,
                        }}
                      >
                        <Ionicons2 size={20} name="add" color={colors.active} />
                        <Text
                          style={{
                            fontFamily: fonts.family.regular,
                            color: colors.active,
                            fontSize: 12,
                            marginLeft: 5,
                          }}
                        >
                          ATTACH DOCS
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        fontFamily: fonts.family.regular,
                        fontSize: 14,
                        textAlign: "center",
                      }}
                    >
                      {`${orderData.buyerInfo.name} has filed a claim and is requesting $${orderData.totalPaid}. Please respond to this claim within 48 hours. Here’s what they said:`}
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#F5F5F5",
                        padding: 10,
                        paddingVertical: 5,
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.family.regular,
                          fontSize: 14,
                          paddingBottom: 8,
                          marginHorizontal: 27.5,
                          textAlign: "center",
                          color: "#767676",
                        }}
                      >
                        {
                          orderData?.ClaimRequests?.[
                            orderData?.ClaimRequests?.length - 1 || 0
                          ]?.ClaimComments?.[0]?.comment
                        }
                      </Text>
                    </View>

                    {orderData?.ClaimRequests?.[
                      orderData?.ClaimRequests?.length - 1 || 0
                    ]?.ClaimComments?.[0]?.images?.length ? (
                      <Text
                        style={{
                          fontFamily: fonts.family.semiBold,
                          fontSize: 15,
                          textAlign: "left",
                          marginVertical: 20,
                          marginLeft: 20,
                        }}
                      >
                        Photos
                      </Text>
                    ) : null}
                    <View style={{ flexDirection: "row" }}>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                      >
                        {orderData?.ClaimRequests?.[
                          orderData?.ClaimRequests?.length - 1 || 0
                        ]?.ClaimComments?.[0]?.images.map((img) => {
                          return (
                            <TouchableWithoutFeedback
                              onPress={() => {
                                navigation.navigate("PhotoFullScreen", {
                                  imageUrl: img.url,
                                  isClaim: true,
                                });
                              }}
                            >
                              <Image
                                source={{
                                  uri: img.url,
                                }}
                                style={{
                                  width: 100,
                                  height: 100,
                                  marginLeft: 10,
                                  borderRadius: 10,
                                }}
                              />
                            </TouchableWithoutFeedback>
                          );
                        })}
                      </ScrollView>
                    </View>
                    <View
                      style={{
                        width: "90%",
                        height: 1,
                        backgroundColor: "#76767630",
                        alignSelf: "center",
                        marginTop: 20,
                        marginBottom: 20,
                      }}
                    ></View>
                    <Text
                      style={{
                        fontFamily: fonts.family.semiBold,
                        fontSize: 15,
                        textAlign: "left",
                        marginVertical: 15,
                        marginLeft: 20,
                      }}
                    >
                      Ways to Respond
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        marginHorizontal: 10,
                      }}
                    >
                      <View style={[styles.contentItemConainer]}>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate("ChatScreen", {
                              item: chatItem,
                            });
                            setdisputeScreen(false);
                            setDisputeRequestText("");
                          }}
                        >
                          <View style={styles.contentItemHeader}>
                            <Text style={styles.itemHeaderText}>
                              {"Chat with Buyer"}
                            </Text>
                          </View>
                          <View style={styles.contentIconContainer}>
                            <Icon
                              icon={"chat_active"}
                              style={{
                                width: 45,
                                height: 40,
                              }}
                            />
                          </View>
                          <View style={styles.itemDetailContainer}>
                            <Text style={styles.itemDetailText}>
                              If you resolve this with the seller, and they
                              retract their claim, your claim won’t be affected
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.contentItemConainer]}>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate("ReturnRefund", {
                              post: chatItem.post,
                              sellerName: `${chatItem.sellerFirstName} ${chatItem.sellerLastName}`,
                              chatItem,
                              orderObj: orderData,
                              screen: "orderstatus",
                              claimRequestId:
                                orderData?.ClaimRequests?.[
                                  orderData?.ClaimRequests?.length - 1 || 0
                                ]?.id,
                            });
                            setdisputeScreen(false);
                            setDisputeRequestText("");
                          }}
                        >
                          <View style={styles.contentItemHeader}>
                            <Text style={styles.itemHeaderText}>
                              {"Refund the Buyer"}
                            </Text>
                          </View>
                          <View style={styles.contentIconContainer}>
                            <Icon
                              icon={"option_refund_icon"}
                              style={{
                                height: 35,
                                width: 50,
                              }}
                            />
                          </View>
                          <View style={styles.itemDetailContainer}>
                            <Text style={styles.itemDetailText}>
                              Issuing a refund for the disputed amount will
                              quickly close the case.
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        marginHorizontal: 10,
                        flexDirection: "row",
                        marginBottom: 20,
                      }}
                    >
                      <View style={[styles.contentItemConainer]}>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate("ClaimDisputeScreen", {
                              screenDetails,
                              userProductDetail,
                              orderData,
                              chatItem,
                            });
                          }}
                        >
                          <View style={styles.contentItemHeader}>
                            <Text style={styles.itemHeaderText}>
                              {"Dispute Claim"}
                            </Text>
                          </View>
                          <View style={styles.contentIconContainer}>
                            <Icon
                              icon={"dispute"}
                              style={{
                                height: 40,
                                width: 55,
                              }}
                            />
                          </View>
                          <View style={styles.itemDetailContainer}>
                            <Text style={styles.itemDetailText}>
                              Dispute this claim by explaining the situation.
                              Homitag will also be involved in this process.
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={{ flex: 1 }}></View>
                    </View>
                  </>
                )}
              </View>
            </ScrollView>
            {disputeScreen ? (
              <FooterAction
                mainButtonProperties={{
                  label: "Submit Dispute",
                  onPress: () => {
                    setraiseDisputeLoading(true);
                    actions.raiseDispute({
                      orderId: orderData.id,
                      claimId:
                        orderData?.ClaimRequests?.[
                          orderData?.ClaimRequests?.length - 1 || 0
                        ]?.id,
                      params: {
                        comment: disputeRequestText,
                        buyerId: orderData?.buyerId,
                        destination: "homitag",
                        images: claimPhotosList,
                        nextStatus: "disputed",
                        origin: "seller",
                      },
                    });
                    setTimeout(() => {
                      setraiseDisputeLoading(false);
                      setdisputeScreen(false);
                    }, 2000);
                  },
                  showLoading: raiseDisputeLoading,
                }}
              />
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default ClaimOptionScreen;
