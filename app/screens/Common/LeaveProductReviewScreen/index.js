import React, { Fragment, useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  BackHandler,
  ImageBackground,
  Image,
  SafeAreaView,
  Keyboard,
} from "react-native";
import Header from "./components/header";
import Footer from "./components/footer";
import { SendReviewsImages } from "#services/apiChat";
import { paddings, flex, margins } from "#styles/utilities";
import { removePhotoFromList, setPhotoList } from "#modules/Sell/actions";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useActions, getMapObjectFromGoogleObj } from "#utils";
import {
  addProductReview,
  clearAddProductReview,
} from "#modules/ProductReview/actions";
import StarRating from "react-native-star-rating";
import {
  Label,
  SweetAlert,
  InputText,
  BodyText,
  Heading,
  Tag,
} from "#components";
import { Fonts, Colors } from "#themes";
import { selectUserData } from "#modules/User/selectors";
import { selectReviewsData } from "#modules/ProductReview/selectors";
import {
  getReviews,
  getNextReviews,
  getVerifiedPurchaseInfo,
} from "#modules/ProductReview/actions";
import { selectSellData } from "#modules/Sell/selectors";
import { CommonActions } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

const initialAlert = {
  title: "",
  message: "",
  type: "",
  visible: false,
};

const { height, width } = Dimensions.get("window");

const LeaveProductReviewScreen = ({ navigation, route }) => {
  const { reviews, verifiedPurchaseInfo } = useSelector(selectReviewsData());
  const { photosList } = useSelector(selectSellData());
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewResultAlert, setReviewResultAlert] = useState(initialAlert);
  const [experience, setExperience] = useState("");
  const [size, setSize] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [leaveImageReviewScreen, setLeaveImageReviewScreen] = useState(false);
  const [picsSelected, setPicsSelected] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [matchReview, setMatchReview] = useState([]);

  const dispatch = useDispatch();
  const productId = route?.params?.productId;
  const productDetail = route?.params?.productDetail;
  const orderId = route?.params?.orderId;
  const productItem = route?.params?.productItem;

  const actions = useActions({
    removePhotoFromList,
    setPhotoList,
  });

  const { information: userInfo } = useSelector(selectUserData());
  const { addProductReviewResult } = useSelector(selectReviewsData());

  useEffect(() => {
    if (reviews?.data.length > 0) {
      const checkId = reviews.data.filter(
        (item) => item.userId === userInfo.id
      );
      setMatchReview(checkId);
    }
  }, [userInfo, reviews.data]);

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

  const { reviewInfo } = productItem;
  let action;
  if (reviewInfo?.length > 0) {
    reviewInfo?.forEach((element) => {
      if (
        element?.type.includes("reviewToSeller") ||
        element?.type.includes("reviewToSupplier")
      ) {
        action = element.enabled;
      }
    });
  }

  useEffect(() => {
    const lastPhotos = [...picsSelected];
    if (photosList[0] == null) {
    } else {
      const newPics = [];
      photosList.map((item, index) => {
        newPics.push(`data:image/jpeg;base64,${item?.image}`);
      });
      setPicsSelected(newPics);
      sendImagesReviewApi(newPics);
    }
  }, [photosList]);

  const sendImagesReviewApi = async (lastPhotos) => {
    if (lastPhotos.length > 0) {
      const oldData = [...uploadedImages];
      for (var i = 0; i < lastPhotos.length; i++) {
        const reviewImageRes = await SendReviewsImages(
          lastPhotos[i],
          productId,
          userInfo.id
        );
        oldData.push(reviewImageRes.data);
      }
      setUploadedImages(oldData);
    } else {
    }
  };

  const fetchReviews = useCallback(
    (currentPage) => {
      dispatch(getReviews(productId, currentPage, 8));
    },
    [dispatch, productId]
  );

  useFocusEffect(
    useCallback(() => {
      fetchReviews(1);
    }, [fetchReviews])
  );

  const handleBackButtonClick = () => {
    if (leaveImageReviewScreen == true) {
      setLeaveImageReviewScreen(false);
    } else {
      dispatch(clearAddProductReview());
      navigation.goBack();
    }
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
  }, [leaveImageReviewScreen]);

  const handleAddReview = () => {
    if (
      productDetail?.Product?.customProperties?.category.name === "Fashion" ||
      productDetail?.Product?.customProperties?.category.name ===
        "Baby and child"
    ) {
      var size = "";
      if (experience == "Too Small") {
        size = "too_small";
      } else if (experience == "Just Right") {
        size = "just_right";
      } else if (experience == "Too Big") {
        size = "too_big";
      } else {
      }
      handleAddProductReview(size);
    } else {
      handleAddProductReview("");
    }
  };

  const handleAddProductReview = (size) => {
    if (leaveImageReviewScreen) {
      if (action) {
        navigation.navigate("LeaveReview", {
          orderId: productItem?.orderId,
          postId: productItem?.postId,
          sellerName: productDetail?.sellerName,
          reviewed: productItem?.buyerReviewed,
          sellerId: productItem?.sellerId,
          buyerId: productItem?.orderInfo?.buyerId,
          isFromProductReview: true,
          productReview: {
            productId,
            userId: userInfo.id,
            rating,
            reviewTitle,
            reviewComment,
            size,
            uploadedImages,
            orderId,
          },
        });
      } else {
        dispatch(
          addProductReview(
            productId,
            userInfo.id,
            rating,
            reviewTitle,
            reviewComment,
            size,
            uploadedImages,
            orderId
          )
        );
      }
    } else {
      setLeaveImageReviewScreen(true);
    }
  };

  const selectSize = () => {
    if (experience == "Too Small") {
      setSize("too_small");
    } else if (experience == "Just Right") {
      setSize("just_right");
    } else if (experience == "Too Big") {
      setSize("too_big");
    } else {
    }
  };

  const handleGoBack = () => {
    dispatch(clearAddProductReview());
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Dashboard" }],
      })
    );
  };

  useEffect(() => {
    if (addProductReviewResult.failure) {
      setReviewResultAlert({
        title: "Add Review Unsuccessful",
        message: addProductReviewResult.failure.content.message,
        type: "error",
        visible: true,
      });
      setPicsSelected([]);
      actions.setPhotoList([]);
    }
    if (addProductReviewResult.data) {
      setReviewResultAlert({
        title: "Review submitted!",
        message: "Thanks for leaving a review. It will be approved and posted.",
        type: "success",
        visible: true,
      });
      setPicsSelected([]);
      actions.setPhotoList([]);
    }
  }, [addProductReviewResult]);

  const handleAlertTouch = () => {
    setReviewResultAlert(initialAlert);
    handleGoBack();
  };

  console.log({ matchReview });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header handleGoBack={handleBackButtonClick} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {reviews.data.length < 1 ? (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "position" : undefined}
          >
            {/*Product detail section start*/}
            <View style={styles.topContainer}>
              <View style={styles.imgContainerWrapper}>
                <View style={styles.imgContainer}>
                  <Image
                    style={styles.imgElement}
                    source={{
                      uri: productDetail?.Product?.ProductImages[0]?.urlImage,
                    }}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <View style={styles.textContainer}>
                <Heading type="h6" numberLines={1}>
                  {productDetail?.title}
                </Heading>
              </View>
            </View>

            {leaveImageReviewScreen !== true ? (
              <>
                {/*Product detail section end*/}
                <View style={{ marginTop: 20 }}>
                  <Label bold size="medium" style={styles.title}>
                    Overall rating with this product
                  </Label>
                </View>

                <View
                  style={{ width: "50%", alignSelf: "center", marginTop: 10 }}
                >
                  <StarRating
                    starSize={22}
                    emptyStar="star"
                    emptyStarColor="#DADADA"
                    rating={rating}
                    fullStarColor="#00BDAA"
                    selectedStar={(starValue) => setRating(starValue)}
                    containerStyle={[styles.ratingTapContainer]}
                  />
                </View>
                {productDetail?.Product?.customProperties?.category?.name ==
                "Fashion" ? (
                  <View style={{ marginTop: 50 }}>
                    <Label size="medium" style={{ textAlign: "center" }}>
                      How was the sizing?
                    </Label>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        ...paddings["px-5"],
                        ...paddings["py-2"],
                        ...flex.directionRow,
                      }}
                      style={{ marginTop: 25 }}
                    >
                      {["Too Small", "Just Right", "Too Big"].map((e) => (
                        <Tag
                          key={e}
                          label={e}
                          active={experience === e}
                          onPress={() => {
                            setExperience(e);
                            //selectSize();
                          }}
                          style={margins["mb-0"]}
                        />
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  productDetail?.Product?.customProperties?.category.name ==
                    "Baby and child" && (
                    <View style={{ marginTop: 50 }}>
                      <Label size="medium" style={{ textAlign: "center" }}>
                        How was the sizing?
                      </Label>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                          ...paddings["px-5"],
                          ...paddings["py-2"],
                          ...flex.directionRow,
                        }}
                        style={{ marginTop: 25 }}
                      >
                        {["Too Small", "Just Right", "Too Big"].map((e) => (
                          <Tag
                            key={e}
                            label={e}
                            active={experience === e}
                            onPress={() => {
                              setExperience(e);
                              //selectSize();
                            }}
                            style={margins["mb-0"]}
                          />
                        ))}
                      </ScrollView>
                    </View>
                  )
                )}

                <View style={{ marginTop: 70 }}>
                  <InputText
                    placeholder="Feel free to elaborate..."
                    placeholderTextColor={Colors.black}
                    multiline
                    numberOfLines={2}
                    textAlign="center"
                    value={reviewComment}
                    onChangeText={(value) => setReviewComment(value)}
                    //autoFocus
                    maxLength={40}
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    returnKeyType="done"
                    style={{ fontSize: 15 }}
                    blurOnSubmit
                  />
                </View>
              </>
            ) : (
              <>
                <View style={{ marginTop: 40 }}>
                  <Label
                    bold
                    size="medium"
                    style={{
                      color: "#313334",
                      fontSize: 14,
                      textAlign: "center",
                      ...margins["mb-3"],
                    }}
                  >
                    Add a Photo to your Review
                  </Label>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate("SellPhotos")}
                >
                  <View style={styles.button}>
                    <Icon
                      style={{ marginRight: 20 }}
                      color="#00BDAA"
                      size={18}
                      name="camera"
                    />
                    <Text style={styles.button__text}>Add Photos</Text>
                  </View>
                </TouchableOpacity>

                {/*Images list*/}
                <View
                  style={{
                    width: "100%",
                    marginTop: 40,
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  <ScrollView
                    style={{ flex: 1 }}
                    horizontal={true}
                    contentContainerStyle={{ padding: 10 }}
                  >
                    {picsSelected?.map((item, i) => {
                      return (
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
                                  marginTop: -10,
                                  marginRight: -10,
                                  width: 25,
                                  height: 25,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  zIndex: 99,
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
                      );
                    })}
                  </ScrollView>
                </View>
              </>
            )}
          </KeyboardAvoidingView>
        ) : (
          <>
            {/*Product detail section start*/}
            <View style={styles.topContainer}>
              <View style={styles.imgContainerWrapper}>
                <View style={styles.imgContainer}>
                  <Image
                    style={styles.imgElement}
                    source={{
                      uri: productDetail?.Product?.ProductImages[0]?.urlImage,
                    }}
                    resizeMode="cover"
                  />
                </View>
              </View>
              <View style={styles.textContainer}>
                <Heading type="h6" numberLines={1}>
                  {productDetail?.title}
                </Heading>
              </View>
            </View>
            {leaveImageReviewScreen !== true ? (
              <>
                {/*Product detail section end*/}
                <View style={{ marginTop: 20 }}>
                  <Label bold size="medium" style={styles.title}>
                    Overall rating with this product
                  </Label>
                </View>

                <View
                  style={{ width: "50%", alignSelf: "center", marginTop: 10 }}
                >
                  <StarRating
                    starSize={22}
                    emptyStar="star"
                    emptyStarColor="#DADADA"
                    rating={rating}
                    fullStarColor="#00BDAA"
                    selectedStar={(starValue) => setRating(starValue)}
                    containerStyle={[styles.ratingTapContainer]}
                  />
                </View>
                {productDetail?.Product?.customProperties?.category?.name ==
                "Fashion" ? (
                  <View style={{ marginTop: 50 }}>
                    <Label size="medium" style={{ textAlign: "center" }}>
                      How was the sizing?
                    </Label>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        ...paddings["px-5"],
                        ...paddings["py-2"],
                        ...flex.directionRow,
                      }}
                      style={{ marginTop: 25 }}
                    >
                      {["Too Small", "Just Right", "Too Big"].map((e) => (
                        <Tag
                          key={e}
                          label={e}
                          active={experience === e}
                          onPress={() => {
                            setExperience(e);
                            //selectSize();
                          }}
                          style={margins["mb-0"]}
                        />
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  productDetail?.Product?.customProperties?.category.name ==
                    "Baby and child" && (
                    <View style={{ marginTop: 50 }}>
                      <Label size="medium" style={{ textAlign: "center" }}>
                        How was the sizing?
                      </Label>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                          ...paddings["px-5"],
                          ...paddings["py-2"],
                          ...flex.directionRow,
                        }}
                        style={{ marginTop: 25 }}
                      >
                        {["Too Small", "Just Right", "Too Big"].map((e) => (
                          <Tag
                            key={e}
                            label={e}
                            active={experience === e}
                            onPress={() => {
                              setExperience(e);
                              //selectSize();
                            }}
                            style={margins["mb-0"]}
                          />
                        ))}
                      </ScrollView>
                    </View>
                  )
                )}

                <View style={{ marginTop: 70 }}>
                  <InputText
                    placeholder="Feel free to elaborate..."
                    placeholderTextColor={Colors.black}
                    multiline
                    numberOfLines={2}
                    textAlign="center"
                    value={reviewComment}
                    onChangeText={(value) => setReviewComment(value)}
                    //autoFocus
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    maxLength={500}
                    returnKeyType="done"
                    style={{ fontSize: 15 }}
                    blurOnSubmit
                  />
                </View>
              </>
            ) : (
              <View style={{ flex: 1 }}>
                <View style={{ marginTop: 40 }}>
                  <Label
                    bold
                    size="medium"
                    style={{
                      color: "#313334",
                      fontSize: 14,
                      textAlign: "center",
                      ...margins["mb-3"],
                    }}
                  >
                    Add a Photo to your Review
                  </Label>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate("SellPhotos")}
                >
                  <View style={styles.button}>
                    <Icon
                      style={{ marginRight: 20 }}
                      color="#00BDAA"
                      size={18}
                      name="camera"
                    />
                    <Text style={styles.button__text}>Add Photos</Text>
                  </View>
                </TouchableOpacity>

                {/*Images list*/}
                <View
                  style={{
                    width: "100%",
                    marginTop: 40,
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  <ScrollView
                    style={{ flex: 1 }}
                    horizontal={true}
                    contentContainerStyle={{ padding: 10 }}
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
                                width: 25,
                                height: 25,
                                marginTop: -10,
                                marginRight: -10,
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 99,
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
              </View>
            )}
          </>
        )}
      </ScrollView>
      <Footer
        handleSubmit={handleAddReview}
        isFetching={addProductReviewResult.isFetching}
        disabled={rating < 1 ? true : reviewComment == "" ? true : false}
        action={!leaveImageReviewScreen ? !leaveImageReviewScreen : action}
      />
      <SweetAlert
        title={reviewResultAlert.title}
        message={reviewResultAlert.message}
        type={reviewResultAlert.type}
        dialogVisible={reviewResultAlert.visible}
        onTouchOutside={handleAlertTouch}
        onDone={handleAlertTouch}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    backgroundColor: "white",
    borderRadius: 8,
    margin: 1,
    ...margins["mb-3"],
  },
  ratingTapContainer: {},
  label: {
    textAlign: "center",
  },
  title: {
    fontSize: 14,
    textAlign: "center",
    ...margins["mb-3"],
  },
  inputTextContainer: {
    borderBottomWidth: 1,
    borderColor: "#DADADA",
    alignItems: "center",
    ...margins["mb-3"],
  },
  inputText: {
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.medium,
    color: "#969696",
    borderBottomWidth: 1,
    borderColor: "#DADADA",
    textAlign: "center",
  },
  comment: {
    textAlignVertical: "center",
    justifyContent: "center",
  },
  topContainer: {
    height: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
  },
  imgContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 1,
  },
  imgElement: {
    width: 60,
    height: 60,
  },
  textContainer: {
    flexDirection: "column",
    maxWidth: width - 30 - 75,
  },
  titleTextProduct: {
    fontFamily: "Montserrat-Medium",
    fontWeight: "500",
    fontSize: 12,
    color: "#696969",
  },
  imgContainerWrapper: {
    paddingRight: 15,
  },
  button: {
    paddingHorizontal: 16,
    width: 240,
    alignSelf: "center",
    flexDirection: "row",
    height: 48,
    borderWidth: 1,
    borderColor: "#00BDAA",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  button__text: {
    ...Fonts.style.buttonText,
    fontFamily: Fonts.family.semiBold,
    color: "#313334",
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },
  headerText: {
    textAlign: "center",
    marginTop: 50,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.medium,
    color: "#313334",
  },
});

export default LeaveProductReviewScreen;
