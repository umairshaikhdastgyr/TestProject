import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ScrollView, Animated } from 'react-native';
import { Tag } from '#components';
import { paddings, flex, margins } from '#styles/utilities';

import { useActions } from '#utils';
import { selectFiltersData } from '#modules/Filters/selectors';
import { persistFilterValues } from '#modules/Filters/actions';

const SelectedFilters = ({ propStyle, getFiltersCount, setIsGetPostData }) => {
  /* Selectors */
  const { filterValues, defaultValues } = useSelector(selectFiltersData());

  /* Actions */
  const actions = useActions({ persistFilterValues });

  /* States */
  const [filtersToShow, setFiltersToShow] = useState([]);

  /* Effects */
  useEffect(() => {
    parseFiltersToShow();
  }, [filterValues]);

  /* Methods */
  const parseFiltersToShow = () => {
    const {
      distance,
      sortBy,
      delivery: deliveryMethods,
      priceRange,
      subCategories,
      quickDeliveries,
      category,
      searchText,
      customProperties,
    } = filterValues;
    const {
      distance: distanceDefault,
      sortBy: sortByDefault,
      priceRange: priceRangeDefault,
    } = defaultValues;
    const filtersToUpdate = [];

    if (distance[0] !== distanceDefault[0]) {
      filtersToUpdate.push({
        label: `${distance[0]} MILES`,
        value: distance,
        name: 'distance',
      });
    }

    if (sortBy !== sortByDefault) {
      filtersToUpdate.push({
        label: sortBy.toUpperCase(),
        value: sortBy,
        name: 'sortBy',
      });
    }

    if (deliveryMethods.length > 0) {
      deliveryMethods.forEach((delivery) => {
        filtersToUpdate.push({
          label: delivery.name.toUpperCase(),
          value: delivery,
          name: 'delivery',
        });
      });
    }

    if (
      priceRange[0] !== priceRangeDefault[0]
      || priceRange[1] !== priceRangeDefault[1]
    ) {
      filtersToUpdate.push({
        label: `$${priceRange[0] ? parseFloat(priceRange[0]).toFixed(2) : '0.00'} - $${priceRange[1] ? parseFloat(priceRange[1]).toFixed(2) : '0.00'}`,
        value: priceRange,
        name: 'priceRange',
      });
    }

    if (subCategories.length > 0) {
      subCategories.forEach((subCategory) => {
        filtersToUpdate.push({
          label: subCategory.name.toUpperCase(),
          value: subCategory,
          name: 'subCategories',
        });

        /*
        //Base for add items
        if(subCategory.customProperties && subCategory.customProperties.properties && subCategory.customProperties.properties.length > 0){
          subCategory.customProperties.properties.forEach(baseProperty => {
            filtersToUpdate.push({
              label: baseProperty.name.toUpperCase(),
              value: baseProperty,
              name: 'customProperty',
            });
          });
        }
        */
      });
    }

    if (quickDeliveries.length > 0) {
      quickDeliveries.forEach((quickDelivery) => {
        filtersToUpdate.push({
          label: quickDelivery.label.toUpperCase(),
          value: quickDelivery,
          name: 'quickDeliveries',
        });
      });
    }

    // if (Object.keys(category).length > 0 && searchText !== '') {
    if (Object.keys(category).length > 0 && searchText !== '') {

      let categories = category.id;
      if (category.childCategory.length > 0) {
      //   categories = `${categories},${category.childCategory.map((cat) => cat.id).join(',')}`;

      //   for (let i = 0; i < category.childCategory.length; i++) {
      //     if (category.childCategory[i].childCategory && category.childCategory[i].childCategory.length > 0) {
      //       categories = `${categories},${category.childCategory[i].childCategory.map((cat) => cat.id).join(',')}`;
      //     }
      //   }
      }

    if (!subCategories.length > 0) {
      filtersToUpdate.push({
        label: category.name.toUpperCase(),
        value: categories,
        name: 'category',
      });
    }
    }


    getFiltersCount(filtersToUpdate.length);

    setFiltersToShow(filtersToUpdate);
  };

  const handleClearTag = (name, value) => {
    if (name === 'subCategories') {
      let subCategoriesChildsToUpdate = [...filterValues.subCategoriesChilds];
      const categoryDetails = [...filterValues.subCategories].find(
        ({ id }) => id === value.id,
      );
      if (categoryDetails) {
        categoryDetails.childCategory.forEach((child) => {
          subCategoriesChildsToUpdate = subCategoriesChildsToUpdate.filter(
            ({ id }) => id !== child.id,
          );
        });
      }
      const valuesToUpdate = [...filterValues.subCategories].filter(
        (subCategory) => subCategory.id !== value.id,
      );
      actions.persistFilterValues({
        subCategories: valuesToUpdate,
        subCategoriesChilds: subCategoriesChildsToUpdate,
      });
    } else if (name === 'delivery') {
      const deliveryToUpdate = [...filterValues.delivery].filter(
        ({ id }) => id !== value.id,
      );
      actions.persistFilterValues({ [name]: deliveryToUpdate });
    } else if (name === 'quickDeliveries') {
      actions.persistFilterValues({
        quickDeliveries: [],
      });
    } else if (name === 'category') {
      actions.persistFilterValues({
        category: {},
        quickDeliveries: [],
      });
    } else {
      actions.persistFilterValues({ [name]: defaultValues[name] });
    }
    setIsGetPostData(true);
  };

  return (
    <Animated.ScrollView
      style={propStyle}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={
        filtersToShow.length > 0 && {
          ...paddings['px-3'],
          ...paddings['py-2'],
          ...flex.directionRow,
        }
      }
      contentInset={{ right: 32 }}
    >
      {filtersToShow.map((filter, index) => (
        <Tag
          key={index}
          label={filter.label}
          subSubCat={filter?.value?.childCategory}
          category={filterValues}
          active
          clear
          onPress={() => handleClearTag(filter.name, filter.value)}
          style={margins['mb-0']}
        />
      ))}
    </Animated.ScrollView>
  );
};

export default SelectedFilters;
