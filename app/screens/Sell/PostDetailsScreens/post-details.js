import React from "react";

import { ScrollView, View, Text } from "react-native";
import {
  Heading,
  CustomSelectInput,
  RangeSliderInput,
  BodyText,
} from "#components";
import styles from "./styles";
import { Colors, Fonts } from "#themes";
import { flex } from "#styles/utilities";
import { changePostDetail } from "#modules/Sell/actions";
import { useDispatch } from "react-redux";

const PostDetails = ({ navigation, formData, setFormValue, fromScreen }) => {
  const dispatch = useDispatch();
  return (
    <ScrollView>
      <View style={styles["section-container"]}>
        <View style={styles["header-title-count"]}>
          <View style={[flex.directionRow]}>
            <Heading type="bodyText" bold>
              Post Title
            </Heading>
            <Heading type="bodyText" style={{ color: "red" }} bold>
              *
            </Heading>
          </View>

          <Heading type="bodyText" style={{ color: "gray" }}>
            {formData?.postTitle?.length}
            /70
          </Heading>
        </View>
        <CustomSelectInput
          placeholder="Type here"
          value={formData?.postTitle}
          onPress={() =>
            navigation.navigate(
              fromScreen === "profile"
                ? "PF_PostDetails_PostTitle"
                : "PostDetails_PostTitle"
            )
          }
          showActionButton={false}
          bottomLine={false}
        />
      </View>
      <View style={styles["section-container"]}>
        <View style={styles["header-title-count"]}>
          <View style={[flex.directionRow]}>
            <Heading type="bodyText" bold>
              Post Description
            </Heading>
            <Heading style={{ color: "red" }} type="bodyText" bold>
              *
            </Heading>
          </View>

          <Heading type="bodyText" style={{ color: "gray" }}>
            {formData?.postDescription?.length}
            /1500
          </Heading>
        </View>
        <CustomSelectInput
          placeholder="Type here"
          value={formData?.postDescription}
          onPress={() =>
            navigation.navigate(
              fromScreen === "profile"
                ? "PF_PostDetails_PostDescription"
                : "PostDetails_PostDescription"
            )
          }
          showActionButton={false}
          numberOfLines={3}
          bottomLine={false}
        />
      </View>
      <View style={styles["section-container"]}>
        <View style={[flex.directionRow]}>
          <Heading type="bodyText" bold>
            Item Location
          </Heading>
          <Heading style={{ color: "red" }} type="bodyText" bold>
            *
          </Heading>
        </View>
        <CustomSelectInput
          placeholder="Tap to Choose Location"
          value={formData.location.formattedAddress}
          onPress={() =>
            navigation.navigate(
              fromScreen === "profile"
                ? "PF_PostDetails_PostLocation"
                : "PostDetails_PostLocation"
            )
          }
          showActionButton={false}
          bottomLine={false}
        />
        {formData?.locationIsChanged && (
          <Text
            style={{
              color: Colors.alert,
              ...Fonts.style.homiTagText,
              textAlign: "center",
            }}
          >
            Delivery methods is reset, please choose delivery methods according
            to your chosen price
          </Text>
        )}
      </View>
      <View
        style={[
          styles["section-container"],
          styles["section-container-condition"],
        ]}
      >
        <View style={[styles["condition-header"], flex.directionRow]}>
          <Heading type="bodyText" bold>
            Condition
          </Heading>
          <Heading style={{ color: "red" }} type="bodyText" bold>
            *
          </Heading>
        </View>
        <View style={{ marginLeft: 2 }}>
          <RangeSliderInput
            min={1}
            max={5}
            step={1}
            values={formData.condition}
            onValuesChange={(value) => {
              setFormValue({ ...formData, condition: value });
              dispatch(changePostDetail(true));
            }}
          />
        </View>
        <View style={styles["condition-labels"]}>
          <BodyText
            style={[
              styles["condition-label"],
              formData.condition[0] === 1 ? styles.activeText : "",
            ]}
            theme="inactive"
            align="left"
          >
            New
          </BodyText>
          <BodyText
            style={[
              styles["condition-label"],
              formData.condition[0] === 2 ? styles.activeText : "",
            ]}
            theme="inactive"
            align="left"
          >
            Like new
          </BodyText>
          <BodyText
            style={[
              styles["condition-label"],
              formData.condition[0] === 3 ? styles.activeText : "",
            ]}
            theme="inactive"
            align="center"
          >
            Never used
          </BodyText>
          <BodyText
            style={[
              styles["condition-label"],
              formData.condition[0] === 4 ? styles.activeText : "",
            ]}
            theme="inactive"
            align="center"
          >
            Used
          </BodyText>
          <BodyText
            style={[
              styles["condition-label"],
              formData.condition[0] === 5 ? styles.activeText : "",
            ]}
            theme="inactive"
            align="right"
          >
            Acceptable
          </BodyText>
        </View>
      </View>
    </ScrollView>
  );
};

export default PostDetails;
