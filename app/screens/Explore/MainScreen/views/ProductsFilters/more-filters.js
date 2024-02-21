import React from "react";
import { useSelector } from "react-redux";
import { TouchableOpacity, Animated, Dimensions } from "react-native";

import { Icon, BodyText } from "#components";
import { selectFiltersData } from "#modules/Filters/selectors";
import styles from "./styles.js";

const MoreFilters = ({ navigation, heightAnimated }) => {
  /* Selectors */
  const { filterValues } = useSelector(selectFiltersData());

  return (
    <Animated.View
      style={{
        ...styles.moreFilters,
        ...{
          transform: [{ translateY: heightAnimated }],
          ...{ top: filterValues?.subCategories?.length === 0 ? 94 : 4 },
        },
      }}
    >
      <TouchableOpacity
        style={styles.moreFilters__button}
        onPress={() => navigation.navigate("Filter")}
      >
        <Icon
          icon="filter"
          color="grey"
          style={styles.moreFilters__iconFilter}
        />
        <BodyText>Filter</BodyText>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.moreFilters__button}
        onPress={() =>
          navigation.navigate("FilterSearchLocation", { persistDirectly: true })
        }
      >
        <Icon icon="localization" style={styles.moreFilters__iconLocation} />
        <BodyText
          theme="link"
          numberOfLines={1}
          style={{ maxWidth: Dimensions.get("window").width * 0.6 }}
        >
          {filterValues?.location?.formattedAddress
            ? `${filterValues?.location?.city} ${
                filterValues?.location?.city ? "," : ""
              } ${filterValues?.location?.state}`
            : "Location"}
        </BodyText>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default MoreFilters;
