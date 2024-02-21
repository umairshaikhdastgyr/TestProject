import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { LocalStorage } from "#services";

import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import { Heading, BodyText, Icon } from "#components";
import { margins } from "#styles/utilities";

import { selectFiltersData } from "#modules/Filters/selectors";
import { persistFilterValues } from "#modules/Filters/actions";
import { useActions } from "#utils";
import { Colors } from "#themes";

const FilterResults = ({
  setIsFilterFocused,
  searchText,
  persistRecentSearchInStorage,
  loadSearchInStorageChanges,
}) => {
  /* Selectors */
  const { searchTextSuggestions } = useSelector(selectFiltersData());
  /* Actions */
  const actions = useActions({ persistFilterValues });

  /* States */
  const [recentSearches, setRecentSearches] = useState([]);

  /* Effects */
  useEffect(() => {
    getRecentSearchesFromLocalStorage();
  }, []);

  /* Mehtods */
  const getRecentSearchesFromLocalStorage = async () => {
    const recentSearchesInLocal = await LocalStorage.getRecentSearches();

    console.log("recentSearchesInLocal======> ", recentSearchesInLocal);
    setRecentSearches(recentSearchesInLocal || []);
  };
  
  const handlePressRecentSearch = (
    recentSearch,
    categoryId = null,
    categoryName = null
  ) => {
    setIsFilterFocused(false);
    if (categoryId !== null) {
      let categoryObj = {};
      categoryObj.id = categoryId;
      categoryObj.name = categoryName;
      categoryObj.childCategory = [];
      actions.persistFilterValues({
        searchText: recentSearch,
        category: categoryObj,
        subCategories: [], subCategoriesChilds: [] 
      });
      console.log("categoryObj=categoryObj==> ", categoryObj);
      persistRecentSearchInStorage({
        searchText: recentSearch,
        category: categoryObj,
        subCategories: [], subCategoriesChilds: [] 
      });
    } else {
      actions.persistFilterValues({ searchText: recentSearch });
      persistRecentSearchInStorage(recentSearch);
    }

    Keyboard.dismiss();
  };

  const handleDeleteRecentSearch = (index) => {
    const recentSearchesToSet = [...recentSearches].filter(
      (search, indexSearch) => index !== indexSearch
    );
    setRecentSearches(recentSearchesToSet);
    LocalStorage.setRecentSearches(recentSearchesToSet);
    loadSearchInStorageChanges(recentSearchesToSet);
  };

  console.log("recentSearches===> ", recentSearches);

  return (
    <ScrollView
      style={styles.container}
      keyboardDismissMode={"on-drag"}
      keyboardShouldPersistTaps={"handled"}
    >
      {Boolean(searchText) && (
        <>
          <View style={styles.titleWrapper}>
            <Heading type="bodyText" bold>
              Suggestions
            </Heading>
          </View>
          <View style={styles.body}>
            {!searchTextSuggestions.isFetching &&
              searchTextSuggestions?.list?.length === 0 && (
                <BodyText size="medium" style={margins["mb-3"]}>
                  No suggestion for {searchText}...
                </BodyText>
              )}
            {searchTextSuggestions?.list?.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (
                    suggestion[
                      "Product.Category.ParentCategory.ParentCategory.name"
                    ] !== null
                  ) {
                    handlePressRecentSearch(
                      suggestion.text_grouped,
                      suggestion[
                        "Product.Category.ParentCategory.ParentCategory.id"
                      ],
                      suggestion[
                        "Product.Category.ParentCategory.ParentCategory.name"
                      ]
                    );
                  } else {
                    handlePressRecentSearch(
                      suggestion.text_grouped,
                      suggestion["Product.Category.ParentCategory.id"],
                      suggestion["Product.Category.ParentCategory.name"]
                    );
                  }
                }}
                style={[margins["mb-3"], { flexDirection: "row" }]}
              >
                <BodyText size="medium">{suggestion.text_grouped}</BodyText>
                {suggestion[
                  "Product.Category.ParentCategory.ParentCategory.name"
                ] !== null && (
                  <BodyText size="medium" style={styles.categoryText}>
                    {" "}
                    in{" "}
                    {
                      suggestion[
                        "Product.Category.ParentCategory.ParentCategory.name"
                      ]
                    }
                  </BodyText>
                )}
                {suggestion[
                  "Product.Category.ParentCategory.ParentCategory.name"
                ] === null && (
                  <BodyText size="medium" style={styles.categoryText}>
                    {" "}
                    in {suggestion["Product.Category.ParentCategory.name"]}
                  </BodyText>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <View style={styles.titleWrapper}>
        <Heading type="bodyText" bold>
          Recent Searches
        </Heading>
      </View>
      <View style={styles.body}>
        {recentSearches.length === 0 && (
          <BodyText size="medium">No recents searches...</BodyText>
        )}
        {recentSearches.map((search, index) => (
          <View key={index} style={styles.recentSearchItem}>
            <TouchableOpacity
              style={styles.recentSearchItem__icon}
              onPress={() => handleDeleteRecentSearch(index)}
            >
              <Icon icon="close" size="small" color="grey" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: 5 }}
              onPress={() => {
                if (typeof search == "string") {
                  handlePressRecentSearch(search);
                } else {
                  handlePressRecentSearch(
                    search?.searchText,
                    search?.category.id,
                    search?.category.name
                  );
                }
              }}
            >
              <BodyText size="medium">
                {typeof search === "string" ? search : search?.searchText}
              </BodyText>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  titleWrapper: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 14,
    backgroundColor: Colors.lightGrey,
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    paddingBottom: 4,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  recentSearchItem__icon: {
    marginRight: 24,
    padding: 5,
  },
  categoryText: {
    color: "#999999",
    marginLeft: 20,
  },
});

export default FilterResults;
