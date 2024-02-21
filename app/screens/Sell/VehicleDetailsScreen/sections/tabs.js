import React from 'react';

import { StyleSheet, View, ScrollView } from 'react-native';

import { Tab } from '#components';

import { Colors } from '#themes';

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {tabs.map(tab => (
          <Tab
            style={styles.tab}
            key={tab.id}
            label={tab.name}
            active={activeTab === tab.id}
            onPress={() => setActiveTab(tab.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

Tabs.defaultProps = {
  tabs: [],
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: Colors.grey,
  },
  tabs: {
    paddingLeft: 20,
    paddingTop: 8,
  },
  tab: {
    marginRight: 28,
  },
});

export default Tabs;
