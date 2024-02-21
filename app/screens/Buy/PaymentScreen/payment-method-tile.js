import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { BodyText, Icon, CheckBoxSquare } from "#components";
import styles from "./styles";
import { Fonts, Colors } from "#themes";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const PaymentMethodTile = ({
  onPress,
  defaultChange,
  item,
  title,
  icon,
  type,
  defaultState,
  tile,
  onEdit,
  showSideArrow,
  googleDefault
}) => (
  <TouchableOpacity activeOpacity={0.4} onPress={onPress}>
    <View
      style={[
        styles.container,
        { opacity: 1, borderBottomWidth: showSideArrow ? 0 : 1 },
      ]}
    >
      <View style={{ flexDirection: "row", width: "100%" }}>
        <View style={styles.leftContainer}>
          {title === "Google pay" ? (
            <MaterialCommunityIcons
              style={{ top: -3 }}
              size={23}
              name="google"
            />
          ) : (icon === "visa" || icon === "mastercard" || icon === "discover"  || icon === "amex" || icon === "paypal") ? (
            <FontAwesome
              style={{ top: -3 }}
              color="#3F5AA9"
              size={23}
              name={`cc-${icon}`}
            />
          ) : (
            <FontAwesome
            style={{ top: -3 }}
            color="#3F5AA9"
            size={23}
            name={`credit-card`}
          />
          )}
        </View>
        <View style={styles.rightContainer}>
          <BodyText
            theme="medium"
            bold={item?.metadata?.isDefault=='true'}
            align="left"
            numberOfLines={1}
            style={[
              styles.titleText,
              item?.metadata?.isDefault=='true' ? styles.titleSelected : "",
            ]}
          >
            {title}
          </BodyText>
          {googleDefault && (
            <BodyText
              theme="medium"
              align="left"
              numberOfLines={1}
              style={{ color: "grey", fontSize: 12 }}
            >
              {"Default"}
            </BodyText>
          )}
          {item?.metadata?.isDefault=='true' && (
            <BodyText
              theme="medium"
              align="left"
              numberOfLines={1}
              style={{ color: "grey", fontSize: 12 }}
            >
              {"Default"}
            </BodyText>
          )}
        </View>
        {type === "default" ? (
          <View style={styles.arrowContainer}>
            {defaultState.state !== tile && <Icon icon="chevron-right" />}
            {defaultState.state === tile && <Icon icon="chevron-down" />}
          </View>
        ) : (
          showSideArrow && (
            <View style={styles.arrowContainer}>
              <Icon icon="chevron-right" />
            </View>
          )
        )}
      </View>
      {type === "default" && defaultState.state === tile && (
        <View style={{ width: "100%" }}>
          {typeof onEdit === "function" && (
            <TouchableOpacity
              style={{ marginTop: 20, paddingLeft: 40 }}
              onPress={onEdit}
            >
              <Text
                style={{
                  fontFamily: Fonts.family.regular,
                  fontSize: 15,
                  color: Colors.black,
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          )}
          <CheckBoxSquare
            containerStyle={{ marginBottom: 0, marginTop: 20, paddingLeft: 40 }}
            label="Pay with this"
            active={defaultState.default === tile}
            onChange={defaultChange}
          />
        </View>
      )}
    </View>
  </TouchableOpacity>
);

export default PaymentMethodTile;
