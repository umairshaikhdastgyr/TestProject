import React, { useState, useEffect, Fragment } from "react";

import { Alert, StyleSheet, View } from "react-native";
import { Button } from "#components";
import { flex, margins, paddings } from "#styles/utilities";
import { useSelector } from "react-redux";
import { selectUserData } from "#modules/User/selectors";

const Footer = ({
  onPressSendMessage,
  onPressMakeOffer,
  onPressBuy,
  makeOfferAvailable,
  buyerOfferAvaialable,
  buyNowAvailable,
  disableSendMessage,
  disableMakeOffer,
  disableBuyNow,
  isSupplier,
  status,
  navigation,
  setShowVerificationNumberPopup
}) => {
  const { information: userInfo } = useSelector(selectUserData());

  let secondText = "Buy Now";
  // if (makeOfferAvailable === true) {
  //   secondText = "Make Offer";
  // } else {
  //   secondText = "Buy Now";
  // }

  const renderNotVerifiedAlert = () => {
    setShowVerificationNumberPopup(true)
  }

  if (isSupplier) {
    return (
      <View style={styles.container}>
        <Button
          label={secondText}
          size="large"
          style={flex.grow1}
          onPress={() => {
            if (!userInfo?.id || userInfo?.emailvalidated || userInfo?.phonenumbervalidated) {
              onPressBuy();
            } else {
              renderNotVerifiedAlert();
            }
          }}
          disabled={disableBuyNow}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Button
        label="Send Message"
        theme="secondary"
        size="large"
        style={{ ...margins["mr-3"], ...flex.grow1 }}
        onPress={() => {
          if (!userInfo?.id || userInfo?.emailvalidated || userInfo?.phonenumbervalidated) {
            onPressSendMessage();
          } else {
            renderNotVerifiedAlert();
          }
        }}
        disabled={disableSendMessage}
      />
      {status != 'BOUGHT' && <Button
        label={secondText}
        size="large"
        style={flex.grow1}
        onPress={() => {
          if (!userInfo?.id || userInfo?.emailvalidated || userInfo?.phonenumbervalidated) {
            if (secondText === "Make Offer") {
              onPressMakeOffer();
            } else {
              onPressBuy();
            }
          } else {
            renderNotVerifiedAlert();
          }
        }}
        disabled={
          (secondText === "Make Offer" && disableMakeOffer) ||
          (secondText === "Buy Now" && disableBuyNow)
        }
      />}
    </View>
  );
  // if (
  //   buyerOfferAvaialable === true &&
  //   makeOfferAvailable === true &&
  //   buyNowAvailable
  // ) {
  //   return (
  //     <View style={styles.container}>
  //       <Button
  //         label="Send Message"
  //         theme="secondary"
  //         style={{ ...margins["mr-3"], ...flex.grow1 }}
  //         onPress={()=>{
  //           if (!userInfo?.id ||userInfo?.emailvalidated || userInfo?.phonenumbervalidated) {
  //             onPressSendMessage();
  //           } else {
  //             renderNotVerifiedAlert();
  //           }
  //         }}
  //         disabled={disableSendMessage}
  //       />
  //       <Button
  //         label="Make Offer"
  //         theme={disableMakeOffer ? "primary" : "secondary"}
  //         style={{ ...margins["mr-3"], ...flex.grow1 }}
  //         onPress={()=>{
  //           if (!userInfo?.id ||userInfo?.emailvalidated || userInfo?.phonenumbervalidated) {
  //             onPressMakeOffer();
  //           } else {
  //             renderNotVerifiedAlert();
  //           }
  //         }}
  //         disabled={disableMakeOffer}
  //       />
  //       <Button
  //         label="Buy Now"
  //         style={flex.grow1}
  //         onPress={()=>{
  //           if (!userInfo?.id ||userInfo?.emailvalidated || userInfo?.phonenumbervalidated) {
  //             onPressBuy();
  //           } else {
  //             renderNotVerifiedAlert();
  //           }
  //         }}
  //         disabled={disableBuyNow}
  //       />
  //     </View>
  //   );
  // } else {
  //   return (
  //     <View style={styles.container}>
  //       <Button
  //         label="Send Message"
  //         theme="secondary"
  //         size="large"
  //         style={{ ...margins["mr-3"], ...flex.grow1 }}
  //         onPress={() => {
  //           if (!userInfo?.id ||userInfo?.emailvalidated || userInfo?.phonenumbervalidated) {
  //             onPressSendMessage();
  //           } else {
  //             renderNotVerifiedAlert();
  //           }
  //         }}
  //         disabled={disableSendMessage}
  //       />
  //       <Button
  //         label={secondText}
  //         size="large"
  //         style={flex.grow1}
  //         onPress={() => {

  //           if (!userInfo?.id || userInfo?.emailvalidated || userInfo?.phonenumbervalidated) {
  //             if (secondText === "Make Offer") {
  //               onPressMakeOffer();
  //             } else {
  //               onPressBuy();
  //             }
  //           } else {
  //             renderNotVerifiedAlert();
  //           }
  //         }}
  //         disabled={
  //           (secondText === "Make Offer" && disableMakeOffer) ||
  //           (secondText === "Buy Now" && disableBuyNow)
  //         }
  //       />
  //     </View>
  //   );
  // }
};

const styles = StyleSheet.create({
  container: {
    ...flex.directionRow,
    ...paddings["p-3"],
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { height: 0, width: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 54,
    elevation: 10,
  },
});

export default Footer;
