import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { BodyText, Icon } from '#components';

import styles from './styles';

import { SelectFilter } from '#screens/Explore/FilterScreen/components';

const VehicleList = ({ navigation, formData, fromScreen }) => {
  const [otherOptions, setOtherOptions] = useState(false);

  const handlePressAddFilters = (property, isMain) => {
    if (isMain === true) {
      navigation.navigate(
        fromScreen === 'profile'
          ? 'PF_VehicleDetails_MainDetailsToAdd'
          : 'VehicleDetails_MainDetailsToAdd',
        {
          tabName: property.name,
          properties: formData.subCategory.customProperties.properties.filter(
            item => item.isMain === true,
          ),
        },
      );
    } else {
      navigation.navigate(
        fromScreen === 'profile'
          ? 'PF_VehicleDetails_AdditionalDetailsToAdd'
          : 'VehicleDetails_AdditionalDetailsToAdd',
        {
          tabName: property.name,
          properties: formData.subCategory.customProperties.properties.filter(
            item => item.isMain === false,
          ),
        },
      );
    }
  };

  const renderProperty = (property, isMain) => {
    if (
      [
        'list',
        'tags',
        'string',
        'color-list',
        'vertical-list',
        'integer',
        'year-integer',
      ].includes(property.type)
    ) {
      return (
        <View style={{ flex: 1 }} key={property?.name}>
          <SelectFilter
            key={property.name}
            title={property.name}
            values={
              formData.customProperties[property.name]
                ? formData.customProperties[property.name].name
                : ''
            }
            placeholder={'Choose an option'}
            onPress={() => {
              handlePressAddFilters(property, isMain);
            }}
            bottomLine={false}
          />
          {property.name === 'make' && (
            <SelectFilter
              key="model"
              title="model"
              values={
                formData.customProperties.model
                  ? formData.customProperties.model.name
                  : ''
              }
              placeholder="Choose an option"
              disabled={!formData.customProperties.make}
              onPress={() => handlePressAddFilters({ name: 'model' }, isMain)}
              bottomLine={false}
            />
          )}
        </View>
      );
    }
  };

  return (
    <ScrollView>
      {formData.subCategory &&
        formData.subCategory.customProperties &&
        formData.subCategory.customProperties.properties &&
        formData.subCategory.customProperties.properties
          .filter(item => item.isMain === true)
          .map(property => renderProperty(property, true))}

      <TouchableOpacity
        activeOpacity={0.4}
        onPress={() => {
          setOtherOptions(!otherOptions);
        }}
      >
        <View style={[styles.containerMore]}>
          <View style={styles.leftContainer}>
            <BodyText
              theme={'medium'}
              bold={true}
              align={'left'}
              numberOfLines={1}
              style={styles.titleText}
            >
              Additional Fields
            </BodyText>
          </View>
          <View style={styles.arrowContainer}>
            {otherOptions === false && <Icon icon={'chevron-right'} />}
            {otherOptions === true && <Icon icon={'chevron-down'} />}
          </View>
        </View>
      </TouchableOpacity>

      {otherOptions === true &&
        formData.subCategory &&
        formData.subCategory.customProperties &&
        formData.subCategory.customProperties.properties &&
        formData.subCategory.customProperties.properties
          .filter(item => item.isMain === false)
          .map(property => renderProperty(property, false))}
    </ScrollView>
  );
};

export default VehicleList;
