import React from 'react';

import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Tab, Icon } from '#components';

const Header = ({
  tabs,
  activeTab,
  setActiveTab,
  openShareAlbumOptions,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {tabs.map(tab => (
          <Tab
            style={styles.tab}
            key={tab.id}
            label={tab.name}
            active={activeTab === tab.id}
            onPress={() => {
              navigation.setParams({ tab: tab.id });
              setActiveTab(tab.id);
            }}
          />
        ))}
      </View>
      {activeTab === 'saved' && (
        <TouchableOpacity onPress={openShareAlbumOptions}>
          <Icon icon="share" color="grey" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingRight: 18,
    paddingTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    marginRight: 28,
  },
});

export default Header;
