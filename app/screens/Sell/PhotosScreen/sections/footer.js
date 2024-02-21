import React from 'react';

import { StyleSheet, View } from 'react-native';

import { Tab } from '#components';

const Footer = ({ tabs, activeTab, setActiveTab }) => (
  <View style={styles.container}>
    {tabs.map(tab => (
      <Tab
        key={tab.id}
        label={tab.name}
        active={tab.id === activeTab}
        theme="primary"
        style={styles.tab}
        onPress={() => setActiveTab(tab.id)}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
  },
});

export default Footer;
