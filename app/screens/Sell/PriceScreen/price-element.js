import React, { useEffect, useState } from "react";

import { View, Keyboard, Text } from "react-native";
import { Heading, CheckBox, CurrencyInput } from "#components";

import styles from "./styles";
import { changePostDetail, setFormValue } from "#modules/Sell/actions";
import { useDispatch } from "react-redux";
import { flex } from "#styles/utilities";

const PriceElement = ({
  formData,
  errTotalPriceErr,
  setErrTotalPriceErr,
  setPackageProperties,
  setPackagePropertiesError,
  resetWarningText,
  setResetWarningText,
}) => {
  /* Actions */
  const dispatch = useDispatch();
  const [dontUpdatePrice, setDontUpdatePrice] = useState(false);

  useEffect(() => {
    dispatch(setFormValue({ price: formData.price.replace(",", ".") }));
  }, [dispatch, formData.price]);

  const setPrice = (price) => {
    const isGoods = formData?.listingType?.name === "Goods";

    if (formData?.deliveryMethodsSelected?.length > 0) {
      setResetWarningText(
        "Delivery methods is reset, please choose delivery methods according to your chosen price"
      );
    }
    dispatch(
      setFormValue({
        price,
        deliveryMethodsSelected: [],
        customProperties: {},
      })
    );
    // dispatch(
    //   setFormValue({
    //     price,
    //     deliveryMethodsSelected: isGoods
    //       ? []
    //       : formData?.deliveryMethodsSelected,
    //     customProperties: isGoods ? {} : formData?.customProperties,
    //   }),
    // );
    if (typeof setPackageProperties === "function") {
      setPackageProperties({
        pounds: null,
        ounces: null,
        length: null,
        width: null,
        height: null,
        _meta: {
          isCompleted: false,
          isModified: false,
        },
      });
    }

    if (typeof setPackagePropertiesError === "function") {
      setPackagePropertiesError({
        pounds: "Required",
        ounces: "Required",
        length: "Required",
        width: "Required",
        height: "Required",
      });
    }
  };

  const moneyChecker = (value1, comingFrom) => {
    if (comingFrom === "OnEdit" && dontUpdatePrice) {
      setDontUpdatePrice(false);
      return;
    }
    const value = value1.replace(",", ".");
    if (value1 !== "") {
      if (value1.length < 16) {
        if (Number(value)) {
          if (value.split(".").length > 1) {
            if (value[value.length - 1] === ".") {
              const sepCount = (value.match(/\./g) || []).length;

              if (sepCount === 1) {
                setPrice(value);
                setErrTotalPriceErr("Enter valid amount");
              }
            } else {
              setErrTotalPriceErr(null);
            }
            //have decimal
            if (value.split(".")[1].length <= 2) {
              // to be removed when enable make offer
              if (value > 1500) {
                setErrTotalPriceErr("You can't sell item more than $1500");
              } else {
                setErrTotalPriceErr(null);
              }
              // to be removed when enable make offer
              setPrice(value);
            }
          } else {
            // to be removed when enable make offer
            if (value > 1500) {
              setErrTotalPriceErr("You can't sell item more than $1500");
            } else {
              setErrTotalPriceErr(null);
            }
            // to be removed when enable make offer
            setPrice(value);
          }
        } else {
          if (value === "0") {
            setErrTotalPriceErr("You should enter a valid price");
          }
        }
      }
    } else {
      setPrice(value);
    }
  };

  return (
    <>
      <View style={styles["input-container"]}>
        <View style={[flex.directionRow]}>
          <Heading type="bodyText" bold>
            Price
          </Heading>
          <Heading type="bodyText" bold style={{ color: "red" }}>
            *
          </Heading>
        </View>

        <CurrencyInput
          bottomLine={false}
          value={
            formData.price.length > 16
              ? formData.price.slice(0, -3)
              : formData.price
          }
          onChangeText={(value) => {
            moneyChecker(value, "changeText");
            dispatch(changePostDetail(true));
          }}
        />
        {errTotalPriceErr ? (
          <Text style={styles.redText}>{errTotalPriceErr}</Text>
        ) : null}
      </View>
      {/* Temparary removed for first release
       <View style={styles['input-container']}>
        <CheckBox
          label="Negotiable?"
          theme="alter"
          selected={formData.isNegotiable}
          onChange={() => {
            Keyboard.dismiss();
            dispatch(
              setFormValue({
                isNegotiable: !formData.isNegotiable,
              }),
            );
          }}
        />
      </View> */}
      {resetWarningText !== "" ? (
        <Text
          style={[
            styles.redText,
            { width: "100%", textAlign: "center", marginTop: 20 },
          ]}
        >
          {resetWarningText}
        </Text>
      ) : null}
    </>
  );
};

export default PriceElement;
