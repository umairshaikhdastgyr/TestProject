import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  Modal,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  InputText,
  FooterAction,
  SweetAlert,
  CheckBoxSquare,
  Label,
  Heading,
} from "#components";
import colors from "#themes/colors";
import fonts from "#themes/fonts";
import styles from "./styles";
import RadioButton from "#components/RadioButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Utilities } from "#styles";
import { userSelector } from "#modules/User/selectors";
import { sendUserReport } from "../../../modules/User/actions";
import ProductDetail from "./product-detail";
import { Colors } from "#themes";
import ScreenLoader from "#components/Loader/ScreenLoader";
import RenderHtml from "react-native-render-html";

const { width } = Dimensions.get("window");
const reasons = {
  reportListing: [
    {
      text: "The product is a fake",
      value: "The product is a fake",
    },
    {
      text: "Awful quality",
      value: "Awful quality",
    },
    {
      text: "Product does not correspond to the listing",
      value: "Product does not correspond to the listing",
    },
    {
      text: "Other (describe below)",
      value: "Other",
    },
  ],
  other: [
    {
      text: "Inappropriate/Offensive",
      value: "Inappropriate/Offensive",
    },
    {
      text: "Inaccurate",
      value: "Inaccurate",
    },
    {
      text: "Other",
      value: "Other",
    },
  ],
};

const ReportScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const [reason, setReason] = useState(null);
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);
  const [reasonDescription, setReasonDescription] = useState("");
  const [isBlock, setIsBlock] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const {
    user: {
      information: { id },
    },
  } = useSelector(userSelector);

  const reportedUserId = route?.params?.reportedUserId ?? null;
  const reviewId = route?.params?.reviewId ?? null;
  const reportType = route?.params?.type ?? "Continue";
  const name = route?.params?.name ?? "";

  const userProductDetail = route?.params?.userProductDetail ?? null;
  const screenDetails = route?.params?.screenDetails ?? null;

  useEffect(() => {
    if (reason && reasonDescription) {
      setIsDisabledBtn(false);
    } else {
      setIsDisabledBtn(true);
    }
  }, [reason, reasonDescription]);
  const onSendReport = () => {
    setLoader(true);
    let params = null;
    switch (reportType) {
      case "Report Review":
        params = {
          reasonDescription,
          reason,
          resultStatus: "new",
          reportedByUserId: id,
          reviewId,
        };
        break;
      case "Report Listing":
        params = {
          reasonDescription,
          reason,
          reportedByUser: id,
          itemId: screenDetails.id,
          reportedUserId,
        };
        break;
      default:
        params = {
          reasonDescription,
          reason,
          resultStatus: "new",
          reportedByUserId: id,
          reportedUserId,
        };
        break;
    }

    dispatch(sendUserReport({ body: { params }, reportType, isBlock }));
    setTimeout(() => {
      setLoader(true);
      navigation.goBack();
    }, 2000);
  };

  const reasonsData =
    reportType === "Report Listing" ? reasons.reportListing : reasons.other;

  const source = {
    html: `
          <p>Users may be blocked from using the App under the following circumstances:</p>
          <ul>
              <li>
                  <strong>Violations of Terms of Use:</strong>
                  <p>Users who repeatedly violate the App's Terms of Use, including but not limited to fraudulent activities, harassment, spamming, or any other behavior deemed harmful to the App community.</p>
              </li>
              <li>
                  <strong>Illegal Activities:</strong>
                  <p>Users engaged in any illegal activities on the App, including the sale or purchase of prohibited or counterfeit items.</p>
              </li>
              <li>
                  <strong>Misconduct:</strong>
                  <p>Users who engage in disrespectful, offensive, or abusive behavior towards other users, App administrators, or customer support personnel.</p>
              </li>
              <li>
                  <strong>Intellectual Property Violations:</strong>
                  <p>Users who repeatedly infringe upon the intellectual property rights of others, including copyright, trademark, or patent violations.</p>
              </li>
              <li>
                  <strong>Security Breaches:</strong>
                  <p>Users involved in attempts to compromise the security of the App, including hacking, phishing, or attempting to access unauthorized parts of the App.</p>
              </li>
              <li>
                  <strong>Misrepresentation:</strong>
                  <p>Users providing false information during registration, impersonating others, or misleading the App community.</p>
              </li>
              <li>
                  <strong>Non-Payment:</strong>
                  <p>Sellers who fail to fulfill their financial obligations, such as not paying fees or not delivering sold items.</p>
              </li>
              <li>
                  <strong>Repeated Negative Feedback:</strong>
                  <p>Sellers with a consistent history of negative feedback from customers indicating poor service or misrepresented products.</p>
              </li>
          </ul>
          <h3>Blocking Process</h3>
          <p>The decision to block a user will be made by the App's administrators and customer support team. The following process will be followed:</p>
          <ul>
              <li>
                  <strong>Investigation:</strong>
                  <p>Reports and evidence of user misconduct will be thoroughly investigated by the App's administrators.</p>
              </li>
              <li>
                  <strong>Warning:</strong>
                  <p>In some cases, users may be given a warning and an opportunity to rectify their behavior before being blocked.</p>
              </li>
              <li>
                  <strong>Blocking Decision:</strong>
                  <p>If the behavior or violation is severe or repeated, the user may be blocked from accessing the App.</p>
              </li>
              <li>
                  <strong>Notification:</strong>
                  <p>The user will be notified of the block and the reason for it via email or in-app notification.</p>
              </li>
          </ul>
      
          <h3>Appeals Process</h3>
          <p>Users who believe they have been wrongly blocked may appeal the decision by contacting the App's customer support. Appeals will be reviewed by a different team to ensure fairness in the process.</p>
      </body>
      </html>
      `,
  };

  return (
    <>
      {loader && <ScreenLoader />}
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          enabled
          keyboardVerticalOffset={75}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {screenDetails && screenDetails.id && (
              <ProductDetail
                screenDetails={screenDetails}
                userProductDetail={userProductDetail}
              />
            )}
            <View style={styles.reasonContainer}>
              <Label bold size="large">
                {/* <Text style={styles.blackBoldText}> */}
                {reportType === "Report Listing"
                  ? "Reason for reporting this listing:"
                  : "Reason for reporting"}
                {/* </Text> */}
              </Label>

              {reasonsData.map((item, i) => (
                <RadioButton
                  key={`reason-${i}`}
                  isActive={reason === item.value}
                  label={item.text}
                  onPress={() => setReason(item.value)}
                />
              ))}
            </View>

            {/* <View style={styles.inputDescriptionWrapper}>
              <InputText
                placeholder={
                  reportType === 'Report Listing'
                    ? 'Add a comment here'
                    : 'Feel free to elaborate here'
                }
                fullWidth
                onChangeText={(value) => setReasonDescription(value)}
              />
            </View>
            */}

            <View style={styles.inputDescriptionWrapper}>
              <Heading
                style={{
                  alignSelf: "flex-end",
                  marginTop: 15,
                  color: "#313334",
                }}
                type="bodyText"
              >
                {reasonDescription.length}
                /500
              </Heading>
              <View>
                <TextInput
                  numberOfLines={5}
                  multiline
                  placeholder="Feel free to elaborate here"
                  placeholderTextColor={Colors.inactiveText}
                  style={{
                    alignSelf: "center",
                    width: width - 40,
                    height: 60,
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    color: Colors.black,
                    borderBottomColor: Colors.inactiveText,
                    borderBottomWidth: 1,
                  }}
                  maxLength={500}
                  value={reasonDescription}
                  onChangeText={(value) => setReasonDescription(value)}
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  blurOnSubmit
                />
              </View>
            </View>

            <View style={{ marginHorizontal: 40, marginTop: 20 }}>
              <CheckBoxSquare
                label={`Block ${name}`}
                active={isBlock}
                onChange={() => setIsBlock(!isBlock)}
              />
              <Label size="medium">
                *Learn more about{" "}
                <TouchableOpacity
                  style={{ marginBottom: -3 }}
                  onPress={() => setShowBoostModal(true)}
                >
                  <Label size="medium" type="link">
                    blocking
                  </Label>
                </TouchableOpacity>{" "}
                means
              </Label>
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
                <Text
                  style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}
                >
                  Terms of Use
                </Text>
                <Text></Text>
                <Text></Text>
              </View>
              {/*Header end*/}
              <ScrollView>
                <View>
                  <View style={styles.modalContentContainer}>
                    <RenderHtml contentWidth={width} source={source} />
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </Modal>
          {/*Modal End*/}
        </KeyboardAvoidingView>
      </SafeAreaView>
      <FooterAction
        mainButtonProperties={{
          label: reportType,
          disabled: isDisabledBtn,
          onPress: () => {
            onSendReport();
          },
        }}
      />
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default ReportScreen;
