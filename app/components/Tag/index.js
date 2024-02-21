import React from "react";

import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { Icon } from "#components";
import { Colors, Fonts } from "#themes";

const Tag = ({ label, active, onPress, clear, style, subSubCat, category }) => {
  const subSubCategories = category?.subCategoriesChilds?.map(
    (data) => data?.id
  );

  const subCategory = () => {
    let arrSubCat = [];
    
      subSubCat?.map((item, index) => {
        {
          subSubCategories?.includes(item?.id)
            ? (arrSubCat = [...arrSubCat, item?.name])
            : null;
        }
      });
    
    return arrSubCat;
  };

  return (
    <TouchableOpacity
      style={{ ...styles.tag, ...(active && styles.tagActive), ...style }}
      onPress={onPress}
    >
      <Text style={{ ...styles.tag__text, ...(active && styles.textActive) }}>
        {label}{" "}
      </Text>
      {subCategory()?.length > 0 && (
        <Text
          style={{
            ...styles.tag__text,
            ...(active && styles.textActive),
          }}
        >
          ({subCategory()?.join(", ")})
        </Text>
      )}
      {clear && <Icon icon="close" size="xx-small" style={styles.close} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tag: {
    height: 40,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.inactiveText,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    marginRight: 14,
    marginBottom: 14,
    flexDirection: "row",
  },
  tagActive: {
    borderColor: "white",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 3,
  },
  tag__text: {
    fontFamily: Fonts.family.regular,
    fontSize: 10,
    fontWeight: "600",
    color: Colors.inactiveText,
  },
  textActive: {
    color: Colors.active,
  },
  close: {
    marginLeft: 10,
  },
});

export default Tag;
