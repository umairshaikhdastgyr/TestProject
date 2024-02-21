import React, { Fragment, useState, useEffect } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text,
  Image,
  ImageBackground,
  Modal,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { styles } from "./styles";
import {
  FooterAction,
  BoldText,
  BodyText,
  Button,
  RadioButton,
} from "#components";
//import { Colors } from "#themes";
import colors from "#themes/colors";
import fonts from "#themes/fonts";
import Dialog from "./Dialog";
import { BackHandler } from "react-native";
import { ContactUs } from "#services/apiChat";
import { useActions, getMapObjectFromGoogleObj } from "#utils";
import ImageCropPicker from "react-native-image-crop-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import RNFS from "react-native-fs";
import _ from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { removePhotoFromList, setPhotoList } from "#modules/Sell/actions";
import { getOrders } from "#modules/Orders/actions";
import { useSelector } from "react-redux";
import { selectOrderData } from "#modules/Orders/selectors";
import { selectSellData } from "#modules/Sell/selectors";
import { useMemo } from "react";
import { useCallback } from "react";
import { ActivityIndicator } from "react-native-paper";

const NewMessageScreenSecond = ({ navigation, route }) => {
  const [fromOrders, setFromOrders] = useState(true);
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [subject, setSubject] = useState({
    title: "Select Subject",
    value: "select-subject",
  });
  const [picsSelected, setPicsSelected] = useState([]);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [order, setOrder] = useState([]);
  const [singleItem, setSingleItem] = useState();
  const [loader, setLoader] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const { ordersList } = useSelector(selectOrderData());

  const { photosList } = useSelector(selectSellData());

  useEffect(() => {
    setOrder(ordersList?.data);
  }, [ordersList]);

  // useEffect(()=>{
  //   choosePhotoFromLibrary()
  // }, [photosList])

  const actions = useActions({
    getOrders,
    removePhotoFromList,
    setPhotoList,
  });

  useEffect(() => {
    setShowChatModal(false);
    const lastPhotos = [...picsSelected];
    if (photosList && photosList[0] == null) {
    } else {
      const newPics = [];
      photosList &&
        photosList?.map((item, index) => {
          if (item && item?.uri) {
            newPics.push(item?.uri);
          } else {
            newPics.push(item);
          }
        });
      setShowChatModal(false);

      setPicsSelected(newPics);
    }
  }, [photosList]);

  const handleBackButtonClick = () => {
    actions.setPhotoList([]);
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, [photosList]);

  const onPress = (navigation) => {
    setDialogVisible(true);
  };

  const onModalTouchOutside = () => {
    setDialogVisible(false);
  };

  useEffect(() => {
    getPostDetails();
  }, []);

  const getPostDetails = async () => {
    const keys = await AsyncStorage.getItem("@com.homitag:UserInformation");
    const user = JSON.parse(keys);
    const userId = user.id;
    const dataToSend = {};
    dataToSend.postId = "";
    dataToSend.sellerId = "";
    dataToSend.sort = "createdAt-desc";
    dataToSend.page = 1;
    dataToSend.perPage = 50;
    dataToSend.buyerId = userId;
    actions.getOrders(dataToSend);
  };

  const renderButton = (navigation) => {
    return (
      <FooterAction
        mainButtonProperties={{
          label: "Send",
          onPress: async () => {
            callOperation();
          },
        }}
      />
    );
  };

  const callOperation = async () => {
    if (loader) {
    } else {
      setLoader(true);
      const keys = await AsyncStorage.getItem("@com.homitag:UserInformation");
      const user = JSON.parse(keys);
      const userId = user.id;
      let newArr;
      if (picsSelected[0] == null) {
        newArr = "";
      } else {
        //for(let i=0;i<picsSelected.length;i++){
        newArr = await RNFS.readFile(picsSelected[0], "base64");
        //newArr.push(photoBase64)
        //}
      }

      if (message == "") {
        alert("Please Enter Message");
        setLoader(false);
      } else if (subject?.title == "Select Subject") {
        alert("Please Select Subject");
        setLoader(false);
      } else {
        const contactRes = await ContactUs(
          subject,
          message,
          newArr,
          orderId,
          userId
        );
        if (
          contactRes &&
          contactRes?.result &&
          contactRes?.result?.success === false
        ) {
          setLoader(false);
          alert(contactRes?.result?.content?.message);
        } else {
          //idhar order id get karo, aur us ko save karo, Async Storage k andar,,,,
          // check in async either order id is available or not
          const checkOrderid = await AsyncStorage.getItem("CheckOrderId");
          const checkOrderidX = JSON.parse(checkOrderid);
          let arr = [];
          let newObj = {
            orderId: orderId,
          };
          if (checkOrderidX == null) {
            arr = [];
          } else {
            arr = checkOrderidX;
          }
          arr.push(newObj);
          await AsyncStorage.setItem("CheckOrderId", JSON.stringify(arr));
          setLoader(false);
          setPicsSelected([]);
          actions.setPhotoList([]);
          navigation.navigate("NewMessageConfirmationScreen");
        }
      }
    }
  };

  const onSecondaryButtonPressed = () => {
    setDialogVisible(false);
  };

  const onMainButtonPressed = (title, value) => {
    setDialogVisible(false);

    let subject = {
      title,
      value,
    };
    setSubject(subject);
  };

  const removeSelectedPhoto = (i) => {
    actions.removePhotoFromList(i);
  };

  const deletePhotos = (currentItem) => {
    const lastPhotos = [...picsSelected];
    const photos = lastPhotos.findIndex((item, index) => item == currentItem);
    const nextPhotos = lastPhotos.filter((item, index) => item !== currentItem);
    actions.setPhotoList(nextPhotos);
    setPicsSelected(nextPhotos);
    removeSelectedPhoto(photos);
  };

  useEffect(() => {
    checkOrderIIdx();
  }, []);

  const checkOrderIIdx = async () => {
    const checkOrderid = await AsyncStorage.getItem("CheckOrderId");
    const checkOrderidX = JSON.parse(checkOrderid);
  };

  const checkAndSaveOrder = async (item) => {
    const checkOrderid = await AsyncStorage.getItem("CheckOrderId");
    const checkOrderidX = JSON.parse(checkOrderid);
    if (checkOrderidX == null) {
      setOrderId(item.orderID);
      setSingleItem(item);
      setShowBoostModal(false);
    } else {
      const datax = checkOrderidX.find((data) => data.orderId == item.orderID);
      if (datax) {
        alert(
          "You already sent feedback on this order. Please wait for our reply."
        );
      } else {
        setOrderId(item.orderID);
        setSingleItem(item);
        setShowBoostModal(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <BodyText>Subject</BodyText>
          <View style={styles.margin}>
            <TouchableOpacity
              style={{
                width: "100%",
                borderWidth: 1,
                flexDirection: "row",
                borderColor: "#747474",
                height: 38,
                borderRadius: 7,
              }}
              onPress={() => onPress(navigation)}
            >
              <View style={{ width: "90%", justifyContent: "center" }}>
                <Text style={{ fontSize: 13, color: "#000000", left: 8 }}>
                  {subject.title}
                </Text>
              </View>
              <View
                style={{
                  width: "10%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons color="#000" size={22} name="chevron-down-outline" />
              </View>
            </TouchableOpacity>
            {/* <Button
              label={subject.title}
              theme="secondary"
              size="small"
              onPress={() => onPress(navigation)}
            /> */}
          </View>
          <View style={styles.margin}>
            <RadioButton
              isActive={fromOrders}
              label="Choose from my orders"
              onPress={() => setFromOrders(true)}
            />
          </View>

          {singleItem == null ? (
            <View style={styles.partialLength}>
              <Button
                label="Go to My Orders"
                theme="secondary"
                size="small"
                onPress={() => setShowBoostModal(true)}
              />
            </View>
          ) : (
            <View
              style={{ width: "100%", flexDirection: "row", marginTop: 10 }}
            >
              <View style={{ width: "20%", height: 49 }}>
                <Image
                  source={{
                    uri: singleItem?.productInfo?.ProductImages[0]?.urlImage,
                  }}
                  resizeMode="stretch"
                  style={{ width: 51, height: 49, borderRadius: 20 }}
                />
              </View>
              <View
                style={{ width: "65%", height: 49, justifyContent: "center" }}
              >
                <Text style={{ fontSize: 18 }}>
                  {singleItem?.productInfo?.title}
                </Text>
                <Text style={{ fontSize: 10, color: "##696969", top: 3 }}>
                  {singleItem?.buyerInfo?.name}
                </Text>
              </View>
              <View
                style={{
                  width: "15%",
                  height: 49,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity onPress={() => setSingleItem()}>
                  <Ionicons color="#000" size={35} name="close-outline" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.margin}>
            <RadioButton
              isActive={!fromOrders}
              label="I know order ID"
              onPress={() => {
                setOrderId();
                setFromOrders(false);
              }}
            />
          </View>
          {!fromOrders ? (
            <TextInput
              placeholderTextColor={"#999999"}
              style={styles.inputText}
              multiline={true}
              placeholder={"Enter Order Id"}
              value={orderId}
              onChangeText={(text) => setOrderId(text)}
              blurOnSubmit
              returnKeyType="done"
            />
          ) : null}
          <TextInput
            placeholderTextColor={"#999999"}
            style={styles.inputText}
            multiline={true}
            placeholder={"YOUR MESSAGE"}
            value={message}
            onChangeText={(text) => setMessage(text)}
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
            blurOnSubmit
          />

          {picsSelected.length > 0 ? (
            <View style={{ marginTop: "5%" }}>
              <Text style={{ fontSize: 13, color: "#313334" }}>
                Attachments
              </Text>
            </View>
          ) : null}
          <ScrollView
            style={{ flexDirection: "row", marginTop: 12 }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {picsSelected?.map((item, i) => (
              <Fragment key={i}>
                <ImageBackground
                  source={{
                    uri: item,
                  }}
                  imageStyle={{ borderRadius: 8 }}
                  resizeMode="cover"
                  style={{
                    width: 93,
                    marginRight: 20,
                    alignItems: "flex-end",
                    borderRadius: 8,
                    height: 90,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      deletePhotos(item);
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
                        color="#FF5556"
                        size={20}
                        name="close-outline"
                      />
                    </View>
                  </TouchableOpacity>
                </ImageBackground>
              </Fragment>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      {/*Modal start*/}
      <Modal
        animationType="slide"
        transparent
        visible={showBoostModal}
        style={styles.boostModal}
        onRequestClose={() => {
          setShowBoostModal(false);
        }}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
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
                setShowBoostModal(false);
              }}
              name="arrow-back-outline"
              size={25}
              color="#969696"
            />
            <Text></Text>
            <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}>
              New Message
            </Text>
            <Text></Text>
            <Text></Text>
          </View>
          {/*Header end*/}
          <ScrollView>
            <View>
              <View style={styles.modalContentContainer}>
                {ordersList?.data && ordersList?.data?.length > 0 ? (
                  ordersList?.data?.map((item, i) => {
                    return (
                      <TouchableOpacity
                        style={styles.mainCol}
                        key={i}
                        onPress={() => {
                          checkAndSaveOrder(item);
                        }}
                      >
                        <View style={styles.ImgCol}>
                          <Image
                            source={{
                              uri:
                                item?.productInfo?.ProductImages &&
                                item?.productInfo?.ProductImages[0]?.urlImage,
                            }}
                            resizeMode="stretch"
                            style={styles.img}
                          />
                        </View>
                        <View style={styles.TitleCol}>
                          <Text style={styles.titleTxt}>
                            {item?.productInfo?.title}
                          </Text>
                          <Text style={styles.subTitleTxt}>
                            {item.orderStatus}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={{ width: "100%" }}>
                    <Text style={styles.button__text}>Orders not found</Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
      {/*Modal End*/}

      <View style={{ width: "100%", height: "25%", flexDirection: "column" }}>
        <View
          style={{ width: "100%", height: "40%", justifyContent: "center" }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("SellPhotosProfile")}
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
          style={{ width: "100%", height: "70%", justifyContent: "center" }}
        >
          <View style={styles.footer}>
            {loader ? (
              <View style={styles.Buttoncontainer}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            ) : (
              renderButton(navigation)
            )}
          </View>
        </View>
      </View>

      <Dialog
        title={"Select Subject"}
        mainBtTitle={"Done"}
        dialogVisible={dialogVisible}
        onTouchOutside={onModalTouchOutside}
        onMainButtonPressed={onMainButtonPressed}
      />
    </SafeAreaView>
  );
};

export default NewMessageScreenSecond;
