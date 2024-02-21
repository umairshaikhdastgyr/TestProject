import React, { useState } from "react";

import { StyleSheet, View, ScrollView } from "react-native";
import { Tag, Loader } from "#components";
import TagTypeOptionsFilter from "./tag-type-options-filter";

import { paddings } from "#styles/utilities";

const TagTypeOptions = ({
  name,
  value,
  setFilterValue,
  isFetching,
  options
}) => {
  /* States */
  const [filterText, setFilterText] = useState("");

  return (
    <>
      <TagTypeOptionsFilter value={filterText} setValue={setFilterText} />
      <ScrollView contentContainerStyle={paddings["px-4"]}>
        <View style={styles.container}>
          {isFetching && <Loader />}
          {!isFetching &&
            options.map(option => (
              <Tag
                key={option.name}
                label={option.name?.toUpperCase()}
                active={value === option.id}
                onPress={() => {}}
                style={
                  filterText &&
                  option.name.toUpperCase().search(filterText.toUpperCase()) &&
                  styles.hideTag
                }
              />
            ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  hideTag: {
    display: "none"
  }
});

export default TagTypeOptions;
