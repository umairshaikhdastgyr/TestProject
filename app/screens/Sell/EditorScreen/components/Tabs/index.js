import React, { useState, useEffect } from 'react';
import { startCase } from 'lodash';

import { ScrollView, View } from 'react-native';
import { Tab } from '#components';
import { paddings, margins } from '#styles/utilities';

const AddFilterTabs = ({ properties, activeTab, setActiveTab }) => {
  /* States */
  const [tabs, setTabs] = useState([]);

  /* Effects */
  useEffect(() => {
    parseTabs();
  }, [properties]);

  /* Methods */
  const parseTabs = () => {
    const tabsToSet = [];
    properties.forEach(property => {
      tabsToSet.push(property);
    });
    setTabs(tabsToSet);
  };

  return (
    <View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentInset={{ right: 32 }}
        style={paddings['px-4']}
      >
        {tabs.map(property => (
          <Tab
            key={property.name}
            label={startCase(property.name)}
            style={margins['mr-5']}
            active={property.name === activeTab}
            onPress={() => setActiveTab(property.name)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default AddFilterTabs;
