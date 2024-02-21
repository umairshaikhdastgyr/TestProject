import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
  Share,
} from "react-native";

import {
  Currency,
  CollapsibleText,
  Icon,
  Heading,
  Label,
  StarsRate,
} from "#components";

import { Colors, Fonts } from "#themes";

import { flex, margins, paddings, position } from "#styles/utilities";

import { getProductShareLink, parseDateToTimeAgo, useActions } from "#utils";

import { selectUserData } from "#modules/User/selectors";
import { selectReviewsData } from "#modules/ProductReview/selectors";
import { deleteIdeaGlobally } from "#modules/Ideas/actions";
import CustomPropertiesItem from "./custom-properties-item";
import Geolocation from "react-native-geolocation-service";

import QuantityModalSelector from "../QuantityModalSelector";
import { parseDeliveryMethods } from "../../helper-functions";
import colors from "#themes/colors";
import useCheckNetworkInfo from "../../../../hooks/useCheckNetworkInfo";
import { MainAuthStackNavigation } from "../../../../navigators/MainAuthStackNavigation";
import { QuantityLoader } from "#components/SkeletonPlaceholderLoader";

const ItemDetails = ({
  navigation,
  isVisibleFavoriteModal,
  setIsVisibleFavoriteModal,
  latLng,
  pDetail,
  postDetail,
  readOnly,
  screenType,
  formData,
  isSupplier,
  isSupplierx,
  availableQuantity,
  quantity,
  setQuantity,
  proStatus,
  updateFavIconStatus = () => {},
  prodStatus,
  isFavorited,
  showModal,
  toggleModal,
  isFromDashboard,
  isBuy,
  isFetchingPostDetail,
  isAvailableForSell,
}) => {
  /* Selectors */
  const { information: userInfo } = useSelector(selectUserData());
  const { reviewTotal } = useSelector(selectReviewsData());

  const { internetAvailable } = useCheckNetworkInfo();

  /* Actions */
  const actions = useActions({ deleteIdeaGlobally });

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [_distance, SetDistance] = useState(0);
  const [conType, setConType] = useState(undefined);
  const [loader, setLoader] = useState(false);

  const [itemDetailMap, setitemDetailMap] = useState([]);

  const additionalSellers = postDetail.additionalPosts;

  useEffect(() => {
    if (internetAvailable === true) {
      if (!conType) {
        setConType(true);
      }
    } else if (internetAvailable === false) {
      setConType(false);
    }
  }, [internetAvailable]);

  useEffect(() => {
    setLoader(false);
  }, [isFavorited, isVisibleFavoriteModal]);

  const isVehicle =
    formData?.listingType?.name === "Vehicle" ||
    postDetail?.Product?.customProperties?.listingType?.name === "Vehicle";

  const renderItemDetailsMap = () => {
    if (
      !isSupplier &&
      !isVehicle &&
      postDetail.id != undefined &&
      !itemDetailMap.length
    ) {
      let itemDetailMap = parseDeliveryMethods({ postDetail, latLng });
      const { DeliveryMethods } = postDetail;

      const inPersonPickUp = DeliveryMethods?.find(
        (delivery) => delivery.code === "pickup"
      );
      if (inPersonPickUp) {
        let latLngNew = postDetail?.location?.geometry?.location || latLng;
        Geolocation.getCurrentPosition(
          (data) => {
            try {
              if (data) {
                const lat1 = latLngNew?.lat;
                const lon1 = latLngNew?.lng;
                const lat2 = data.coords.latitude;
                const lon2 = data.coords.longitude;
                if (lat1 === lat2 && lon1 === lon2) {
                  itemDetailMap.push({
                    icon: "in-person",
                    label: inPersonPickUp.name.toUpperCase(),
                    complementLabel: `0 MI AWAY`,
                  });
                } else {
                  var radlat1 = (Math.PI * lat1) / 180;
                  var radlat2 = (Math.PI * lat2) / 180;
                  var theta = lon1 - lon2;
                  var radtheta = (Math.PI * theta) / 180;

                  var dist =
                    Math.sin(radlat1) * Math.sin(radlat2) +
                    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist > 1) {
                    dist = 1;
                  }
                  dist = Math.acos(dist);
                  dist = (dist * 180) / Math.PI;
                  dist = dist * 60 * 1.1515;
                  dist = dist * 0.8684;
                  let complementLabel = `${Math.round(dist)}MI AWAY`;

                  itemDetailMap.push({
                    icon: "in-person",
                    label: inPersonPickUp.name.toUpperCase(),
                    complementLabel,
                  });
                  setitemDetailMap(itemDetailMap);
                }
              }
            } catch (e) {
              console.log("error", e);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }

      itemDetailMap.length && setitemDetailMap(itemDetailMap);
    }
  };

  useEffect(() => {
    const payments = [];
    if (postDetail?.PaymentMethods && postDetail.PaymentMethods.length > 0) {
      for (let i = 0; i < postDetail.PaymentMethods.length; i++) {
        if (
          !postDetail.PaymentMethods[i].customProperties ||
          (postDetail.PaymentMethods[i].customProperties &&
            Object.keys(postDetail.PaymentMethods[i].customProperties)
              .length === 0)
        ) {
          payments.push(postDetail.PaymentMethods[i]);
        } else {
          for (let j = 0; j < postDetail?.DeliveryMethods?.length; j++) {
            if (
              parseInt(postDetail.initialPrice, 10) >=
                postDetail.PaymentMethods[i].customProperties[
                  postDetail.DeliveryMethods[j].code
                ].rangeAvailable[0] &&
              parseInt(postDetail.initialPrice, 10) <=
                postDetail.PaymentMethods[i].customProperties[
                  postDetail.DeliveryMethods[j].code
                ].rangeAvailable[1]
            ) {
              payments.push(postDetail.PaymentMethods[i]);
              break;
            }
          }
        }
      }
    }

    setPaymentMethods(payments);
    renderItemDetailsMap();
  }, [postDetail]);

  /* Methods */
  const parsePaymentIcon = (payment) => {
    switch (payment?.code) {
      case "inapp":
        return "mobile";
      case "payinperson":
        return "credit-card";
      default:
        return "in-person";
    }
  };

  const parseConditionIcon = (condition) => {
    switch (condition?.name) {
      case "Excellent":
      case "New":
      case "Like new":
        return "excellent";
      case "Average":
      case "Moderate":
      case "Used":
        return "moderate";
      case "Poor":
        return "poor";
      default:
        return "moderate";
    }
  };
  const openShareItemOptions = async () => {
    try {
      if (!readOnly || (readOnly && readOnly === false)) {
        let message = `Checkout this ${postDetail.Product.title} for $${
          postDetail?.initialPrice
        }  I found on Homitag.  ${
          postDetail?.description
            ? postDetail?.description
            : postDetail?.Product?.description || ""
        }`;
        const link = await getProductShareLink(
          `?postId=${postDetail.id}`,
          `${postDetail?.Product?.ProductImages?.[0]?.urlImage}`,
          `Checkout this ${postDetail.Product.title}`,
          message
        );

        message = `${message} \n ${link}`;

        const shareOptions = {
          title: "Share Item",
          message,
        };
        await Share.share(shareOptions);
      }
    } catch (error) {
      console.log("openShareItemOptions==== ", error);
    }
  };

  const handleDeleteFromFavorites = async () => {
    try {
      setLoader(true);
      await actions.deleteIdeaGlobally({
        postId: postDetail.id,
        userId: userInfo.id,
      });
      updateFavIconStatus(false);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  const renderVehicleInfo = () => {
    const { customProperties, Category } = postDetail?.Product ?? formData;

    if (conType) {
      Geolocation.getCurrentPosition(
        (data) => {
          if (postDetail?.location?.geometry?.location) {
            const lat1 = postDetail?.location?.geometry?.location?.lat;
            const lon1 = postDetail?.location?.geometry?.location?.lng;
            const lat2 = data?.coords?.latitude;
            const lon2 = data?.coords?.longitude;

            if (lat1 === lat2 && lon1 === lon2) {
              return 0;
            } else {
              var radlat1 = (Math.PI * lat1) / 180;
              var radlat2 = (Math.PI * lat2) / 180;
              var theta = lon1 - lon2;
              var radtheta = (Math.PI * theta) / 180;
              var dist =
                Math.sin(radlat1) * Math.sin(radlat2) +
                Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
              if (dist > 1) {
                dist = 1;
              }
              dist = Math.acos(dist);
              dist = (dist * 180) / Math.PI;
              dist = dist * 60 * 1.1515;
              dist = dist * 0.8684;
              SetDistance(dist.toFixed(2));
              return dist;
            }
          }
        },
        (error) => {}
      );
    }
    const info = [];
    if (customProperties.year) {
      info.push(customProperties.year.value);
    }
    if (customProperties.make) {
      info.push(customProperties.make?.name?.toUpperCase());
    }
    if (customProperties.model) {
      if (
        customProperties &&
        customProperties.model &&
        customProperties.model &&
        customProperties.model.name
      ) {
        info.push(customProperties.model.name.toUpperCase());
      }
    }
    let properties_length = Object.keys(customProperties).length;
    const vehicleDeliveryMethod =
      formData?.DeliveryMethods?.find((method) => method.code === "pickup") ??
      postDetail?.DeliveryMethods?.find((method) => method.code === "pickup");

    if (properties_length > 6) {
      let sortedArray = [];
      Object.entries(customProperties)
        .map((e) => ({ [e[0]]: e[1] }))
        .map((item) => {
          if (item.make) {
            item.make.icon = "model_icon";
            sortedArray[0] = item;
          }
          if (item.model) {
            item.model.icon = "model_icon";
            sortedArray[1] = item;
          }
          if (item.year) {
            item.year.icon = "year_icon";
            sortedArray[2] = item;
          }
          if (item.mileage) {
            item.mileage.icon = "mileage_icon";
            sortedArray[3] = item;
          }
          if (item["body type"]) {
            item["body type"].icon = "vehicle_type";
            sortedArray[4] = item;
          }
          if (item["fuel type"]) {
            item["fuel type"].icon = item["fuel type"].icon;
            sortedArray[5] = item;
          }
          if (item.transmission) {
            item.transmission.icon = item.transmission.icon;
            sortedArray[6] = item;
          }
          if (item["number of seats"]) {
            item["number of seats"].icon = "seats_icon";
            sortedArray[7] = item;
          }
          if (item["drive train"]) {
            item["drive train"].icon = "drive_icon";
            sortedArray[8] = item;
          }
          if (item.color) {
            item.color.icon = "seats_icon";
            sortedArray[9] = item;
          }
          if (item["VIN Number"]?.isValid) {
            item["VIN Number"].icon = "vin_icon";
            sortedArray[10] = item;
          }
        });

      return (
        <>
          <View style={styles["mainInfoSection__item-tag"]}>
            <Icon
              icon={parseConditionIcon(postDetail.ItemCondition)}
              style={styles["item-tag__icon"]}
            />
            <View style={styles.mainInfoSection__tag}>
              <Label>CONDITION - </Label>
              {postDetail?.ItemCondition == null ? (
                <Label bold type="active">
                  {"NEW"}
                </Label>
              ) : (
                <Label bold type="active">
                  {postDetail?.ItemCondition?.name?.toUpperCase()}
                </Label>
              )}
            </View>
          </View>
          <View
            key={vehicleDeliveryMethod?.name}
            style={styles["mainInfoSection__item-tag"]}
          >
            <Icon
              icon={parsePaymentIcon(vehicleDeliveryMethod?.code)}
              style={styles["item-tag__icon"]}
            />
            <View style={styles.mainInfoSection__tag}>
              <Label>{`${vehicleDeliveryMethod?.name?.toUpperCase()} ${
                screenType === "preview" ? "" : "-"
              }`}</Label>
              {screenType !== "preview" ? (
                <Label bold type="active">
                  {" "}
                  {_distance}
                  {"MI AWAY"}
                </Label>
              ) : null}
            </View>
          </View>
          <FlatList
            data={sortedArray.filter(Boolean)}
            numColumns={3}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }, index) => (
              <CustomPropertiesItem key={index} item={item} />
            )}
          />
        </>
      );
    } else {
      return (
        <>
          <View style={styles["mainInfoSection__item-tag"]}>
            <Icon
              icon={`vehicle_category_${
                Category?.name?.toLowerCase() ??
                formData?.subCategory?.name?.toLowerCase() ??
                "cars"
              }`}
              style={styles["item-tag__icon"]}
            />
            <Label>{info.join(", ")}</Label>
          </View>
          {customProperties["body type"] && (
            <View style={styles["mainInfoSection__item-tag"]}>
              <Icon icon="vehicle_type" style={styles["item-tag__icon"]} />
              <Label>TYPE - </Label>
              <Label>{customProperties["body type"].name.toUpperCase()}</Label>
            </View>
          )}
          <View style={styles["mainInfoSection__item-tag"]}>
            <Icon
              icon={parseConditionIcon(postDetail?.ItemCondition)}
              style={styles["item-tag__icon"]}
            />
            <View style={styles.mainInfoSection__tag}>
              <Label>CONDITION - </Label>
              {postDetail?.ItemCondition == null ? (
                <Label bold type="active">
                  {"NEW"}
                </Label>
              ) : (
                <Label bold type="active">
                  {postDetail?.ItemCondition?.name?.toUpperCase()}
                </Label>
              )}
            </View>
          </View>
          <View
            key={vehicleDeliveryMethod?.name}
            style={styles["mainInfoSection__item-tag"]}
          >
            <Icon
              icon={parsePaymentIcon(vehicleDeliveryMethod?.code)}
              style={styles["item-tag__icon"]}
            />
            <View style={styles.mainInfoSection__tag}>
              <Label>{`${vehicleDeliveryMethod?.name?.toUpperCase()} ${
                screenType === "preview" ? "" : "-"
              }`}</Label>
              {screenType !== "preview" && (
                <Label bold type="active">
                  {" "}
                  {_distance}
                  {"MI AWAY"}
                </Label>
              )}
            </View>
          </View>
          {customProperties.mileage && (
            <View style={styles["mainInfoSection__item-tag"]}>
              <Icon icon="mileage" style={styles["item-tag__icon"]} />
              <View style={styles.mainInfoSection__tag}>
                <Label>MILEAGE - </Label>
                <Label bold type="active">
                  {customProperties.mileage.value} MI
                </Label>
              </View>
            </View>
          )}
          {customProperties.color && (
            <View style={styles["mainInfoSection__item-tag"]}>
              <View
                style={[
                  {
                    height: 24,
                    width: 24,
                    marginRight: 8,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "gray",
                    backgroundColor: `#${customProperties?.color?.value}`,
                  },
                ]}
              />
              <View style={styles.mainInfoSection__tag}>
                <Label>COLOR - </Label>
                <Label bold type="active">
                  {customProperties.color.name.toUpperCase()}
                </Label>
              </View>
            </View>
          )}
        </>
      );
    }
  };

  return (
    <>
      {Object.keys(postDetail).length > 0 ? (
        <View style={[paddings["py-5"], paddings["px-3"], paddings["pb-4"]]}>
          <View
            style={[
              flex.directionRow,
              flex.justifyContentSpace,
              margins["mb-2"],
              position.relative,
            ]}
          >
            <Heading
              type="h6"
              style={[flex.grow1, { color: colors.black, marginBottom: 5 }]}
            >
              {postDetail?.title
                ? postDetail?.title
                : postDetail?.Product?.title
                ? postDetail?.Product?.title
                : ""}
            </Heading>
            {screenType !== "preview" ? (
              <View
                style={[
                  flex.directionRow,
                  { position: "absolute", top: -80, right: 0, zIndex: 10 },
                ]}
              >
                <TouchableOpacity onPress={openShareItemOptions}>
                  <Icon size="medium-small" icon="share-white-border" />
                </TouchableOpacity>
                {userInfo.id !== postDetail.userId ? (
                  <TouchableOpacity
                    style={[margins["ml-3"]]}
                    disabled={loader ? true : false}
                    onPress={() => {
                      if (!readOnly || (readOnly && readOnly === false)) {
                        if (userInfo.id) {
                          if (!isFavorited) {
                            if (setIsVisibleFavoriteModal) {
                              setIsVisibleFavoriteModal(true);
                              setLoader(true);
                            }
                          } else {
                            handleDeleteFromFavorites();
                          }
                        } else {
                          MainAuthStackNavigation(navigation);
                        }
                      }
                    }}
                  >
                    {loader ? (
                      <ActivityIndicator size={"small"} color={Colors.active} />
                    ) : isFavorited ? (
                      <Icon
                        size="medium-small"
                        icon="like-white-border"
                        color="active"
                      />
                    ) : (
                      <Icon size="medium-small" icon="like-white-border" />
                    )}
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
          </View>
          {isSupplierx && reviewTotal.data.total > 0 ? (
            <TouchableOpacity
              style={[
                margins["mb-3"],
                flex.directionRow,
                flex.alignItemsCenter,
              ]}
              onPress={() =>
                navigation.navigate("ProductReviews", {
                  productId: postDetail?.productId,
                  productDetail: postDetail,
                  prodStatus,
                })
              }
            >
              <StarsRate value={parseInt(reviewTotal.data.avg, 10)} />
              <Text
                style={styles.reviewTotalCount}
              >{`(${reviewTotal.data.total})`}</Text>
            </TouchableOpacity>
          ) : null}
          <View
            style={[
              margins["mb-3"],
              flex.directionRow,
              flex.justifyContentSpace,
              flex.alignItemsCenter,
            ]}
          >
            {postDetail?.userId != userInfo.id && isFromDashboard && isBuy ? (
              <Currency value={postDetail?.initialPrice} size="x-large" />
            ) : postDetail?.userId == userInfo.id &&
              isFromDashboard &&
              isBuy ? (
              <Currency value={postDetail?.initialPrice} size="x-large" />
            ) : isFromDashboard &&
              postDetail?.PostStatus?.name != "inActive" ? (
              <Currency value={postDetail?.initialPrice} size="x-large" />
            ) : availableQuantity <= 0 ||
              (postDetail?.PostStatus?.name &&
                postDetail?.PostStatus?.name != "Active" &&
                postDetail?.PostStatus?.name != "Draft") ? (
              <View style={[margins["mb-1"], flex.justifyContentCenter]}>
                <Label bold size="large" type="active">
                  Item Unavailable
                </Label>
              </View>
            ) : (
              <Currency value={postDetail?.initialPrice} size="x-large" />
            )}
            {isFetchingPostDetail ? (
              <QuantityLoader />
            ) : (
              <>
                {isSupplier &&
                isAvailableForSell &&
                (postDetail?.PostStatus?.name == "Active" ||
                  additionalSellers?.filter((i) => i.sellerStatus == "active")
                    .length > 0) ? (
                  <QuantityModalSelector
                    availableQuantity={availableQuantity}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    showModal={showModal}
                    toggleModal={toggleModal}
                  />
                ) : null}
              </>
            )}
          </View>
          <View style={margins["mb-3"]}>
            <View style={flex.directionRowWrap}>
              {postDetail?.Product?.Category?.name && (
                <Label bold type="link">
                  {postDetail?.Product?.Category?.name?.toUpperCase()}
                </Label>
              )}
              <Label>
                {" "}
                - POSTED {parseDateToTimeAgo(postDetail?.createdAt)} AGO
              </Label>
            </View>
          </View>

          <CollapsibleText
            collapseNumberOfLines={5}
            text={
              postDetail?.description
                ? postDetail?.description
                : postDetail?.Product?.description
            }
          />
          {/* <BodyText style={margins['mb-4']}>{postDetail.description}</BodyText> */}

          <View
            style={[
              flex.directionRow,
              flex.justifyContentSpace,
              flex.alignItemsCenter,
              margins["mb-4"],
              margins["mt-2"],
            ]}
          >
            <Heading type="bodyText">
              {isVehicle ? "Vehicle Details" : "Item Details"}
            </Heading>
            {isSupplier && (
              <View style={[flex.directionRow, flex.alignItemsCenter]}>
                <Icon icon="pin-validate" />
                <Text
                  style={{
                    fontFamily: Fonts.family.regular,
                    fontSize: Fonts.size.small,
                    color: colors.active,
                    textTransform: "uppercase",
                    textDecorationLine: "underline",
                  }}
                >
                  Approved Supplier
                </Text>
              </View>
            )}
          </View>

          {isVehicle ? (
            renderVehicleInfo()
          ) : (
            <>
              {paymentMethods.map(
                (payment) =>
                  payment.name.toUpperCase() !== "PAY IN PERSON" && (
                    <View
                      key={payment.name}
                      style={styles["mainInfoSection__item-tag"]}
                    >
                      <Icon
                        icon={parsePaymentIcon(payment)}
                        style={styles["item-tag__icon"]}
                      />
                      <View style={styles.mainInfoSection__tag}>
                        <Label>{payment.name.toUpperCase()} - </Label>
                        <Label bold type="active">
                          ELEGIBLE
                        </Label>
                      </View>
                    </View>
                  )
              )}
              <View style={styles["mainInfoSection__item-tag"]}>
                <Icon
                  icon={parseConditionIcon(postDetail?.ItemCondition)}
                  style={styles["item-tag__icon"]}
                />
                <View style={styles.mainInfoSection__tag}>
                  <Label>CONDITION - </Label>
                  {postDetail?.ItemCondition == null ? (
                    <Label bold type="active">
                      {"NEW"}
                    </Label>
                  ) : (
                    <Label bold type="active">
                      {postDetail?.ItemCondition?.name?.toUpperCase()}
                    </Label>
                  )}
                </View>
              </View>
              {!isSupplier && itemDetailMap
                ? itemDetailMap?.map((delivery, index) => {
                    if (
                      postDetail?.PostStatus?.name != "Active" &&
                      postDetail?.PostStatus?.name !== "Draft" &&
                      postDetail?.userId != userInfo.id &&
                      !isFromDashboard &&
                      !isBuy
                    ) {
                      return null;
                    }
                    return (
                      <View
                        key={index}
                        style={styles["mainInfoSection__item-tag"]}
                      >
                        <Icon
                          icon={delivery.icon}
                          style={styles["item-tag__icon"]}
                        />
                        <View style={styles.mainInfoSection__tag}>
                          <Label>
                            {delivery.label}{" "}
                            {delivery.complementLabel ? "- " : ""}
                          </Label>
                          <Label bold type="active">
                            {delivery.complementLabel}
                          </Label>
                        </View>
                      </View>
                    );
                  })
                : null}
              {postDetail?.productId &&
              postDetail?.PostStatus?.name != "Draft" ? (
                <View style={styles["mainInfoSection__item-tag"]}>
                  <Icon
                    icon="dashed-rectangle"
                    style={styles["item-tag__icon"]}
                  />
                  <View style={styles.mainInfoSection__tag}>
                    <Label>PRODUCT ID - </Label>
                    <Label bold type="active">
                      {postDetail?.productId}
                    </Label>
                  </View>
                </View>
              ) : null}
            </>
          )}
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  mainInfoSection__tag: {
    flexDirection: "row",
  },
  containerPhotoLibrary: {
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  "mainInfoSection__item-tag": {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  "item-tag__icon": {
    marginRight: 14,
    resizeMode: "contain",
    marginLeft: -5,
  },
  reviewTotalCount: {
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.small,
    marginLeft: 3,
    textTransform: "uppercase",
    color: "#969696",
    textAlign: "center",
    textAlignVertical: "center",
  },
});

export default ItemDetails;
