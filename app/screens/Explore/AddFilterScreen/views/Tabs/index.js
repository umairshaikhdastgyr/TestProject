import React, { useState, useEffect } from 'react';
import { startCase } from 'lodash';

import { ScrollView, View } from 'react-native';
import { Tab } from '#components';
import { paddings, margins } from '#styles/utilities';

const AddFilterTabs = ({
  properties,
  activeTab,
  setActiveTab,
  filterValues,
  sellMode,
}) => {
  /* States */
  const [tabs, setTabs] = useState([]);

  /* Effects */
  useEffect(() => {
    parseTabs();
  }, [filterValues.make]);

  /* Methods */
  const parseTabs = () => {
    const tabsToSet = [];
    properties.forEach(property => {
      if(sellMode && sellMode === true){
        tabsToSet.push(property);
        if (property.name === 'make' && filterValues.make)
          tabsToSet.push({
            name: 'model',
          });
      } else {
        if(property.hideOnFilters  && property.hideOnFilters === true ){
        } else {
          tabsToSet.push(property);
          if (property.name === 'make' && filterValues.make)
            tabsToSet.push({
              name: 'model',
            });
        }
      }
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
            disabled={
              property.name === 'model' && filterValues.make && filterValues.make.length === 0
            }
            onPress={() => setActiveTab(property.name)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default AddFilterTabs;
