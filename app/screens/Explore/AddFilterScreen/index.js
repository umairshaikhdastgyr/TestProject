import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { SafeAreaView } from 'react-native';

import Header from './views/Header';
import Tabs from './views/Tabs';
import PropertySection from './views/PropertySection';
import Footer from './views/Footer';
import { flex, safeAreaNotchHelper } from '#styles/utilities';

import { selectFiltersData } from '#modules/Filters/selectors';
import { persistPropertiesValues } from '#modules/Filters/actions';
import { useActions } from '#utils';

const AddFilterScreen = ({ navigation, route }) => {
  /* Selectors */
  const { properties, propertiesValues } = useSelector(selectFiltersData());

  /* Actions */
  const actions = useActions({ persistPropertiesValues });

  /* States */
  const [activeTab, setActiveTab] = useState(route?.params?.tabName);
  const [addFilterValues, setAddFilterValues] = useState({});
  // const [isDefaultSet, setIsDefaultSet] = useState(false);

  /* Effects */
  useEffect(() => {
    setDefaultFilters();
  }, []);

  /* Methods */
  const setDefaultFilters = () => {
    setAddFilterValues({ ...propertiesValues });
    // setIsDefaultSet(true);
  };

  const setFilterValue = newValue => {
    setAddFilterValues({
      ...addFilterValues,
      ...newValue,
    });
  };

  const handlePersistAddFilters = () => {
    actions.persistPropertiesValues(addFilterValues);
    navigation.goBack();
  };

  return (
    <>
      <SafeAreaView style={flex.grow1}>
        <Tabs
          properties={properties}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filterValues={addFilterValues}
        />
        {Object.keys(addFilterValues).length > 0 && (
          <>
            {properties.map(
              property =>
                activeTab === property.name && (
                  <PropertySection
                    key={property.name}
                    property={property}
                    values={addFilterValues[property.name]}
                    setFilterValue={setFilterValue}
                  />
                ),
            )}
          </>
        )}
        {activeTab === 'model' && (
          <PropertySection
            key={'model'}
            property={{ name: 'model', type: 'tags' }}
            valuesToCall={addFilterValues.make || []}
            values={addFilterValues.model || []}
            setFilterValue={setFilterValue}
          />
        )}
        <Footer handlePersistAddFilters={handlePersistAddFilters} />
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default AddFilterScreen;
