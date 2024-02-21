import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Modal,
  ScrollView,
  Keyboard,
  Platform,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles } from "../styles";
import colors from "#themes/colors";
import fonts from "#themes/fonts";
import { MessageShow } from "#services/apiChat";
import { FooterAction, BoldText, BodyText } from "#components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageCropPicker from "react-native-image-crop-picker";
import moment from "moment";
import { SendMessage } from "#services/apiChat";
import { selectSellData } from "#modules/Sell/selectors";
import { useSelector } from "react-redux";
import { isIphoneX } from "react-native-iphone-x-helper";
import DeviceInfo from "react-native-device-info";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ContactUsScreen = ({ navigation, route }) => {
  const base64regex =
    /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  let hasDynamicIsland = DeviceInfo.hasDynamicIsland();
  const [message, setMessage] = useState("");
  const [contactUsId, setContactUsId] = useState("");
  const [data, setData] = useState([]);
  const [datax, setDatax] = useState({});
  const [chatMessage, setChatMessage] = useState([]);
  const [singleViewDetail, setSingleViewDetail] = useState({});
  const [showChatModal, setShowChatModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dumpImage, setDumpImage] = useState("");
  const [picsSelected, setPicsSelected] = useState("");
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [photoList, setPhotoList] = useState(false);
  const [picImage, setPicImage] = useState("");

  useEffect(() => {
    getUserId();
  }, []);

  const showModal = (item) => {
    setShowChatModal(true);
    setDatax(item);
    setChatMessage(item?.messages?.reverse());
    setContactUsId(item.histories[0].contactusId);
  };

  const showViewDetailModal = (item) => {
    setViewDetailsModal(true);
    setSingleViewDetail(item);
  };

  const getUserId = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("@com.homitag:tokens");
    const keys = await AsyncStorage.getItem("@com.homitag:UserInformation");
    const user = JSON.parse(keys);
    const usertoken = JSON.parse(token);
    const userId = user.id;
    const abc = await MessageShow(userId, usertoken.token);
    if (abc.rows?.[0] == null) {
      setData([]);
      setLoading(false);
    } else {
      setData(abc.rows);
      setLoading(false);
    }
  };

  const choosePhotoFromLibrary = () => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      compressImageQuality: 0.6,
    })
      .then((file) => {
        // const lastPhotos=[...picsSelected];
        // lastPhotos.push(file.path);
        setPicsSelected(file.path);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { photosList } = useSelector(selectSellData());

  useEffect(() => {
    //const lastPhotos=[...picsSelected];
    if (photoList === true) {
      if (photosList[0] == null) {
      } else {
        setShowChatModal(true);
        setPicsSelected(photosList[0]?.uri);
        setPicImage(
          Platform.OS == "ios" ? photosList[0]?.image : photosList[0]?.uri
        );
        // lastPhotos.push(photosList && photosList[0]?.uri)
        // setPicsSelected(lastPhotos);
      }
    }
  }, [photosList]);

  const getAttachment = () => {
    navigation.navigate("SellPhotosProfile");
    setShowChatModal(false);
  };

  const sendMessage = async () => {
    if (message == "") {
      alert("Please enter message");
      setLoad(false);
    } else {
      const token = await AsyncStorage.getItem("@com.homitag:tokens");
      const usertoken = JSON.parse(token);

      const keys = await AsyncStorage.getItem("@com.homitag:UserInformation");
      const user = JSON.parse(keys);
      const userId = user.id;
      const abc = await SendMessage(
        usertoken,
        userId,
        contactUsId,
        message,
        picImage
      );
      if (abc.me === true) {
        var imgx = [];
        var imgn = "image.PNG";

        if (picsSelected == "") {
        } else {
          let ObjectToBeSend = {
            url: `${picImage}`,
            name: `${imgn}`,
          };
          imgx.push(ObjectToBeSend);
        }

        let newObj = {
          id: chatMessage?.length + 1,
          messageInfo: {
            type: "text",
            contents: `${message}`,
            attachments: imgx,
          },
          me: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        chatMessage.push(newObj);
        //datax.messages.splice(-1, -1, newObj);

        setMessage("");
        setPicsSelected("");
      }
      setLoad(false);
    }
  };

  const scrollViewRef = useRef();
  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: false });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={"always"}>
        <View style={{ width: "100%" }}>
          {loading ? (
            <ActivityIndicator size="large" color="black" />
          ) : data.length == 0 ? (
            <Text style={{ textAlign: "center", marginTop: 10, fontSize: 16 }}>
              No Data Found
            </Text>
          ) : (
            data.map((item, i) => (
              <TouchableOpacity
                style={{
                  width: "100%",
                  flexDirection: "row",
                  marginTop: 10,
                  marginBottom: 10,
                }}
                onPress={() => showModal(item)}
                key={i}
              >
                <View
                  style={{ width: "20%", height: 57, alignItems: "center" }}
                >
                  <View
                    style={{
                      width: 57,
                      height: 57,
                      backgroundColor: "#616161",
                      borderRadius: 50,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 20 }}>CS</Text>
                  </View>
                </View>
                <View
                  style={{ width: "60%", height: 57, justifyContent: "center" }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      color: "#313334",
                      fontWeight: "bold",
                    }}
                  >
                    {item?.subject} - {item?.orderInfo?.orderID}
                  </Text>
                  <Text style={{ fontSize: 13, color: "#313334", top: 3 }}>
                    The Tracking Link is mentioned...
                  </Text>
                </View>
                <View
                  style={{
                    width: "20%",
                    height: 57,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#00BDAA", fontSize: 12 }}>
                    {moment(item.createdAt).format("hh:mm")}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/*Chat Modal start*/}
      <Modal
        animationType="slide"
        transparent
        visible={showChatModal}
        style={styles.chatModal}
        onRequestClose={() => {
          setShowChatModal(false);
          getUserId();
        }}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.white,
            marginTop: hasDynamicIsland ? 50 : 0,
          }}
        >
          {/*Header start*/}
          <View
            style={{
              elevation: 3,
              backgroundColor: colors.white,
              alignItems: "center",
              paddingVertical: 15,
              flexDirection: "row",
              position: "absolute",
              top: Platform.OS == "android" ? 0 : hasDynamicIsland ? 0 : 43,
              zIndex: 1,
            }}
          >
            <View style={{ width: "13%", alignItems: "center" }}>
              <Ionicons
                onPress={() => {
                  getUserId();
                  setShowChatModal(false);
                }}
                name="arrow-back-outline"
                size={25}
                color="#969696"
              />
            </View>
            <View style={{ width: "74%", alignItems: "center" }}>
              <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}>
                {datax?.subject}
              </Text>
              <Text style={{ fontSize: 13, color: "#313334" }}>
                {datax?.orderInfo?.orderID}
              </Text>
            </View>
            <View style={{ width: "13%", alignItems: "center" }}></View>
          </View>
          <KeyboardAwareScrollView
            scrollEnabled={false}
            extraHeight={70}
            keyboardShouldPersistTaps={"always"}
            contentContainerStyle={{ flex: 1 }}
          >
            {/*Header end*/}
            {/* {renderTextWithBackground()} */}
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={scrollToBottom}
              keyboardShouldPersistTaps={"always"}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ marginTop: 60, paddingBottom: 260 }}
            >
              <View style={styles.modalContentContainer}>
                {chatMessage?.map((item, i) => {
                  return (
                    <>
                      {item.me === false ? (
                        /*User side msg rect start*/
                        <View style={{ width: "100%" }}>
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "row",
                              marginVertical: 10,
                            }}
                          >
                            <View
                              style={{
                                width: 37,
                                height: 37,
                                marginLeft: 14,
                                backgroundColor: "#616161",
                                borderRadius: 50,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text style={{ color: "#fff", fontSize: 12 }}>
                                CS
                              </Text>
                            </View>

                            <View
                              style={{
                                backgroundColor: "#fff",
                                marginLeft: 20,
                                marginRight: 100,
                                elevation: 6,
                                paddingVertical: 10,
                                borderRadius: 10,
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                numberOfLines={2}
                                style={{
                                  color: "#313334",
                                  fontSize: 15,
                                  paddingHorizontal: 5,
                                }}
                              >
                                {item?.messageInfo?.contents}
                              </Text>
                              <Text
                                style={{
                                  textAlign: "right",
                                  color: "#313334",
                                  fontSize: 10,
                                  top: 6,
                                  right: 5,
                                }}
                              >
                                {moment(item?.createdAt).format("hh:mm")}
                              </Text>
                            </View>
                          </View>
                          {/*Image*/}
                          {item?.messageInfo?.attachments?.length > 0 ? (
                            <View style={{ width: "100%" }}>
                              <View
                                style={{
                                  width: "100%",
                                  flexDirection: "row",
                                  marginVertical: 10,
                                }}
                              >
                                <View style={{ width: "16%" }}></View>

                                <View
                                  style={{
                                    backgroundColor: "#fff",
                                    flexDirection: "row",
                                    elevation: 6,
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 10,
                                    justifyContent: "center",
                                  }}
                                >
                                  <Icon
                                    style={{ marginRight: 15 }}
                                    color="#00BDAA"
                                    size={20}
                                    name="paperclip"
                                  />
                                  <Text
                                    style={{ fontSize: 14, fontWeight: "bold" }}
                                  >
                                    {item?.messageInfo?.attachments[0]?.name}
                                  </Text>
                                </View>
                                <View></View>
                              </View>
                            </View>
                          ) : null}
                        </View>
                      ) : (
                        /*User side msg rect end*/
                        <View
                          style={{
                            width: "100%",
                            alignItems: "flex-end",
                            marginVertical: 10,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "#f5f5f5",
                              marginLeft: 20,
                              marginRight: 20,
                              paddingVertical: 12,
                              borderRadius: 10,
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              numberOfLines={2}
                              style={{
                                color: "#313334",
                                fontSize: 15,
                                paddingHorizontal: 15,
                              }}
                            >
                              {item?.messageInfo?.contents}
                            </Text>
                            <Text
                              style={{
                                textAlign: "right",
                                color: "#313334",
                                fontSize: 10,
                                top: 6,
                                right: 5,
                              }}
                            >
                              {moment(item?.createdAt).format("hh:mm")}
                            </Text>
                          </View>

                          {/*Image*/}
                          {item?.messageInfo?.attachments?.length > 0 ? (
                            <>
                              <TouchableOpacity
                                style={{
                                  backgroundColor: "#fff",
                                  flexDirection: "row",
                                  elevation: 6,
                                  paddingVertical: 5,
                                  paddingHorizontal: 10,
                                  marginRight: 25,
                                  marginTop: 8,
                                  marginBottom: 3,
                                  borderRadius: 10,
                                  justifyContent: "center",
                                }}
                                onPress={() => {
                                  setDumpImage(
                                    item?.messageInfo?.attachments[0]?.url
                                  );
                                  setModalVisible(true);
                                }}
                              >
                                <Icon
                                  style={{ marginRight: 15 }}
                                  color="#00BDAA"
                                  size={20}
                                  name="paperclip"
                                />
                                <Text
                                  style={{ fontSize: 14, fontWeight: "bold" }}
                                >
                                  {item?.messageInfo?.attachments[0]?.name}
                                </Text>
                              </TouchableOpacity>
                            </>
                          ) : null}
                          {/*View detail button start*/}
                          <TouchableOpacity
                            style={styles.ViewDetailBtn}
                            onPress={() => showViewDetailModal(item)}
                          >
                            <Text style={styles.viewDetailTxt}>
                              View Details
                            </Text>
                          </TouchableOpacity>
                          {/*View detail button end*/}
                          {/*Image*/}
                        </View>
                      )}

                      <View
                        style={{ width: "100%", marginVertical: 15 }}
                      ></View>

                      {/* <View style={{width:'100%', borderWidth:1, alignItems:'center'}}>
                <Text style={{color:'#969696', fontSize:10}}>Mon 07:00</Text>
              </View> */}
                    </>
                  );
                })}
              </View>

              {/*Image Modal Start*/}
              <View style={styles.centeredView}>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(false);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <View style={{ width: "100%", alignItems: "center" }}>
                        <ImageBackground
                          source={{
                            uri: base64regex.test(dumpImage)
                              ? `data:image/jpeg;base64,${dumpImage}`
                              : dumpImage,
                          }}
                          imageStyle={{ borderRadius: 8 }}
                          resizeMode="contain"
                          style={{
                            width: 260,
                            alignItems: "flex-end",
                            borderRadius: 8,
                            height: 256,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              setModalVisible(false);
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: "#fff",
                                borderRadius: 50,
                                marginTop: 0,
                                width: 25,
                                height: 25,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Ionicons
                                color="#313334"
                                size={20}
                                name="close-outline"
                              />
                            </View>
                          </TouchableOpacity>
                        </ImageBackground>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
              {/*Image Modal End*/}

              {/*View details Modal start*/}
              <Modal
                animationType="slide"
                transparent
                visible={viewDetailsModal}
                style={styles.viewModal}
                onRequestClose={() => {
                  setViewDetailsModal(false);
                }}
              >
                <SafeAreaView
                  style={{
                    flex: 1,
                    backgroundColor: colors.white,
                    marginTop: hasDynamicIsland ? 50 : 0,
                  }}
                >
                  {/*Header start*/}
                  <View
                    style={{
                      elevation: 3,
                      backgroundColor: "#ffffff",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      paddingVertical: 15,
                      flexDirection: "row",
                    }}
                  >
                    <Ionicons
                      onPress={() => {
                        setViewDetailsModal(false);
                      }}
                      name="arrow-back-outline"
                      size={25}
                      color="#969696"
                    />
                    <Text></Text>
                    <Text
                      style={{
                        fontFamily: fonts.family.semiBold,
                        fontSize: 16,
                      }}
                    >
                      Details
                    </Text>
                    <Text></Text>
                    <Text></Text>
                  </View>
                  {/*Header end*/}
                  <ScrollView keyboardShouldPersistTaps={"always"}>
                    <View>
                      <View style={styles.modalContentContainer}>
                        <View style={styles.mainView}>
                          {/*Title txt rect start*/}
                          <View style={styles.titleView}>
                            <Text style={styles.titleTxt}>Subject</Text>
                          </View>
                          {/*Title txt rect end*/}
                          {/*Item show rect start*/}
                          <View style={styles.itemShowView}>
                            <Text style={styles.subTitleTxt}>
                              {datax?.subject}
                            </Text>
                          </View>
                          {/*Item show rect end*/}

                          {/*Title txt rect start*/}
                          <View style={styles.titleView}>
                            <Text style={styles.titleTxt}>Order ID</Text>
                          </View>
                          {/*Title txt rect end*/}
                          {/*Item show rect start*/}
                          <View style={styles.itemShowView}>
                            <Text style={styles.subTitleTxt}>
                              {datax?.orderInfo?.orderID}
                            </Text>
                          </View>
                          {/*Item show rect end*/}

                          {/*Title txt rect start*/}
                          <View style={styles.titleView}>
                            <Text style={styles.titleTxt}>Item</Text>
                          </View>
                          {/*Title txt rect end*/}
                          <View
                            style={{
                              width: "94%",
                              flexDirection: "row",
                              marginTop: 10,
                              marginBottom: "2%",
                            }}
                          >
                            <View style={{ width: "20%", height: 49 }}>
                              <Image
                                source={{
                                  uri: datax?.orderInfo?.productInfo
                                    ?.ProductImages[0]?.urlImage,
                                }}
                                resizeMode="stretch"
                                style={{
                                  width: 51,
                                  height: 49,
                                  borderRadius: 20,
                                }}
                              ></Image>
                            </View>
                            <View
                              style={{
                                width: "65%",
                                height: 49,
                                justifyContent: "center",
                              }}
                            >
                              <Text style={{ fontSize: 18, color: "#313334" }}>
                                {datax?.orderInfo?.productInfo?.title}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: "#696969",
                                  top: 3,
                                }}
                              >
                                {datax?.userInfo?.name}
                              </Text>
                            </View>
                            <View
                              style={{
                                width: "15%",
                                height: 49,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            ></View>
                          </View>

                          {/*Title txt rect start*/}
                          <View style={styles.titleView}>
                            <Text style={styles.titleTxt}>MESSAGE</Text>
                          </View>
                          {/*Title txt rect end*/}
                          {/*Item show rect start*/}
                          <View style={styles.itemShowView}>
                            <Text style={styles.subTitleTxt}>
                              {singleViewDetail?.messageInfo?.contents}
                            </Text>
                          </View>
                          {/*Item show rect end*/}

                          {/*Title txt rect start*/}
                          <View style={styles.titleView}>
                            <Text style={styles.titleTxt}>Attachments</Text>
                          </View>
                          {/*Title txt rect end*/}
                          <View style={styles.attachmentRect}>
                            <ScrollView
                              horizontal={true}
                              keyboardShouldPersistTaps={"always"}
                              showsHorizontalScrollIndicator={false}
                            >
                              <Image
                                source={{
                                  uri: singleViewDetail?.messageInfo
                                    ?.attachments[0]?.url,
                                }}
                                resizeMode="stretch"
                                style={{
                                  width: 93.67,
                                  height: 90,
                                  borderRadius: 20,
                                  marginRight: 10,
                                }}
                              ></Image>
                            </ScrollView>
                          </View>
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                </SafeAreaView>
              </Modal>
              {/*View details Modal end*/}
            </ScrollView>
            {picsSelected == "" ? (
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  height: "25%",
                  elevation: 6,
                  backgroundColor: "#fff",
                  marginBottom: 0,
                  bottom: 0,
                  position: "absolute",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "45%",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setPhotoList(true);
                      getAttachment();
                    }}
                  >
                    <View style={styles.button}>
                      <Icon
                        style={{ marginRight: 20 }}
                        color="#00BDAA"
                        size={23}
                        name="paperclip"
                      />
                      <Text style={styles.button__text}>Add Attachment</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    height: hasDynamicIsland ? "45%" : "55%",
                  }}
                >
                  <View
                    style={{
                      width: "78%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: 54,
                        backgroundColor: "#F5F5F5",
                        borderRadius: 30,
                        justifyContent: "center",
                        marginLeft: 20,
                      }}
                    >
                      <TextInput
                        placeholderTextColor={"#313334"}
                        style={styles.inputText}
                        multiline={true}
                        placeholder={"Send message"}
                        value={message}
                        onChangeText={setMessage}
                        returnKeyType="done"
                        onSubmitEditing={() => {
                          Keyboard.dismiss();
                        }}
                      />
                    </View>
                  </View>
                  <View style={{ width: "25%", justifyContent: "center" }}>
                    <TouchableOpacity
                      style={{
                        width: 55,
                        height: 54,
                        backgroundColor: message == "" ? "#C4C4C4" : "#7471FF",
                        borderRadius: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 20,
                      }}
                      disabled={message == "" ? true : false}
                      onPress={() => {
                        setLoad(true);
                        sendMessage();
                      }}
                    >
                      {load ? (
                        <ActivityIndicator size="large" color="fff" />
                      ) : (
                        <Image
                          source={require("../../../../assets/icons/sendIcon.png")}
                          style={{ width: 16, height: 19.67 }}
                        ></Image>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  height: "30%",
                  elevation: 6,
                  backgroundColor: "#fff",
                  marginBottom: 0,
                  bottom: 0,
                  position: "absolute",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "30%",
                    justifyContent: "center",
                  }}
                >
                  <ImageBackground
                    source={{
                      uri: picsSelected,
                    }}
                    imageStyle={{ borderRadius: 8 }}
                    resizeMode="cover"
                    style={{
                      width: 55,
                      marginRight: 20,
                      alignItems: "flex-end",
                      borderRadius: 8,
                      alignSelf: "center",
                      height: 58,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setPicsSelected("");
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: 50,
                          marginTop: 0,
                          width: 15,
                          height: 15,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons color="#000" size={15} name="close-outline" />
                      </View>
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
                {/*Add attachment button*/}
                <View
                  style={{
                    width: "100%",
                    height: "30%",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      getAttachment();
                    }}
                  >
                    <View style={styles.button}>
                      <Icon
                        style={{ marginRight: 20 }}
                        color="#00BDAA"
                        size={23}
                        name="paperclip"
                      />
                      <Text style={styles.button__text}>Add Attachment</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {/*Message inputType*/}
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    height: hasDynamicIsland ? "30%" : "40%",
                  }}
                >
                  <View
                    style={{
                      width: "78%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: 54,
                        backgroundColor: "#F5F5F5",
                        borderRadius: 30,
                        justifyContent: "center",
                        marginLeft: 20,
                      }}
                    >
                      <TextInput
                        placeholderTextColor={"#313334"}
                        style={styles.inputText}
                        multiline={true}
                        placeholder={"Send message"}
                        value={message}
                        onChangeText={setMessage}
                        returnKeyType="done"
                        onSubmitEditing={() => {
                          Keyboard.dismiss();
                        }}
                        blurOnSubmit
                      />
                    </View>
                  </View>
                  <View style={{ width: "25%", justifyContent: "center" }}>
                    <TouchableOpacity
                      style={{
                        width: 55,
                        height: 54,
                        backgroundColor:
                          message == "" || picsSelected == ""
                            ? "#C4C4C4"
                            : "#7471FF",
                        borderRadius: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 20,
                      }}
                      disabled={
                        message == "" || picsSelected == "" ? true : false
                      }
                      onPress={() => {
                        setLoad(true);
                        sendMessage();
                      }}
                    >
                      {load ? (
                        <ActivityIndicator size="large" color="black" />
                      ) : (
                        <Image
                          source={require("../../../../assets/icons/sendIcon.png")}
                          style={{ width: 16, height: 19.67 }}
                        ></Image>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </Modal>
      {/*Chat Modal End*/}

      <View
        style={{
          width: "100%",
          marginBottom: 0,
          bottom: 0,
          position: "absolute",
          height: "10%",
        }}
      >
        <View style={styles.footer}>{renderButton(navigation)}</View>
      </View>
    </SafeAreaView>
  );
};

const renderTextWithBackground = () => {
  return (
    <BodyText style={styles.textCard}>
      <BoldText>Note: </BoldText>
      This issue was resolved.
    </BodyText>
  );
};

const renderButton = (navigation) => {
  return (
    <FooterAction
      mainButtonProperties={{
        label: "New Message",
        onPress: () => {
          navigation.navigate("NewMessageContactUsScreen");
        },
        mainButtonStyle: { marginBottom: isIphoneX() ? 20 : 0 },
      }}
    />
  );
};

export default ContactUsScreen;
