import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ScrollView, Animated } from "react-native";
import { CategoryTag } from "#components";
import styles from "./styles";

import { selectCategoriesData } from "#modules/Categories/selectors";
import { selectFiltersData } from "#modules/Filters/selectors";

import { persistFilterValues } from "#modules/Filters/actions";
import { useActions } from "#utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getExploreCategories } from "#modules/Categories/actions";
import { isJsonString } from "#constants";

const Categories = ({
  categoriesAnimation,
  setIsGetPostData,
}) => {
  const dispatch = useDispatch();
  /* Selectors */
  const { categoriesList } = useSelector(selectCategoriesData());
  const { filterValues } = useSelector(selectFiltersData());

  /* Actions */
  const actions = useActions({ persistFilterValues });

  useEffect(() => {
    if (categoriesList?.length > 0) {
      saveToStorage(categoriesList);
    }
  }, [categoriesList]);

  useEffect(() => {
    checkCategoryListData();
  }, []);

  const saveToStorage = async (data = []) => {
    try {
      await AsyncStorage.setItem("@category-list", JSON.stringify(data));
    } catch (error) {
      console.log({ error });
    }
  };

  const checkCategoryListData = async () => {
    try {
      const exploreCategoryData = await AsyncStorage.getItem("@category-list");
      if (isJsonString(exploreCategoryData)) {
        if (
          exploreCategoryData !== null &&
          JSON.parse(exploreCategoryData)?.length > 0
        ) {
          dispatch(getExploreCategories(JSON.parse(exploreCategoryData)));
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Animated.View
      style={{
        ...styles.animatedContainer,
        ...{ transform: [{ translateY: categoriesAnimation }] },
      }}
    >
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        {categoriesList?.map((category) => {
          if (category?.name == "Vehicles") {
            return null;
          }
          return (
            <CategoryTag
              key={category.id}
              label={category.name}
              icon={category.iconUrl}
              iconActive={category.iconActiveUrl}
              onPress={() => {
                actions.persistFilterValues(
                  filterValues.category.id !== category.id
                    ? { category, subCategories: [], subCategoriesChilds: [] }
                    : {
                        category: {},
                        subCategories: [],
                        subCategoriesChilds: [],
                      }
                );
                if ((filterValues.category.id !== category.id) == false) {
                  setIsGetPostData(true);
                }
              }}
              active={filterValues.category.id === category.id}
            />
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

export default Categories;
