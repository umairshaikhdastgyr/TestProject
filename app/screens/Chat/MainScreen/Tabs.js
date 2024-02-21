import React from 'react';

import { StyleSheet, View } from 'react-native';
import { Tab } from '#components';

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <View style={styles.tabs}>
      {tabs.map((tab, index) => (
        <Tab
          style={{ ...styles.tab, ...((index === 0 || index === 1) && styles.firstTab) }}
          key={tab.id}
          label={tab.name}
          active={activeTab === tab.id}
          onPress={() => setActiveTab(tab.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  firstTab: {
    //marginRight: 48,
  },
});

export default Tabs;
