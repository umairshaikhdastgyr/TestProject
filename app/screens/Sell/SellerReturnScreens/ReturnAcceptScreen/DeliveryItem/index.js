import React, { useEffect, useState, useCallback } from "react";

import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Text,
  Dimensions,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import {
  InputText,
} from "#components";
import { CheckBox, CurrencyInput, BodyText, Icon, Link } from "#components";
import ReturnAddress from "./returnAddress";
import { Colors, Fonts } from "#themes";
import styles from "./styles";
import SelectedPhotos from "../../../MainScreen/views/selected-photos";
import SmallLoader from "#components/Loader/SmallLoader";
import IndDelivery from "./indDelivery";
import DeliveryItemPackage from "./DeliveryItemPackage";
import DeliveryCarrier from "./DeliveryCarrier";
const { width } = Dimensions.get("window");
import { selectSellData } from "#modules/Sell/selectors";
import { useSelector, useDispatch } from "react-redux";
import { getShipRate } from "#modules/Sell/actions";
import fonts from "#themes/fonts";
import colors from "#themes/colors";
import { selectOrderData } from "#modules/Orders/selectors";

const DeliveryItem = ({
  itemData,
  setDeliverMethod,
  deliverMethods,
  index,
  returnAddressList,
  navigation,
  postDetail,
  actions,
  selectedItem,
  setSelectedItem,
  onSetLabel,
  // returnLabel,
  isFetchingPostDetail,
  onSetDefaultAddress,
}) => {
  const {
    returnLabel,
  } = useSelector(selectOrderData());
  const onSelectItem = () => {
    const deliveryMethodList = [...deliverMethods];
    for (let i = 0; i < deliveryMethodList.length; i++) {
      deliveryMethodList[i].isSelected = false;
    }
    deliveryMethodList[index].isSelected = true;
    setDeliverMethod(deliveryMethodList);
    actions.setReturnLabel({
      ...returnLabel,
      deliveryType: deliveryMethodList[index].code,
      provider: '',
      selectedCarrierItem:''
    });
    setTimeout(() => {
      onSetDefaultAddress()
    }, 1000);
  };

  const { shippingRate, minShippingRate } = useSelector(selectSellData());

  const getInitialPounds = (weight) => {
    if (weight) {
      return Math.floor(weight ?? 0).toString();
    }

    return null;
  };

  const getInitialOunces = (weight) => {
    if (weight) {
      return (
        ((parseFloat(weight) * 100 - Math.floor(weight) * 100) / 100) *
        16
      )?.toString();
    }

    return null;
  };

  const getInitialLength = (length) => length?.toString() ?? null;
  const getInitialWidth = (width) => width?.toString() ?? null;
  const getInitialHeight = (height) => height?.toString() ?? null;

  const [packageProperties, setPackageProperties] = useState({
    pounds: getInitialPounds(),
    ounces: getInitialOunces(),
    length: getInitialLength(),
    width: getInitialWidth(),
    height: getInitialHeight(),
    _meta: {
      isCompleted: Boolean(
        getInitialPounds() &&
          getInitialOunces() &&
          getInitialLength() &&
          getInitialWidth() &&
          getInitialHeight()
      ),
      isModified: false,
    },
  });

  const dispatch = useDispatch();

  const [packagePropertiesError, setPackagePropertiesError] = useState({
    pounds: getInitialPounds() ? null : "Required",
    ounces: getInitialOunces() ? null : "Required",
    length: getInitialLength() ? null : "Required",
    width: getInitialWidth() ? null : "Required",
    height: getInitialHeight() ? null : "Required",
  });

  const handlePackagePropertiesOnChange = (key = "", value = "") => {
    setErrHomiLabel(null);
    //_handlePackagePropertiesOnError(key, value);

    if (parseInt(value, 10) > 120 && key === "pounds") {
      return;
    }

    if (parseInt(value, 10) === 120 && key === "pounds") {
      setPackageProperties({
        ...packageProperties,
        pounds: "120",
        ounces: "0",
      });

      return;
    }

    if (parseInt(value, 10) > 15 && key === "ounces") {
      return;
    }

    if (parseInt(packageProperties.pounds, 10) === 120 && key === "ounces") {
      setPackageProperties({
        ...packageProperties,
        ounces: "0",
      });
      return;
    }

    setPackageProperties({
      ...packageProperties,
      [key]: value,
    });
  };
  const [minimiumPriceError, setMinimiumPriceError] = useState("");

  const [carrierProviders, setCarrierProviders] = useState([]);
  const [errHomiLabel, setErrHomiLabel] = useState(null);
  const carrierProvidersExist = carrierProviders.length > 0;

  const handlePackagePropertiesOnBlur = () => {
    const fieldValues = Object.values(packageProperties).filter(
      (value) => value === null
    );

    // actions.setFormValue({
    //   customProperties: {
    //     ...formData.customProperties,
    //     width: parseInt(packageProperties.width, 10) || null,
    //     height: parseInt(packageProperties.height, 10) || null,
    //     length: parseInt(packageProperties.length, 10) || null,
    //     weight:
    //       Number(packageProperties.pounds) +
    //         Number(packageProperties.ounces) / 16 || null,
    //   },
    // });

    // Set meta fields
    if (fieldValues.every((value) => value !== null)) {
      setPackageProperties({
        ...packageProperties,
        _meta: {
          isCompleted: true,
          isModified: false,
        },
      });
    }
  };
  const [errAmount, setErrAmount] = useState("");

  useEffect(() => {
    const callAPI = () => {
      if (!selectedItem?.city) {
        setErrHomiLabel("Please select return address.");
        return;
      }
      setErrHomiLabel(null);
      if (packageProperties?._meta?.isCompleted) {
        const { pounds, ounces, length, width, height } = packageProperties;
        const { city, country, zipcode, state, address_line_1 } = selectedItem;

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
          setCarrierProviders([]);
          setPackageProperties((prevState) => ({
            ...prevState,
            _meta: {
              isCompleted: false,
              isModified: true,
            },
          }));
          return;
        }
        dispatch(
          getShipRate({
            params: {
              seller: {
                AddressLine: address_line_1,
                AddressCity: city,
                AddressState: state,
                AddressZIP: zipcode,
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
  }, [dispatch, selectedItem, packageProperties,returnAddressList]);

  const shProvider =
    (returnLabel.provider && returnLabel.provider.toUpperCase()) ||
    (returnLabel.selectedCarrierItem &&
      returnLabel.selectedCarrierItem.toUpperCase());
  const [ownLabel, setOwnLabel] = useState({
    label: "",
    carrier: "",
    trackingNumber: "",
    shippingCost: "",
  });

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
              if(!item.selected){
                actions.setReturnLabel({
                  ...returnLabel,
                  provider: item.provider,
                  shippingCost: item.rate,
                });
              }else{
                actions.setReturnLabel({
                  ...returnLabel,
                  provider: '',
                  shippingCost: '',
                });
              }
              setCarrierProviders([
                ...carrierProviders.map((carrierProvider, i) => {
                  if (i === index && carrierProvider?.selected !== true) {
                    return { ...carrierProvider, selected: true };
                  }
                  return { ...carrierProvider, selected: false };
                }),
              ]);

              //checkMinShippingRate({ shippingCost: item.rate });
            }}
          />
        );
      });
    }
  };

  useEffect(() => {
    /**
     * @description Check shipping rate from previous API call and set state object
     * @return Null
     */
    const verifyShippingRate = () => {
      if (shippingRate?.data?.rates?.length > 0) {
        // const homitagshipping = formData?.deliveryMethodsSelected?.find(
        //   deliveryMethodSelected =>
        //     deliveryMethodSelected.code === 'homitagshipping',
        // );
        // const selectedProvider = homitagshipping?.deliveryCustomProperties?.optionsAvailable
        //   ?.find(option => option.selected === true)
        //   ?.providers?.find(prov => prov.selected === true);
        setErrHomiLabel(null);
        setCarrierProviders(
          shippingRate.data.rates.map((rate) => {
            // if (rate.provider === selectedProvider?.provider) {
            //   return { ...rate, selected: true };
            // } else {
            return { ...rate, selected: false };
            // }
          })
        );
        return;
      }
      setCarrierProviders([]);
    };
    verifyShippingRate();
  }, [setErrHomiLabel, shippingRate]);
  return (
    <>
      <View style={itemData.isSelected && { flex: 1 }}>
        <TouchableOpacity activeOpacity={0.4} onPress={onSelectItem}>
          <View
            style={[
              styles.container,
              {
                //  opacity: localAvailable === true ? 1 : 0.4
              },
            ]}
          >
            <View style={styles.leftContainer}>
              {itemData.isSelected && <View style={styles.checkedView} />}
              {!itemData.isSelected && <View style={styles.uncheckedView} />}
            </View>
            <View style={[{ width: width - 110 }]}>
              <BodyText
                theme="medium"
                bold
                align="left"
                numberOfLines={1}
                style={styles.titleText}
              >
                {itemData.name}
              </BodyText>
              <BodyText align="left" numberOfLines={2}>
                {itemData.description}
              </BodyText>
            </View>

            <View style={styles.arrowContainer}>
              {!itemData.isSelected && <Icon icon="chevron-right" />}
              {itemData.isSelected && <Icon icon="chevron-down" />}
            </View>
          </View>
        </TouchableOpacity>
        {itemData.code === "homitagshipping" && itemData.isSelected && (
          <>
            {isFetchingPostDetail ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SmallLoader />
              </View>
            ) : (
              <View style={{ marginHorizontal: 20 }}>
                <ReturnAddress
                  returnAddressList={returnAddressList}
                  navigation={navigation}
                  postDetail={postDetail}
                  actions={actions}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                  returnLabel={returnLabel}
                />
              </View>
            )}
            <View>
              <DeliveryItemPackage
                packageProperties={packageProperties}
                handleOnBlur={handlePackagePropertiesOnBlur}
                handleOnChange={handlePackagePropertiesOnChange}
                errorMessage={packagePropertiesError}
              />
              <View
                style={[styles.childCustomContainer, { marginHorizontal: 20 }]}
              >
                <BodyText
                  theme="medium"
                  bold
                  align="left"
                  numberOfLines={1}
                  style={styles.titleText}
                >
                  Select a Carrier
                </BodyText>
                {carrierProvidersExist && (
                  <BodyText align="left" style={{ marginBottom: 5 }}>
                    Please select one provider.
                  </BodyText>
                )}
                {!errHomiLabel &&
                  !carrierProvidersExist &&
                  !shippingRate?.isFetching && (
                    <BodyText align="left" style={{ marginBottom: 5 }}>
                      Please complete the weight and dimensions input to show
                      available providers.
                    </BodyText>
                  )}
                {!carrierProvidersExist && shippingRate?.isFetching && (
                  <View
                    style={{ flexDirection: "row", justifyContent: "center",marginTop:15 }}
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
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                  }}
                >
                  <BodyText
                    align="left"
                    style={{
                      fontFamily: fonts.family.semiBold,
                      fontSize: 15,
                    }}
                  >
                    Instructions (optional)
                  </BodyText>
                  <BodyText align="left" style={{ color: "#DADADA" }}>
                    0/1500
                  </BodyText>
                </View>
                <InputText
                    placeholder="Type Here"
                    fullWidth
                    textAlign="left"
                    value={returnLabel.instruction}
                    onChangeText={(text) => {
                      actions.setReturnLabel({
                        ...returnLabel,
                        instruction: text,
                      });
                    }}
                    maxLength={500}
                    returnKeyType="done"
                    multiline
                    numberOfLines={6}
                    style={{ fontSize: 15 }}
                    onSubmitEditing={()=>{Keyboard.dismiss()}}
                  />
                {/* <TextInput
                  placeholder="Type here"
                  numberOfLines={4}
                  onChangeText={(text) => {
                    actions.setReturnLabel({
                      ...returnLabel,
                      instruction: text,
                    });
                  }}
                  style={{
                    fontSize: 15,
                    marginTop: 0,
                    padding: 0,
                    fontFamily: fonts.family.regular,
                  }}
                ></TextInput> */}
              </View>
              <View></View>
            </View>
          </>
        )}
        {/* {itemData.code === "homitagshipping" &&
          itemData.isSelected &&
          (isFetchingPostDetail ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SmallLoader />
            </View>
          ) : (
            <View style={{ marginHorizontal: 20 }}>
              <ReturnAddress
                returnAddressList={returnAddressList}
                navigation={navigation}
                postDetail={postDetail}
                actions={actions}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                returnLabel={returnLabel}
              />
            </View>
          ))} */}
        {itemData.code === "shipindependently" && itemData.isSelected && (
          <>
            <IndDelivery
              onSetLabel={onSetLabel}
              actions={actions}
              errAmount={errAmount}
              navigation={navigation}
              returnLabel={returnLabel}
              shProvider={shProvider}
            />
            
            {/* <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Add Label :</Text>
              <TouchableOpacity style={styles.uploadLabelButton} onPress={onSetLabel}>
                <Icon icon="camera_active" />
                <Text style={styles.uploadLabelText}>
                  Upload Label
                </Text>
              </TouchableOpacity>
            </View>
            <SelectedPhotos />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Carrier</Text>
              <View style={styles.carrierInputContainer}>
                <TextInput
                  placeholderTextColor={Colors.inactiveText}
                  placeholder="Choose an Option"
                  style={styles.carrierInputText}
                  value={shProvider}
                  editable={false}
                />
                <TouchableOpacity onPress={() => navigation.navigate('SelectCarrier')}>
                  <Text style={styles.carrierInputSelect}>SELECT</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tracking Number</Text>
              <TextInput
                placeholderTextColor={Colors.inactiveText}
                placeholder="Type Here"
                style={styles.inputText}
                value={returnLabel.trackingNumber}
                onChangeText={(text) => actions.setReturnLabel({ ...returnLabel, trackingNumber: text })}
              />

            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Shipping Cost</Text>
              <TextInput
                placeholderTextColor={Colors.inactiveText}
                placeholder="Type Here"
                style={styles.inputText}
                value={returnLabel.shippingCost}
              />
              {errAmount !== '' && <Text style={styles.redText}>{errAmount}</Text>}
            </View>
        */}
          </>
        )}
      </View>
    </>
  );
};
export default DeliveryItem;
