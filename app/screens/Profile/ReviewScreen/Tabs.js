import React from 'react';

import { StyleSheet, View } from 'react-native';
import { Tab } from '#components';

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <View style={styles.tabs}>
      {tabs.map((tab, index) => {
        let style = {};
        if (index === 0 || index === 1) {
          style = styles.firstTab;
        }
        return (
          <Tab
            style={style}
            key={tab.id}
            label={tab.name}
            active={activeTab === tab.id}
            onPress={() => setActiveTab(tab.id)}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  firstTab: {
    marginRight: 30,
  },
});

export default Tabs;
