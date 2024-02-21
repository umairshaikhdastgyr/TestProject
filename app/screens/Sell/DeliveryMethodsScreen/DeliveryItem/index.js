import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Text,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
  SafeAreaView,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { CheckBox, CurrencyInput, BodyText, Icon, Link } from "#components";
import DeliveryItemPackage from "./DeliveryItemPackage";
import DeliveryCarrier from "./DeliveryCarrier";

import { getShipRate } from "#modules/Sell/actions";
import Ionicons from "react-native-vector-icons/Ionicons";
import { selectSellData } from "#modules/Sell/selectors";

import { Colors } from "#themes";
import styles from "./styles";
import colors from "#themes/colors";
import fonts from "#themes/fonts";
import { currencyFormatter } from "#utils";
import RenderHtml from "react-native-render-html";
import { getContent } from "#modules/General/actions";
import { generalSelector } from "#modules/General/selectors";
import { useIsFocused } from "@react-navigation/native";

const DeliveryItem = ({
  itemData,
  formData,
  setDeliveryFormData,
  updateDeliveryFormData,
  deliveryMethodsCount,
  sendAlert,
  errTotalPriceErr,
  setErrTotalPriceErr,
  errHomiLabel,
  setErrHomiLabel,
  getMinimumShippingRate,
  packageProperties,
  setPackageProperties,
  packagePropertiesError,
  handlePackagePropertiesOnChange,
  handlePackagePropertiesOnBlur,
}) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { width, height } = useWindowDimensions();
  const { shippingRate, minShippingRate } = useSelector(selectSellData());

  const [localData, setLocalData] = useState({});
  const [localAvailable, setLocalAvailable] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [carrierProviders, setCarrierProviders] = useState([]);
  const [minimiumPriceError, setMinimiumPriceError] = useState("");
  const [shippingPolicyModal, setShippingPolicyModal] = useState(false);

  const carrierProvidersExist = carrierProviders.length > 0;

  const { general } = useSelector(generalSelector);

  console.log(carrierProviders);
  console.log(shippingRate);

  useEffect(() => {
    dispatch(
      getContent({ params: `?type=shipping_public_policy`, type: "terms" })
    );
  }, []);
  useEffect(() => {
    const callAPI = () => {
      if (packageProperties?._meta?.isCompleted) {
        const { pounds, ounces, length, width, height } = packageProperties;
        const { city, country, postalCode, state, formattedAddress } =
          formData.location;

        const Pounds = Number(pounds);
        const Ounces = Number(ounces);
        const Weight = Pounds + Ounces / 16;
        const Length = Number(length);
        const Width = Number(width);
        const Height = Number(height);

        if (
          pounds === "" ||
          ounces === "" ||
          Weight <= 0 ||
          Length <= 0 ||
          Width <= 0 ||
          Height <= 0
        ) {
          // setCarrierProviders([]);
          setPackageProperties((prevState) => ({
            ...prevState,
            _meta: {
              isCompleted: false,
              isModified: true,
            },
          }));
          return;
        }

        setLocalData({
          ...localData,
          deliveryCustomProperties: {
            ...localData.deliveryCustomProperties,
            optionsAvailable: [],
          },
        });

        dispatch(
          getShipRate({
            params: {
              seller: {
                AddressLine: formattedAddress?.split(",")[0],
                AddressCity: city,
                AddressState: state,
                AddressZIP: postalCode,
                AddressCountry: country,
              },
              package: {
                Weight: Weight.toString(),
                Length: Length.toString(),
                Width: Width.toString(),
                Height: Height.toString(),
              },
            },
            provider: "all",
          })
        );
      }
    };
    callAPI();
  }, [dispatch, formData.location, packageProperties]);

  useEffect(() => {
    /**
     * @description Check shipping rate from previous API call and set state object
     * @return Null
     */
    const verifyShippingRate = () => {
      if (shippingRate?.data?.rates?.length > 0) {
        const homitagshipping = formData?.deliveryMethodsSelected?.find(
          (deliveryMethodSelected) =>
            deliveryMethodSelected.code === "homitagshipping"
        );
        const selectedProvider =
          homitagshipping?.deliveryCustomProperties?.optionsAvailable
            ?.find((option) => option.selected === true)
            ?.providers?.find((prov) => prov.selected === true);
        setErrHomiLabel(null);
        setCarrierProviders(
          shippingRate.data.rates.map((rate) => {
            if (rate.provider === selectedProvider?.provider) {
              return { ...rate, selected: true };
            } else {
              return { ...rate, selected: false };
            }
          })
        );
        return;
      }
      setCarrierProviders([]);
    };
    verifyShippingRate();
  }, [setErrHomiLabel, shippingRate]);

  useEffect(() => {
    const verifyPrevShippingRate = () => {
      const { pounds, ounces, length, width, height } = packageProperties;

      const packagePropertiesCompleted = Boolean(
        pounds && ounces && length && width && height
      );

      if (
        packagePropertiesCompleted &&
        shippingRate?.data?.rates?.length === 0
      ) {
        setErrHomiLabel(
          'No options available for your entered dimensions and weight. Please choose "Ship Independently" delivery method.'
        );
        return;
      }
    };
    verifyPrevShippingRate();
  }, [packageProperties, shippingRate]);

  useEffect(() => {
    const deliveryMethodsSelected = formData?.deliveryMethodsSelected?.find(
      (item) => item.id === itemData.id
    );

    if (formData.price < 3) {
      if (itemData.code === "pickup") {
        setLocalData(itemData);
        setDeliveryFormData(itemData);
      }
      return;
    }
    if (deliveryMethodsSelected) {
      validateShippingRateHomitag({ deliveryData: deliveryMethodsSelected });
      if (
        itemData.code !== "pickup" &&
        itemData.deliveryCustomProperties &&
        itemData.deliveryCustomProperties.rangeAvailable
      ) {
        const price = Number(formData.price);
        if (
          price >= itemData.deliveryCustomProperties.rangeAvailable[0] &&
          price <= itemData.deliveryCustomProperties.rangeAvailable[1]
        ) {
          setLocalData(
            formData?.deliveryMethodsSelected?.find(
              (item) => item.id === itemData.id
            )
          );
          return;
        }
        setDeliveryFormData(itemData);
        setLocalData(itemData);
        return;
      }
      setLocalData(
        formData?.deliveryMethodsSelected?.find(
          (item) => item.id === itemData.id
        )
      );
      return;
    }
    setLocalData(itemData);
  }, []);

  const checkMinShippingRate = ({ shippingCost }) => {
    getMinimumShippingRate({ shippingCost });
  };

  useEffect(() => {
    if (
      Object.keys(localData).length > 0 &&
      formData?.deliveryMethodsSelected?.find(
        (element) => element.id === itemData.id
      )
    ) {
      updateDeliveryFormData(localData);
    }
    if (
      Object.keys(localData).length > 0 &&
      localData.deliveryCustomProperties &&
      localData.deliveryCustomProperties.shippingCost &&
      parseFloat(localData.deliveryCustomProperties.shippingCost) +
        parseFloat(formData.price) >
        1500
    ) {
      setErrTotalPriceErr(
        `Price + Shipping Cost ( $${parseFloat(formData.price).toFixed(
          2
        )} + $${parseFloat(
          localData.deliveryCustomProperties.shippingCost
        ).toFixed(2)} ) should be less than or equal to $1500.00`
      );
    } else {
      // setErrTotalPriceErr(null);
    }
  }, [localData]);

  const validateShippingRateHomitag = ({ deliveryData, freeOptionVal }) => {
    if (deliveryData.code === "homitagshipping") {
      //verify data
      if (
        deliveryData?.deliveryCustomProperties?.optionsAvailable?.find(
          (ele) => ele.selected === true
        )
      ) {
        // must select at least one provider
        const prov =
          deliveryData?.deliveryCustomProperties?.optionsAvailable?.find(
            (ele) => ele.selected === true
          );
        if (prov?.providers?.find((ele) => ele.selected === true)) {
          const selProv = prov?.providers?.find((ele) => ele.selected === true);
          if (freeOptionVal === true) {
            checkMinShippingRate({ shippingCost: selProv.cost });
          }
        }
      }
    }
  };

  useEffect(() => {
    if (itemData.code === "pickup") {
      setLocalAvailable(true);
      return;
    }
    // check price range
    const price = Number(formData.price);

    if (
      price >= itemData.deliveryCustomProperties.rangeAvailable[0] &&
      price <= itemData.deliveryCustomProperties.rangeAvailable[1]
    ) {
      if (
        formData.deliveryMethodsSelected
          .filter((element) => element.code !== "pickup")
          .filter((element) => element.id !== itemData.id).length > 0
      ) {
        setLocalAvailable(false);
        return;
      }
      setLocalAvailable(true);
      return;
    }
    setLocalAvailable(false);
  }, [formData]);

  const setShipData = (shippingPrice) => {
    if (
      shippingPrice &&
      parseFloat(shippingPrice) + parseFloat(formData.price) > 1500
    ) {
      setErrTotalPriceErr(
        `Price + Shipping Cost ( $${parseFloat(formData.price).toFixed(
          2
        )} + $${parseFloat(shippingPrice).toFixed(
          2
        )} ) should be less than or equal to $1500.00`
      );
    } else {
      // setErrTotalPriceErr(null);
    }
    setLocalData({
      ...localData,
      deliveryCustomProperties: {
        ...localData.deliveryCustomProperties,
        shippingCost: shippingPrice !== "" ? shippingPrice : 0,
      },
    });
  };

  const moneyChecker = (value1) => {
    const value = value1.replace(",", ".");
    if (value1 !== "") {
      if (value1.length < 8) {
        if (Number(value)) {
          if (value.split(".").length > 1) {
            if (value[value.length - 1] === ".") {
              const sepCount = (value.match(/\./g) || []).length;

              if (sepCount === 1) {
                setErrTotalPriceErr("Enter valid amount");
                setShipData(value);
              }
            } else {
              setErrTotalPriceErr(null);
            }
            //have decimal
            if (value.split(".")[1].length <= 2) {
              setShipData(value);
            }
          } else {
            setShipData(value);
            setErrTotalPriceErr(null);
          }
        } else {
          if (value === "0") {
            setErrTotalPriceErr("You should enter a valid price");
          }
        }
      }
    } else {
      setShipData(value);
    }
  };

  useEffect(() => {
    const { pounds, ounces, length, width, height } = packageProperties;

    const packagePropertiesIsComplete = Boolean(
      pounds && ounces && length && width && height
    );

    if (!packagePropertiesIsComplete) {
      setCarrierProviders([]);
    }
  }, [packageProperties]);

  const renderCarriers = () => {
    const { pounds, ounces, length, width, height } = packageProperties;

    const packagePropertiesIsComplete = Boolean(
      pounds && ounces && length && width && height
    );

    if (carrierProvidersExist && packagePropertiesIsComplete) {
      return carrierProviders.map((item, index) => {
        return (
          <DeliveryCarrier
            key={`delivery-method-carrier-${index}`}
            item={item}
            style={styles.providerContainer}
            checkedViewStyle={styles.checkedView}
            uncheckedViewStyle={styles.uncheckedView}
            onPress={() => {
              setErrHomiLabel("");
              setMinimiumPriceError("");

              const selectedProvider =
                localData?.deliveryCustomProperties?.optionsAvailable
                  ?.find((option) => option.selected === true)
                  ?.providers?.find((prov) => prov.selected === true);

              setLocalData({
                ...localData,
                customProperties: {
                  Weight: pounds + ounces / 16,
                  Length: length,
                  Width: width,
                  Height: height,
                },
                deliveryCustomProperties: {
                  ...localData.deliveryCustomProperties,
                  optionsAvailable:
                    selectedProvider?.provider === item.provider
                      ? []
                      : [
                          {
                            selected: true,
                            providers: [
                              {
                                cost: item.rate,
                                provider: item.provider,
                                selected: !item.selected,
                              },
                            ],
                          },
                        ],
                  freeOption: {
                    ...localData.deliveryCustomProperties.freeOption,
                    valueSelected: false,
                  },
                },
              });

              setCarrierProviders([
                ...carrierProviders.map((carrierProvider, i) => {
                  if (i === index && carrierProvider?.selected !== true) {
                    return { ...carrierProvider, selected: true };
                  }
                  return { ...carrierProvider, selected: false };
                }),
              ]);

              checkMinShippingRate({ shippingCost: item.rate });
            }}
          />
        );
      });
    }
  };

  useEffect(() => {
    const isChecked = formData?.deliveryMethodsSelected?.find(
      (element) => element.id === itemData.id
    );
    if (!isChecked) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [formData, itemData.id]);

  const isChecked = formData?.deliveryMethodsSelected?.find(
    (element) => element.id === itemData.id
  );

  const prepaidShippingLabelIsNotComplete = () => {
    const homitagshipping = formData?.deliveryMethodsSelected?.find(
      (deliveryMethodSelected) =>
        deliveryMethodSelected.code === "homitagshipping"
    );

    const selectedProvider =
      homitagshipping?.deliveryCustomProperties?.optionsAvailable
        ?.find((option) => option.selected === true)
        ?.providers?.find((prov) => prov.selected === true);

    const { weight, length, width, height } = formData?.customProperties;

    const packagePropertiesCompleted = Boolean(
      weight && length && width && height
    );

    if (formData?.listingType?.name === "Goods" && homitagshipping) {
      if (packagePropertiesCompleted === false) {
        return true;
      }
      if (!selectedProvider?.selected) {
        return true;
      }
    }
  };

  const offerFreeShippingShouldBeShown = () => {
    const homitagshipping = formData?.deliveryMethodsSelected?.find(
      (deliveryMethodSelected) =>
        deliveryMethodSelected.code === "homitagshipping"
    );

    if (homitagshipping) {
      if (minShippingRate.isFetching) {
        return false;
      }

      if (!minShippingRate?.data?.minPrice) {
        return false;
      }

      return true;
    } else {
      return true;
    }
  };

  return (
    <>
      <View
        style={[
          styles.container,
          { opacity: localAvailable === true ? 1 : 0.4 },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.4}
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            sendAlert(localData);
            if (localAvailable) {
              setDeliveryFormData(localData);
            }

            if (localData?.code === "homitagshipping") {
              setPackageProperties((prevState) => ({
                pounds: null,
                ounces: null,
                length: null,
                width: null,
                height: null,
                _meta: {
                  isCompleted: false,
                  isModified: true,
                },
              }));
              setCarrierProviders([]);
            }
          }}
        >
          <View style={styles.leftContainer}>
            {isChecked ? (
              <View style={styles.checkedView} />
            ) : (
              <View style={styles.uncheckedView} />
            )}
          </View>

          <View>
            <TouchableWithoutFeedback
              onPress={() => {
                if (localAvailable === false) {
                  sendAlert(localData);
                }
              }}
            >
              <BodyText
                theme="medium"
                bold
                align="left"
                numberOfLines={1}
                style={styles.titleText}
              >
                {itemData.name}
              </BodyText>
              <BodyText align="left" numberOfLines={1}>
                {itemData.description}
              </BodyText>
            </TouchableWithoutFeedback>
          </View>

          {isChecked && (
            <TouchableOpacity
              activeOpacity={0.4}
              onPress={() => setIsCollapsed(!isCollapsed)}
            >
              {itemData.deliveryCustomProperties.freeOption && (
                <View
                  style={[
                    styles.arrowContainer,
                    { width: itemData?.code == "shipindependently" ? 115 : 90 },
                  ]}
                >
                  {!isCollapsed ? (
                    <Icon icon="chevron-down" />
                  ) : (
                    <Icon icon="chevron-right" />
                  )}
                </View>
              )}
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
      {!isCollapsed && (
        <>
          {itemData?.deliveryCustomProperties?.optionsAvailable && (
            <View style={styles.childCustomContainer}>
              <BodyText
                theme="medium"
                bold
                align="left"
                numberOfLines={1}
                style={styles.titleText}
              >
                Enter Item Height and Dimensions
              </BodyText>
              <BodyText
                align="left"
                style={{ marginTop: 20, color: Colors.darkGrey }}
              >
                Please ship anything over 120 lbs independently.
              </BodyText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -15, marginTop: 15, flexGrow: 1 }}
                contentContainerStyle={{
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                }}
              >
                <DeliveryItemPackage
                  packageProperties={packageProperties}
                  handleOnBlur={handlePackagePropertiesOnBlur}
                  handleOnChange={handlePackagePropertiesOnChange}
                  errorMessage={packagePropertiesError}
                />
              </ScrollView>
            </View>
          )}
          {itemData.code === "homitagshipping" && (
            <View style={styles.childCustomContainer}>
              <BodyText
                theme="medium"
                bold
                align="left"
                numberOfLines={1}
                style={styles.titleText}
              >
                Select a Carrier
              </BodyText>
              {/* {carrierProvidersExist && (packageProperties?.pounds && packageProperties?.ounces && packageProperties?.length && packageProperties?.width && packageProperties?.height) && (
                <BodyText align="left" style={{ marginBottom: 5 }}>
                  Please select one provider.
                </BodyText>
              )} */}
              {!errHomiLabel &&
              !shippingRate?.isFetching &&
              !(
                packageProperties?.pounds &&
                packageProperties?.ounces &&
                packageProperties?.length &&
                packageProperties?.width &&
                packageProperties?.height
              ) ? (
                <BodyText align="left" style={{ marginBottom: 5 }}>
                  Please complete the weight and dimensions input to show
                  available providers.
                </BodyText>
              ) : (
                !shippingRate.isFetching && (
                  <BodyText align="left" style={{ marginBottom: 5 }}>
                    {!carrierProvidersExist
                      ? "No carrier available, choose ship independently."
                      : "Please select one provider."}
                  </BodyText>
                )
              )}
              {/* {(!carrierProvidersExist || !shippingRate?.isFetching) ?
                <BodyText align="left" style={{ marginBottom: 5 }}>
                  No carrier available, choose ship independently.
                </BodyText>
                :
                (!errHomiLabel && !shippingRate?.isFetching && !(packageProperties?.pounds && packageProperties?.ounces && packageProperties?.length && packageProperties?.width && packageProperties?.height) && (
                  <BodyText align="left" style={{ marginBottom: 5 }}>
                    Please complete the weight and dimensions input to show
                    available providers.
                  </BodyText>
                ))} */}

              {!carrierProvidersExist && shippingRate?.isFetching && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 15,
                  }}
                >
                  <ActivityIndicator
                    style={{ marginRight: 10 }}
                    color={colors.active}
                    size={"small"}
                  />
                  <BodyText align="left" style={{ marginBottom: 5 }}>
                    Loading shipping providers...
                  </BodyText>
                </View>
              )}

              {renderCarriers()}
              {errHomiLabel && !shippingRate.isFetching ? (
                <Text style={styles.redText}>{errHomiLabel}</Text>
              ) : null}
            </View>
          )}
          {((localData?.deliveryCustomProperties?.optionsAvailable?.length >
            0 &&
            carrierProviders?.length > 0) ||
            formData?.deliveryMethodsSelected[0]?.id ==
              "0de53a42-574a-4180-a5a5-aea0b7d6131a") && (
            // itemData.deliveryCustomProperties.freeOption &&
            // localData?.deliveryCustomProperties?.freeOption &&
            // !shippingRate.isFetching &&
            // offerFreeShippingShouldBeShown() === true &&
            // prepaidShippingLabelIsNotComplete() !== true && (
            <View
              style={[
                itemData.order < deliveryMethodsCount && styles.botomLine,
              ]}
            >
              <View style={[styles.childContainer]}>
                <View style={{ flex: 1 }}>
                  <BodyText
                    theme="medium"
                    bold
                    align="left"
                    numberOfLines={1}
                    style={styles.titleText}
                  >
                    {itemData.deliveryCustomProperties.freeOption.title}
                  </BodyText>
                  <BodyText align="left">
                    {itemData.deliveryCustomProperties.freeOption.description}
                  </BodyText>
                </View>
                <View style={[styles.freeContainer]}>
                  <CheckBox
                    label=""
                    theme="alter"
                    selected={
                      localData.deliveryCustomProperties.freeOption
                        .valueSelected
                    }
                    onChange={(value) => {
                      setErrHomiLabel(null);
                      setMinimiumPriceError("");

                      if (
                        localData.code === "homitagshipping" &&
                        Number(formData?.price) <
                          minShippingRate?.data?.minPrice
                      ) {
                        Alert.alert(
                          "Oops!",
                          `Mininum price for free shipping is ${currencyFormatter.format(
                            minShippingRate.data.minPrice
                          )}`
                        );
                        setMinimiumPriceError(
                          `Mininum price for free shipping is ${currencyFormatter.format(
                            minShippingRate.data.minPrice
                          )}`
                        );
                        return;
                      }

                      setLocalData({
                        ...localData,
                        deliveryCustomProperties: {
                          ...localData.deliveryCustomProperties,
                          freeOption: {
                            ...localData.deliveryCustomProperties.freeOption,
                            valueSelected: value,
                          },
                        },
                      });
                    }}
                  />
                </View>
              </View>
              {minimiumPriceError !== "" && (
                <Text style={styles.redText}>{minimiumPriceError}</Text>
              )}
            </View>
          )}

          {itemData.deliveryCustomProperties.freeOption &&
            itemData.code === "shipindependently" &&
            localData?.deliveryCustomProperties?.freeOption?.valueSelected ===
              false && (
              <View style={[styles.costContainer]}>
                <BodyText
                  theme="medium"
                  bold
                  align="left"
                  numberOfLines={1}
                  style={styles.titleText}
                >
                  Shipping Cost
                </BodyText>
                <CurrencyInput
                  value={
                    localData.deliveryCustomProperties.shippingCost > 0
                      ? localData.deliveryCustomProperties.shippingCost.toString()
                      : ""
                  }
                  onChangeText={(value) => {
                    moneyChecker(value);
                  }}
                />
                {errTotalPriceErr ? (
                  <Text style={styles.redText}>{errTotalPriceErr}</Text>
                ) : null}
              </View>
            )}
          {itemData.deliveryCustomProperties.freeOption &&
            itemData.code === "shipindependently" && (
              <BodyText
                align="left"
                style={{ marginBottom: 20 }}
                onPress={() => setShippingPolicyModal(true)}
              >
                By selecting this option, you agree to comply with our{" "}
                <Link theme="bold">Shipping Policy</Link> and provide tracking
                information.
              </BodyText>
            )}
        </>
      )}
      {/*Modal start*/}
      <Modal
        animationType="slide"
        transparent
        visible={shippingPolicyModal}
        style={{ flex: 1 }}
        onRequestClose={() => {
          setShippingPolicyModal(false);
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
                setShippingPolicyModal(false);
              }}
              name="arrow-back-outline"
              size={25}
              color="#969696"
            />
            <Text></Text>
            <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}>
              Shipping Policy
            </Text>
            <Text></Text>
            <Text></Text>
          </View>
          {/*Header end*/}
          <ScrollView>
            <View style={[styles.modalContentContainer, { margin: 10 }]}>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${general?.contentState?.data?.content}`,
                }}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
      {/*Modal End*/}
    </>
  );
};

DeliveryItem.defaultProps = {
  packageProperties: {
    pounds: null,
    ounces: null,
    length: null,
    width: null,
    height: null,
    _meta: {
      isCompleted: false,
      isModified: false,
    },
  },
  packagePropertiesError: {
    pounds: null,
    ounces: null,
    length: null,
    width: null,
    height: null,
  },
  handlePackagePropertiesOnChange: () => [],
  handlePackagePropertiesOnBlur: () => [],
};

DeliveryItem.propTypes = {
  packageProperties: PropTypes.object.isRequired,
  packagePropertiesError: PropTypes.object.isRequired,
  handlePackagePropertiesOnChange: PropTypes.func.isRequired,
  handlePackagePropertiesOnBlur: PropTypes.func.isRequired,
};

export default DeliveryItem;
