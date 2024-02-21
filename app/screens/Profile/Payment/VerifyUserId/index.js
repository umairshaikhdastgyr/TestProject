import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  ImageBackground,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImagePicker from "react-native-image-crop-picker";
import { PERMISSIONS, check, request } from "react-native-permissions";
import { CachedImage, FooterAction, Icon, Toast } from "#components";
import images from "#assets/images";
import { styles } from "./styles";
import { Utilities } from "#styles";
import { Colors, Fonts } from "#themes";
import { PICKER_OPTIONS } from "#utils/parseDateToTimeAgo";
import Config from "#config";
import { CustomButton } from "./CustomButton";
import CameraAllowModal from "./CameraAllowModal";
import { updateStripeAccount } from "#services/apiUsers";
import { userSelector } from "#modules/User/selectors";
import moment from "moment";
import EditPersonalDetail from "./EditPersonalDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsEmulator } from "react-native-device-info";
const { API_URL } = Config;

const SelectId = [
  {
    id: 0,
    name: "Driver’s license",
  },
  {
    id: 1,
    name: "Passport",
  },
  {
    id: 2,
    name: "Identity Card",
  },
];

const imageMenuOptions = [
  {
    id: 0,
    name: "Take Photo",
  },
  {
    id: 1,
    name: "Choose From Gallery",
  },
  {
    id: 2,
    name: "Cancel",
  },
];

const VerifyUserId = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const {
    user: {
      information: { id },
      userStripeDataState,
    },
  } = useSelector(userSelector);
  const { result } = useIsEmulator();
  const stripeData = userStripeDataState?.data?.stripeData;

  const [currentStep, setCurrentStep] = useState(0);
  const [isCameraAccess, setIsCameraAccess] = useState(false);
  const [isAllowCamera, setAllowCamera] = useState(false);
  const [userIdData, setUserIdData] = useState({});
  const [isImageMenu, setIsImageMenu] = useState(false);
  const [isBackFile, setIsBackFile] = useState(false);
  const [loader, setLoader] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [frontIdImage, setFrontIdImage] = useState({});
  const [backIdImage, setBackIdImage] = useState({});
  const [frontVerifyId, setFrontVerifyId] = useState({});
  const [backVerifyId, setBackVerifyId] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [firstName, setFirstName] = useState("First Name");
  const [lastName, setLastName] = useState("Last Name");
  const [birthDate, setBirthdate] = useState("");

  const [address1, setAddress1] = useState("Addresss line 1");
  const [address2, setAddress2] = useState("Addresss line 2");
  const [isSowToast, setIsShowToast] = useState({ isShow: false, message: "" });

  useEffect(() => {
    if (stripeData) {
      setFirstName(stripeData?.individual?.first_name);
      setLastName(stripeData?.individual?.last_name);
      const brithdate = String(
        10000 * stripeData?.individual?.dob?.year +
          100 * stripeData?.individual?.dob?.month +
          stripeData?.individual?.dob?.day
      );
      setBirthdate(moment(brithdate).format("MM/DD/YYYY"));
      setAddress1(
        stripeData?.individual?.address?.line1
          ? stripeData?.individual?.address?.line1
          : "Addresss line 1"
      );
      setAddress2(
        stripeData?.individual?.address?.line2
          ? stripeData?.individual?.address?.line2
          : "Addresss line 2"
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (currentStep === 2) {
        check(
          Platform.select({
            android: PERMISSIONS.ANDROID.CAMERA,
            ios: PERMISSIONS.IOS.CAMERA,
          })
        )
          .then((result) => {
            if (result === "granted") {
              setAllowCamera(true);
              return;
            } else {
              setAllowCamera(false);
              return;
            }
          })
          .catch((reason) => console.log({ reason }));
      }
    }, [PERMISSIONS])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route?.params?.title ?? "Verify Account",
      headerRight: null,
      headerLeft: null,
    });
  }, [navigation, route]);

  const onBack = () => {
    if (currentStep == 0) {
      navigation.goBack();
    } else if (currentStep == 1) {
      setCurrentStep(0);
    } else if (currentStep == 2) {
      setCurrentStep(1);
    } else if (currentStep == 3) {
      if (isBackFile) {
        setIsBackFile(false);
        setBackIdImage({});
      } else {
        setFrontIdImage({});
        setCurrentStep(2);
      }
    } else if (currentStep == 4) {
      setCurrentStep(3);
    }
  };

  const handleContinue = async () => {
    if (currentStep == 0) {
      setCurrentStep(1);
      return;
    } else if (currentStep == 1) {
      setCurrentStep(2);
      return;
    } else if (currentStep == 2) {
      setCurrentStep(3);
      return;
    } else if (currentStep == 3) {
      setCurrentStep(4);
      return;
    } else {
      setLoader(true);
      const data = {
        params: {
          accountData: {
            individual: {
              verification: {
                document: {
                  back: backVerifyId?.id ? backVerifyId?.id : "",
                  front: frontVerifyId?.id,
                },
              },
            },
          },
        },
      };
      await updateStripeAccount(id, data)
        .then(async (res) => {
          if (res?.status == 400) {
            console.log(" res?.error?.message", res?.error?.message);
            Alert.alert("Oops!", res?.error?.message);
            setLoader(false);
          } else {
            if (res) {
              setTimeout(() => {
                navigation.navigate("PaymentManagement");
                setLoader(false);
              }, 4000);
              try {
                await AsyncStorage.setItem(
                  "@verifyId",
                  JSON.stringify({ isVerifyId: true, count: 0 })
                );
              } catch (error) {
                console.log({ error });
              }
            } else {
              setLoader(false);
            }
          }
        })
        .catch((e) => {
          setLoader(false);
          const errorBlockMsg = _.get(e, "result.content.message", null);
          Alert.alert("Oops!", errorBlockMsg);
        });
      return;
    }
  };

  const handleUserIdSelect = (val) => setUserIdData(val);

  const handleCameraPermission = () => {
    if (!isAllowCamera) {
      setIsCameraAccess(!isCameraAccess);
    } else {
      setIsShowToast({
        isShow: true,
        message: "Already granted permission, Please click to continue.",
      });
      setTimeout(() => {
        setIsShowToast({ isShow: false, message: "" });
      }, 3000);
    }
  };

  const handleImagePicker = (val) => {
    if (val?.name === "Choose From Gallery") {
      openLibraryHandler();
      return;
    }
    openCameraHandler();
    return;
  };

  const openLibraryHandler = async () => {
    await ImagePicker.openPicker({
      ...PICKER_OPTIONS,
    })
      .then((image) => {
        if (isBackFile) {
          setBackIdImage(image);
          return;
        } else {
          setFrontIdImage(image);
          return;
        }
      })
      .catch((e) => {
        return;
      });
  };

  const openCameraHandler = () => {
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      })
    ).then(async (result) => {
      if (result === "granted") {
        openCameraView();
        return;
      } else {
        Alert.alert(
          "Permission Denied",
          "You must allow the app for using camera.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "Go to Settings", onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
    });
  };

  const openCameraView = () => {
    ImagePicker.openCamera({
      ...PICKER_OPTIONS,
    })
      .then((image) => {
        if (isBackFile) {
          setBackIdImage(image);
          return;
        } else {
          setFrontIdImage(image);
          return;
        }
      })
      .catch((e) => {
        console.log("-=-=-=-", e);
        return;
      });
  };

  const image = isBackFile ? backIdImage : frontIdImage;

  const verifyUploadDocument = async () => {
    setFileLoading(true);
    const imageName = `${
      new Date().getMilliseconds() + "." + image?.mime.split("/")[1]
    }`;
    let res;
    if (result) {
      res = {
        fileCopyUri: Platform.OS === "android" ? image?.path : image?.sourceURL,
        name:
          image?.filename && image?.filename != undefined
            ? image?.filename
            : imageName,
        size: image?.size,
        type: image?.mime,
        uri: Platform.OS === "android" ? image?.path : image?.sourceURL,
      };
    } else {
      res = {
        fileCopyUri: image?.path,
        name:
          image?.filename && image?.filename != undefined
            ? image?.filename
            : imageName,
        size: image?.size,
        type: image?.mime,
        uri: image?.path,
      };
    }

    const data = new FormData();
    data.append("document", res);
    data.append("purpose", "identity_document");
    fetch(API_URL + `/banking/files`, {
      method: "POST",
      headers: {
        "x-api-key": Config.ApiKey,
        "Content-Type": "multipart/form-data; ",
      },
      body: data,
    })
      .then(async (response) => {
        const p = await response.json();
        if (p && p?.data && p?.data?.id) {
          if (isBackFile) {
            setBackVerifyId(p.data);
            handleContinue();
            setFileLoading(false);
          } else {
            setFrontVerifyId(p.data);
            if (userIdData.name == "Passport") {
              handleContinue();
            } else {
              setIsBackFile(true);
            }
            setFileLoading(false);
          }
        } else {
          Alert.alert(
            "Unable to confirm information",
            "Please verify your information and try again."
          );
          setFileLoading(false);
        }
      })
      .catch((err) => {
        Alert.alert("Unable to confirm information", err);
        setFileLoading(false);
      })
      .finally(() => {
        setFileLoading(false);
      });
  };

  const handleLooksGood = () => {
    verifyUploadDocument();
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{ width: "13%", alignItems: "center" }}
            onPress={() => onBack()}
          >
            <Ionicons name="arrow-back-outline" size={25} color="#969696" />
          </TouchableOpacity>
          <View style={{ width: "74%", alignItems: "center" }}>
            <Text style={styles.verify_text}>Verify Account</Text>
          </View>
        </View>
        <KeyboardAwareScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: 110 }}
          keyboardShouldPersistTaps="handled"
        >
          <Toast isVisible={isSowToast.isShow} message={isSowToast.message} />
          {currentStep === 0 ? (
            <>
              <CachedImage
                source={images.user_Id}
                style={styles.userId_icon}
                resizeMode={"contain"}
              />
              <Text style={styles.idVerification_text}>ID Verification</Text>
              <Text style={styles.idVerification_desc}>
                We use Strip to make sure you get paid and to keep your personal
                bank and detail secure. Click on continue to verify your
                identity and your account.
              </Text>
            </>
          ) : currentStep === 1 ? (
            <>
              <Text style={styles.select_ideidentification_text}>
                Select identification type
              </Text>
              <FlatList
                bounces={false}
                data={SelectId}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleUserIdSelect(item)}
                      style={styles.ideidentification_background}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View
                          style={[
                            styles.radio_button,
                            {
                              borderColor:
                                userIdData?.id == item.id
                                  ? Colors.primary
                                  : Colors.darkGrey2,
                              backgroundColor:
                                userIdData?.id == item.id
                                  ? Colors.primary
                                  : Colors.white,
                            },
                          ]}
                        />
                        <Text style={styles.userId_name}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => item + index}
              />
            </>
          ) : currentStep === 2 ? (
            <>
              <Text style={styles.select_ideidentification_text}>
                Allow camera access
              </Text>
              <Text style={styles.camera_allow_desc}>
                To continue the verification, Stripe needs access to your
                device’s camera
              </Text>
              <Text style={styles.camera_allow_desc}>
                A dialog will be shown asking for permission. Click on{" "}
                <Text
                  onPress={() => handleCameraPermission()}
                  style={{
                    fontFamily: Fonts.family.semiBold,
                    fontWeight: "700",
                    textDecorationLine: "underline",
                  }}
                >
                  Allow
                </Text>{" "}
                to grant access.
              </Text>
            </>
          ) : currentStep === 3 ? (
            <>
              {!image?.path ? (
                <View style={styles.photos_header}>
                  <Text style={styles.photos_header_text}>Upload images</Text>
                  <TouchableOpacity
                    hitSlop={{ top: 50, left: 50, right: 50, bottom: 50 }}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Text
                      style={[
                        styles.photos_header_text,
                        { color: Colors.primary },
                      ]}
                    >
                      More
                    </Text>
                    <Icon
                      icon={"chevron-down_active"}
                      style={{ width: 20, height: 20, resizeMode: "contain" }}
                      tintColor={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={[styles.photos_header, { marginBottom: 10 }]}>
                    <Text style={styles.photos_header_text}>Review images</Text>
                  </View>
                  <View
                    style={[
                      styles.photos_header,
                      { marginBottom: 0, marginTop: 0, alignSelf: "center" },
                    ]}
                  >
                    <Text style={styles.photos_header_text}>
                      {isBackFile ? "Back" : "Front"} of image
                    </Text>
                  </View>
                </>
              )}
              {!image?.path ? (
                <>
                  <ImageBackground
                    source={images.dash_rectangle}
                    resizeMode="cover"
                    style={styles.dash_rectangle_image}
                  >
                    <Text style={styles.select_image_title}>
                      {isBackFile ? "Back" : "Front"} of your identity document
                    </Text>
                    <Text style={styles.select_image_desc}>
                      Click below to upload a photo of the{" "}
                      {isBackFile ? "back" : "front"} of your identity document
                    </Text>
                    <TouchableOpacity
                      style={styles.select_button}
                      onPress={() => setIsImageMenu(true)}
                    >
                      <Text
                        style={[
                          styles.photos_header_text,
                          { color: Colors.white },
                        ]}
                      >
                        Select Photo
                      </Text>
                    </TouchableOpacity>
                  </ImageBackground>
                </>
              ) : (
                <View
                  style={[
                    styles.dash_rectangle_image,
                    { borderWidth: 1, borderRadius: 5, overflow: "hidden" },
                  ]}
                >
                  {fileLoading && (
                    <ActivityIndicator
                      size={"large"}
                      color={Colors.primary}
                      style={{ position: "absolute", zIndex: 99 }}
                    />
                  )}
                  <CachedImage
                    source={{ uri: image?.path }}
                    style={styles.dash_rectangle_image}
                    resizeMode={"contain"}
                  />
                </View>
              )}
              {Object.keys(isBackFile ? backIdImage : frontIdImage).length >
              0 ? (
                <>
                  <CustomButton
                    disabled={fileLoading ? true : false}
                    handleOnPress={() => handleLooksGood()}
                    buttonTitle={"Looks good"}
                    moreStyles={{ backgroundColor: Colors.primary }}
                    textStyles={{ color: Colors.white }}
                  />
                  <CustomButton
                    disabled={fileLoading ? true : false}
                    handleOnPress={() => {
                      if (isBackFile) {
                        setBackIdImage({});
                      } else {
                        setFrontIdImage({});
                      }
                    }}
                    buttonTitle={"Try a different image"}
                    moreStyles={{ marginVertical: 20 }}
                    textStyles={{ color: Colors.primary }}
                  />
                  <CustomButton
                    disabled={fileLoading ? true : false}
                    handleOnPress={() => {
                      if (isBackFile) {
                        setBackIdImage({});
                      } else {
                        setFrontIdImage({});
                      }
                    }}
                    buttonTitle={"Cancel"}
                    textStyles={{ color: Colors.primary }}
                  />
                </>
              ) : null}
            </>
          ) : (
            <>
              {loader && (
                <ActivityIndicator
                  size={"large"}
                  color={Colors.primary}
                  style={styles.loader_positon}
                />
              )}
              <Text style={styles.select_ideidentification_text}>
                Review and finish up
              </Text>
              <Text style={[styles.camera_allow_desc, { marginBottom: 0 }]}>
                You’re almost finish with your payment setup. Take a moment to
                review and confirm your information.
              </Text>
              <Text style={styles.select_ideidentification_text}>
                PERSONAL DETAILS
              </Text>
              <View style={styles.user_detail_box}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: Platform.OS === "android" ? 10 : 12,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={[styles.photos_header_text, { marginRight: 6 }]}
                    >
                      {firstName}
                    </Text>
                    <Text style={styles.photos_header_text}>{lastName}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setIsEdit(!isEdit)}>
                    <Icon
                      icon="edit_active"
                      style={styles.editIcon}
                      tintColor={Colors.active}
                    />
                  </TouchableOpacity>
                </View>
                <Text
                  style={[
                    styles.user_detail_text,
                    {
                      marginTop: 20,
                    },
                  ]}
                >
                  {birthDate}
                </Text>
                <Text style={[styles.user_detail_text, { marginTop: 20 }]}>
                  {address1}
                </Text>
                <Text style={[styles.user_detail_text, { marginTop: 12 }]}>
                  {address2}
                </Text>
                {stripeData?.individual?.id_number_provided ||
                (stripeData?.individual?.verification?.document?.back != null &&
                  stripeData?.individual?.verification?.document?.front !=
                    null) ? (
                  <Text
                    style={[
                      styles.photos_header_text,
                      {
                        marginTop: 20,
                      },
                    ]}
                  >
                    Other information provided
                  </Text>
                ) : null}
                {stripeData?.individual?.verification?.document?.back != null &&
                stripeData?.individual?.verification?.document?.front !=
                  null ? (
                  <Text
                    style={[
                      styles.user_detail_text,
                      {
                        marginTop: 6,
                      },
                    ]}
                  >
                    ID documentation
                  </Text>
                ) : null}
                {stripeData?.individual?.id_number_provided ? (
                  <Text style={[styles.user_detail_text, { marginTop: 6 }]}>
                    Social Security Number
                  </Text>
                ) : null}
              </View>
              <Text style={styles.agreement_text}>
                By clicking Agree & Submit, you agree to the Connected Account
                Agreement, and you certify that the information you have
                provided is complete and correct.
              </Text>
            </>
          )}
        </KeyboardAwareScrollView>
        {currentStep !== 3 && (
          <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
            {currentStep !== 2 || isAllowCamera ? (
              <FooterAction
                mainButtonProperties={{
                  label: currentStep === 4 ? "Agree & Submit" : "Continue",
                  disabled:
                    currentStep === 1
                      ? Object.keys(userIdData).length > 0
                        ? false
                        : true
                      : false,
                  onPress: () => {
                    handleContinue();
                  },
                }}
              />
            ) : (
              <View style={styles.camera_cancel_button}>
                <CustomButton
                  handleOnPress={() => onBack()}
                  buttonTitle={"Cancel"}
                  textStyles={{ color: Colors.primary }}
                />
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
      <Modal animationType="fade" visible={isImageMenu} transparent>
        <SafeAreaView
          style={{
            flex: 1,
            zIndex: 22,
            backgroundColor: "#00000080",
            justifyContent: "flex-end",
          }}
        >
          {imageMenuOptions?.length > 0 &&
            imageMenuOptions?.map((opt, index) => (
              <TouchableOpacity
                onPress={() => {
                  if (opt.name == "Cancel") {
                    setIsImageMenu(false);
                  } else {
                    setIsImageMenu(false);
                    setTimeout(() => {
                      handleImagePicker(opt);
                    }, 1000);
                  }
                }}
                style={[
                  styles.action_view,
                  {
                    backgroundColor: opt.name == "Cancel" ? "#FF5656" : "#fff",
                  },
                ]}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: Fonts.family.semiBold,
                    color: opt.name == "Cancel" ? "white" : "black",
                  }}
                >
                  {opt.name}
                </Text>
              </TouchableOpacity>
            ))}
        </SafeAreaView>
      </Modal>
      <CameraAllowModal
        isCameraAccess={isCameraAccess}
        setIsCameraAccess={setIsCameraAccess}
        setAllowCamera={setAllowCamera}
      />
      <EditPersonalDetail
        isEditModal={isEdit}
        setIsEditModal={setIsEdit}
        address={stripeData?.individual}
        setFirstName={setFirstName}
        setLastName={setLastName}
        birthdate={setBirthdate}
        setAddress1={setAddress1}
        setAddress2={setAddress2}
      />
      <SafeAreaView
        forceInset={{ bottom: "never" }}
        style={Utilities.safeAreaNotchHelper}
      />
    </>
  );
};
export default VerifyUserId;
