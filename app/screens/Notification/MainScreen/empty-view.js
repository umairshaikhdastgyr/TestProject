import React from "react";

import { StyleSheet, View, Dimensions } from "react-native";
import { EmptyState, Button } from "#components";

const SCREEN_HEIGHT = Dimensions.get("window").height - 350;

const EmptyView = () => {
  return (
    <View style={[styles.container, { height: SCREEN_HEIGHT }]}>
      <EmptyState
        icon="notification"
        text="You have no notifications yet"
        style={styles.emptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    justifyContent: "center"
  },
  emptyState: {
    marginBottom: 24
  },
  createButton: {
    marginBottom: 27
  }
});

export default EmptyView;
