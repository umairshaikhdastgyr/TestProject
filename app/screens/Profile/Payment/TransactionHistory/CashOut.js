import React from "react";
import { View, Text } from "react-native";
import { Fonts } from "#themes";

import moment from "moment";

const CashOut = ({ item, index }) => {
  return (
    <View
      key={item + index}
      style={{
        flexDirection: "column",
        borderBottomColor: "#00000060",
        borderBottomWidth: 0.5,
        paddingBottom: 10,
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          fontFamily: Fonts.family.semiBold,
          fontSize: 16,
          marginBottom: 4,
        }}
      >
        {moment(item?.created * 1000).format("MMM DD, yyyy")}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.family.regular,
            fontSize: 16,
          }}
        >
          Cash out amount:{" "}
        </Text>
        <Text
          style={{
            fontFamily: Fonts.family.regular,
            fontSize: 16,
          }}
        >{`$${item?.amount / 100}`}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.family.regular,
            fontSize: 16,
          }}
        >
          Status: {item?.status}
        </Text>
        <Text
          style={{
            fontFamily: Fonts.family.regular,
            fontSize: 16,
          }}
        >
          {!item?.arrival_date
            ? "TBD"
            : moment(item?.arrival_date * 1000).format("MMM DD,yyyy")}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.family.regular,
            fontSize: 16,
          }}
        >
          Trace ID:
        </Text>
        <Text
          style={{
            fontFamily: Fonts.family.regular,
            fontSize: 16,
          }}
        >
          {" "}
          {item?.id}
        </Text>
      </View>
    </View>
  );
};

export default CashOut;
