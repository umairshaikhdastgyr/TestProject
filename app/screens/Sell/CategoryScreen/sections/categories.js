import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { View, ScrollView } from 'react-native';
import { Heading, CategoryTag } from '#components';

import styles from './styles';

import { selectCategoriesData } from '#modules/Categories/selectors';
import { selectSellData } from '#modules/Sell/selectors';
import { setFormValue, changePostDetail } from '#modules/Sell/actions';
import { useActions } from '#utils';
import { flex } from '#styles/utilities';

const CategoriesSection = ({ fromEditor }) => {
  /* Selectors */
  const { categoriesList } = useSelector(selectCategoriesData());
  const { formData } = useSelector(selectSellData());

  /* Actions */
  const actions = useActions({ setFormValue, changePostDetail });

  /* States */
  const [categoriesParsed, setCategoriesParsed] = useState([]);

  /* Effects */
  useEffect(() => parseCategoriesValues(), []);

  useEffect(() => setDefaultCategory(), [categoriesParsed]);

  /* Methods */
  const parseCategoriesValues = () => {
    const categoriesListToSet = [...categoriesList].filter(
      ({ name }) => name !== 'Vehicles',
    );
    setCategoriesParsed(categoriesListToSet);
  };

  const setDefaultCategory = () => {
    if (
      categoriesParsed.length > 0 &&
      (!formData?.category?.id || formData?.category?.name === 'Vehicles')
    )
      actions.setFormValue({ category: categoriesParsed[0] });
  };

  const handleCategory = category => {
    if (formData.category.id !== category.id) {
      if (category.childCategory.length > 0) {
        actions.setFormValue({ category, subCategory: {} });
        actions.changePostDetail(true);
      } else {
        actions.setFormValue({ category: category, subCategory: category });
        actions.changePostDetail(true);
      }
    }
  };

  return (
    <View
      style={
        fromEditor ? styles.categoryContainerNoTop : styles.categoryContainer
      }
    >
      {!fromEditor && (
        <View style={[styles.heading, flex.directionRow]}>
          <Heading type="bodyText" bold>
            Category
          </Heading>
          <Heading type="bodyText" style={{ color: 'red' }} bold>
            *
          </Heading>
        </View>
      )}
      <View style={styles.categoriesList}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categoriesParsed.map(category => (
            <CategoryTag
              key={category.id}
              label={category.name}
              icon={category.iconUrl}
              iconActive={category.iconActiveUrl}
              onPress={() => handleCategory(category)}
              active={formData?.category?.id === category?.id}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default CategoriesSection;
