import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tab } from '#components';

const Tabs = ({ tabs, activeTab, setActiveTab, spaceEvenly = false }) => {
  return (
    <View style={styles.tabs}>
      {tabs.map((tab, index) => {
        if(index==5){
          return null;
        }
        return(
        <Tab
          style={{
            ...styles.tab,
            ...(index === 0 && styles.firstTab),
            ...(spaceEvenly && styles.addMargin),
          }}
          key={tab.id}
          label={tab.name}
          active={activeTab === tab.id}
          onPress={() => setActiveTab(tab.id)}
          spaceEvenly
        />
      )})}
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  firstTab: {
    marginRight: 48,
  },
  addMargin: {
    marginRight: 20,
  },
});

export default Tabs;
