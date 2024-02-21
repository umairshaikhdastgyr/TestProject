import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LocalStorage } from "#services";

import {
  View,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { Icon } from "#components";
import FilterResults from "./filter-results";
import QuickDeliveryMethodsPicker from "./quick-delivery-methods-picker";

import styles from "./styles.js";

import { selectFiltersData } from "#modules/Filters/selectors";
import {
  persistFilterValues,
  getSearchTextSuggestions,
} from "#modules/Filters/actions";
import NotificationBell from "./notification-bell";
import { isEmpty } from "lodash";

const FilterInput = ({
  onFocus,
  isFilterFocused,
  setIsFilterFocused,
  filtersCount,
  navigation,
  notificationCount,
  setIsGetPostData,
}) => {
  /* Selectors */
  const { filterValues } = useSelector(selectFiltersData());

  const dispatch = useDispatch();

  /* States */
  const [searchText, setSearchText] = useState("");
  const [recentSearchesInStorage, setRecentSearchesInStorage] = useState([]);

  /* Effects */
  useEffect(() => {
    getRecentSearchesFromLocalStorage();
  }, []);

  useEffect(() => {
    setSearchText(filterValues.searchText);
    setFilterValueState(filterValues);
  }, [filterValues]);

  // useEffect(() => {
  //   if (searchText && isFilterFocused) {
  //     dispatch(
  //       getSearchTextSuggestions({ searchText: searchText.replace("'", "’") })
  //     );
  //   }
  // }, [searchText, isFilterFocused, dispatch]);

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 1000);
    };
  };

  const handleChange = (value) => {
    dispatch(
      getSearchTextSuggestions({ searchText: value?.replace("'", "’") })
    );
  };

  const handleSearchDebounce = useCallback(debounce(handleChange), []);

  /* Methods */
  const getRecentSearchesFromLocalStorage = async () => {
    const data = await LocalStorage.getRecentSearches();
    // console.log("data======> ", data);
    setRecentSearchesInStorage(data || []);
  };

  const [filterValueState, setFilterValueState] = useState(null);

  const handleCloseSearchView = () => {
    setFilterValueState(filterValues);
    if (searchText === "") {
      // setSearchText("");

      if (
        (!isEmpty(filterValues?.category) &&
          isEmpty(filterValueState?.category)) ||
        (isEmpty(filterValues?.category) &&
          !isEmpty(filterValueState?.category)) ||
        filterValues?.subCategories?.length !==
          filterValueState?.subCategories?.length ||
        filterValues?.subCategoriesChilds?.length !==
          filterValueState?.subCategoriesChilds?.length ||
        searchText !== filterValues?.searchText
      ) {
        dispatch(
          persistFilterValues({
            searchText: "",
            category:
              filterValues?.subCategories?.length == 0 &&
              filterValues?.subCategoriesChilds?.length == 0
                ? {}
                : filterValues?.category,
          })
        );
        setIsGetPostData(true);
      }

      Keyboard.dismiss();
      setIsFilterFocused(false);

      return;
    }
    Keyboard.dismiss();
    setSearchText(filterValues.searchText);
    setIsFilterFocused(false);
  };

  const onSubmitEditing = () => {
    setIsFilterFocused(false);
    dispatch(persistFilterValues({ searchText }));
    if (searchText) {
      persistRecentSearchInStorage(searchText);
      setIsGetPostData(true);
    }
    Keyboard.dismiss();
  };

  const persistRecentSearchInStorage = (text) => {
    const toPersist = [...recentSearchesInStorage];

    console.log("toPersisttoPersist== ", typeof text == "string");
    if (typeof text === "string") {
      if (toPersist[0] !== text.trim()) {
        toPersist.unshift(text.trim());
      }

      for (let i = 1; i < toPersist.length; i++) {
        if (toPersist[i] === text.trim()) {
          toPersist.splice(i, 1);
        }
      }

      if (toPersist.length > 6) {
        toPersist.pop();
      }

      setRecentSearchesInStorage(toPersist);
      LocalStorage.setRecentSearches(toPersist);
      setIsGetPostData(true);
    } else {
      if (toPersist[0]?.searchText !== text?.searchText.trim()) {
        toPersist.unshift(text);
      }

      for (let i = 1; i < toPersist.length; i++) {
        const obj = toPersist[i];

        if (toPersist?.[i]?.searchText === text?.searchText) {
          toPersist.splice(i, 1);
        }
      }

      if (toPersist.length > 6) {
        toPersist.pop();
      }
      setRecentSearchesInStorage(toPersist);
      LocalStorage.setRecentSearches(toPersist);
      setIsGetPostData(true);
    }
  };

  const loadSearchInStorageChanges = (data) => {
    setRecentSearchesInStorage(data);
  };

  const handleBackFromSearchText = () => {
    if (searchText !== "") {
      setSearchText("");
      setIsFilterFocused(false);
      dispatch(
        persistFilterValues({
          searchText: "",
          quickDeliveries: [],
          category: {},
        })
      );
      setIsGetPostData(true);
      return;
    }
    setSearchText("");
    dispatch(
      persistFilterValues({
        searchText: "",
        quickDeliveries: [],
        category: {},
      })
    );
  };

  return (
    <>
      <View style={styles.headerFilter}>
        <View
          style={[
            styles.inputWrapper,
            isFilterFocused && styles.inputWrapperFocus,
          ]}
        >
          {(isFilterFocused || Boolean(filterValues.searchText)) && (
            <TouchableOpacity
              style={styles.inputWrapper__icon}
              // onPress={handleBackFromSearchText}
              onPress={
                isFilterFocused
                  ? handleCloseSearchView
                  : handleBackFromSearchText
              }
            >
              {Platform.OS === "ios" && (
                <Icon icon="back_alter_grey" tintColor="grey" />
              )}
              {Platform.OS !== "ios" && (
                <Icon icon="back_alter_grey" tintColor="grey" />
              )}
            </TouchableOpacity>
          )}
          {!isFilterFocused && !filterValues.searchText && (
            <Icon
              icon="search"
              color="grey"
              style={styles.inputWrapper__icon}
            />
          )}
          <View style={styles.safeContainer}>
            <TextInput
              // placeholder="Search Homitag"
              style={[
                styles.inputWrapper__input,
                searchText && styles.inputActive,
              ]}
              onFocus={onFocus}
              returnKeyLabel="Search"
              returnKeyType="search"
              autoCompleteType="off"
              textContentType="none"
              value={searchText}
              onChangeText={(value) => {
                setSearchText(value);
                handleSearchDebounce(value);
              }}
              onSubmitEditing={onSubmitEditing}
              placeholderTextColor={"#999999"}
              blurOnSubmit
            />
            {!searchText && (
              <Text style={styles.inputWrapper__label}>
                Search <Text style={styles.label__strong}>Homitag</Text>
              </Text>
            )}
            {searchText !== "" && isFilterFocused === true && (
              <TouchableOpacity
                style={styles.search_close__icon}
                onPress={() => {
                  setSearchText("");
                  dispatch(
                    persistFilterValues({
                      searchText: "",
                      quickDeliveries: [],
                    })
                  );
                }}
              >
                <Icon icon="close" color="grey" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {!isFilterFocused && (
          <NotificationBell
            notificationCount={notificationCount}
            navigation={navigation}
          />
        )}
        {/* <View style={styles.notificationWrapper}>
            <Icon icon="notification" color="active" />
          </View> */}
      </View>
      {isFilterFocused && (
        <FilterResults
          setIsFilterFocused={setIsFilterFocused}
          searchText={searchText}
          persistRecentSearchInStorage={persistRecentSearchInStorage}
          loadSearchInStorageChanges={loadSearchInStorageChanges}
        />
      )}
      {!isFilterFocused && Boolean(searchText) && filtersCount === 0 && (
        <QuickDeliveryMethodsPicker fromFilter={false} />
      )}
    </>
  );
};

export default FilterInput;
