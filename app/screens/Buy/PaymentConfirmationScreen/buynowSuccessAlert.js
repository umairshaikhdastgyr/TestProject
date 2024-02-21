import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import LottieView from "lottie-react-native";
import moment from "moment";
import { Button } from "#components";
import PurchasedItem from "./purchased-item";
import { Fonts } from "#themes";

export const styles = StyleSheet.create({
  modalOuterContainer: {
    backgroundColor: "#00000090",
    flex: 1,
    justifyContent: "center",
  },
  modalContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    margin: 15,
    padding: 10,
    paddingBottom: 20,
    paddingTop: 0,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "gray",
  },
  modalTouchContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  titleText: {
    fontFamily: Fonts.family.semiBold,
    color: "#313334",
    fontWeight: "600",
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  msgText: {
    fontFamily: Fonts.family.regular,
    color: "#313334",
    fontWeight: "400",
    fontSize: 13,
    marginBottom: 5,
    textAlign: "center",
  },
  chatSellerLbl: {
    fontFamily: Fonts.family.regular,
    color: "#00BDAA",
    fontWeight: "600",
    fontSize: 13,
    // marginBottom: 20,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

const BuyNowSuccessAlert = (props) => {
  let sourceImg = "";
  let widthImg = 170;
  sourceImg = require("#assets/lottie/success.json");
  return (
    <Modal
      visible={props.dialogVisible}
      onRequestClose={() => {
        props.onTouchOutside();
      }}
      transparent={true}
    >
      <View style={styles.modalOuterContainer}>
        <View style={styles.modalContainer}>
          {props.module == "paymentconfirmation" ? (
            <View activeOpacity={0.9} style={styles.modalTouchContainer}>
              <LottieView
                source={sourceImg}
                style={{
                  width: widthImg,
                  height: 130,
                  marginBottom: -30,
                  marginTop: -5,
                }}
                autoPlay
                loop={false}
              />
              <Text style={styles.titleText}>Success</Text>
              <Text style={[styles.msgText]}>
                Congratulations. You successfully purchased{" "}
                {props.orderData?.productInfo?.title}
              </Text>
            </View>
          ) : props.module == "cancelrequest" ? (
            <View activeOpacity={0.9} style={styles.modalTouchContainer}>
              <View
                style={{
                  elevation: 1,
                  width: 90,
                  height: 90,
                  overflow: "hidden",
                  borderRadius: 10,
                  marginVertical: 20,
                }}
              >
                <Image
                  source={{
                    uri: props.screenDetails
                      ? props.screenDetails
                      : props.orderData?.productInfo?.image,
                  }}
                  style={{ width: 90, height: 90 }}
                  resizeMode="cover"
                />
              </View>

              <Text style={[styles.msgText]}>
                {props.directlyCancel
                  ? `Your cancelled the order.`
                  : `Your cancellation has been requested.`}
              </Text>
            </View>
          ) : props.module == "claimscreen" ? (
            <View activeOpacity={0.9} style={styles.modalTouchContainer}>
              <LottieView
                source={sourceImg}
                style={{ width: 300, height: 130, marginBottom: -25 }}
                autoPlay
                loop={false}
              />
              <Text style={styles.titleText}>
                {`You've successfully filled a claim for ${props.orderData?.productInfo?.title}`}
              </Text>
            </View>
          ) : props.module == "returnscreen" ? (
            <View activeOpacity={0.9} style={styles.modalTouchContainer}>
              <View
                style={{
                  elevation: 1,
                  width: 90,
                  height: 90,
                  overflow: "hidden",
                  borderRadius: 10,
                  marginVertical: 20,
                }}
              >
                <Image
                  source={{ uri: props.orderData?.productInfo?.image }}
                  style={{ width: 90, height: 90 }}
                  resizeMode="cover"
                />
              </View>

              <Text style={[styles.msgText]}>
                Your return has been requested.
              </Text>
            </View>
          ) : props.module == "shippmentConfirmScreen" ? (
            <View activeOpacity={0.9} style={styles.modalTouchContainer}>
              <LottieView
                source={sourceImg}
                style={{ width: widthImg, height: 100, marginBottom: -25 }}
                autoPlay
                loop={false}
              />
              <Text style={styles.titleText}>Shipment confirmed</Text>
              <Text style={[styles.msgText]}>
                You can track your shipment through the purchase details page.
                Once the seller confirms they’ve received your item the return
                will be complete.
              </Text>
            </View>
          ) : null}
          <View
            style={{
              backgroundColor: "#F5F5F5",
              paddingBottom: 20,
              paddingTop: 10,
              display:
                props.module != "shippmentConfirmScreen" &&
                props.module != "claimscreen"
                  ? "flex"
                  : "none",
            }}
          >
            {props.module == "cancelrequest" ||
            props.module == "returnscreen" ? (
              <PurchasedItem
                leftLabel={props.orderData?.productInfo?.title}
                txtType="bold"
                rightLabel={""}
                float="left"
              />
            ) : null}
            {props.module != "claimscreen" && (
              <PurchasedItem
                leftLabel="Order ID:"
                txtType="bold"
                rightLabel={props.orderData?.orderID}
                float="left"
              />
            )}
            {props.module == "paymentconfirmation" && (
              <PurchasedItem
                leftLabel="Est. Delivery Date:"
                txtType="bold"
                rightLabel={
                  props.orderData &&
                  `${moment(props.orderData.shipBy).format("MM/DD")} - ${moment(
                    props.orderData.deliverBy
                  ).format("MM/DD")}`
                }
                float="left"
                // rightLabel={moment(createdAt).format('DD/MM/YYYY')}
              />
            )}
          </View>
          <View
            activeOpacity={0.9}
            style={{
              marginTop: props.module != "shippmentConfirmScreen" ? 20 : 0,
              paddingHorizontal: 20,
              marginBottom: 20,
            }}
          >
            {props.module != "shippmentConfirmScreen" && (
              <Text style={[styles.msgText]}>
                {props.module == "returnscreen"
                  ? `You’ll see a notification once the seller responds to your request. If they don’t respond by ${moment()
                      .add(3, "days")
                      .format(
                        "MM/DD"
                      )} you can open a claim.\n\nYou can always check on updates through the`
                  : props.module == "cancelrequest"
                  ? props.directlyCancel
                    ? `Your product listing is added back into inventory.`
                    : `You’ll see a notification once the seller responds to your request.
                
You can always check on updates through the order status.`
                  : props.module == "paymentconfirmation"
                  ? `You can check your order’s status through the chat menu. Please reach out to the seller if you have any questions.`
                  : props.module == "claimscreen"
                  ? `We'll send you notifications once there are updates with this claim.\n\n You can always check on updates through order status`
                  : null}
              </Text>
            )}

            <TouchableOpacity onPress={() => props.goTo()}>
              <Text style={styles.chatSellerLbl}>
                {props.module == "paymentconfirmation"
                  ? `Chat with seller`
                  : props.module == "cancelrequest" ||
                    props.module == "returnscreen" ||
                    props.module == "shippmentConfirmScreen" ||
                    props.module == "claimscreen"
                  ? "Order Status Page"
                  : ""}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: "90%" }}>
            {props.module == "paymentconfirmation" && (
              <View style={{ width: "100%", marginBottom: 10 }}>
                <Button
                  label="View Receipt"
                  theme="primary"
                  size="large"
                  fullWidth
                  onPress={() => props.onCTAClick()}
                />
              </View>
            )}
            <View style={{ width: "100%" }}>
              <Button
                label="Done"
                theme={
                  props.module == "paymentconfirmation"
                    ? "secondary"
                    : props.module == "cancelrequest"
                    ? "primary"
                    : "primary"
                }
                size="large"
                fullWidth
                onPress={() => {
                  props.onDone();
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BuyNowSuccessAlert;
