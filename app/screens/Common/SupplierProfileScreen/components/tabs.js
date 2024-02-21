import React from 'react';

import { StyleSheet, View } from 'react-native';
import { Tab } from '#components';
import { flex } from '#styles/utilities';
import { Fonts } from '#themes';

const Header = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <View style={styles.tabs}>
      {tabs.map((tab, index) => (
        <Tab
          style={{ ...styles.tab, ...(index === 0 && styles.firstTab) }}
          key={tab.id}
          label={tab.name}
          active={activeTab === tab.id}
          onPress={() => setActiveTab(tab.id) }
          activeStyle={styles.activeStyle}
          style={[flex.grow1]}
        />
      ))}
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
  activeStyle: {
    fontFamily: Fonts.family.bold,
    fontSize: Fonts.size.medium,
    color: '#00BDAA',
  }
});

export default Header;