import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { ScrollView, View } from "react-native";
import { Heading, TypeTag, Tab } from "#components";

import styles from "./styles";

import { selectSellData } from "#modules/Sell/selectors";
import { selectCategoriesData } from "#modules/Categories/selectors";
import { setFormValue, changePostDetail } from "#modules/Sell/actions";
import { useActions } from "#utils";
import { flex } from "#styles/utilities";

const SubcategoriesSection = ({ categoryType, fromEditor }) => {
  /* Selectors */
  const { formData } = useSelector(selectSellData());
  const { categoriesList } = useSelector(selectCategoriesData());

  /* Actions */
  const actions = useActions({ setFormValue, changePostDetail });

  // /* States */
  const [hasChildSubcategories, setHasChildSubcategories] = useState(false);
  const [optionsList, setOptionsList] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState({});
  const [firstLoad, setFirstLoad] = useState(true);

  /* Effects */
  useEffect(() => {
    // Exclusive fix for vehicle categories
    if (categoryType === "Vehicle")
      actions.setFormValue({ category: categoriesList[0] });
  }, []);

  useEffect(() => {
    if (formData?.category?.id) setFlowToFollow();
  }, [formData?.category?.id]);

  useEffect(() => {
    if (activeTab.id && categoryType !== "Vehicle") {
      setOptionsList(activeTab.childCategory);
      if (activeTab.childCategory.length === 0) {
        actions.setFormValue({ subCategory: activeTab });
      } else {
        if (firstLoad === true) {
          setFirstLoad(false);
        } else {
          actions.setFormValue({ subCategory: {} });
        }
      }
    }
  }, [activeTab]);

  /* Methods */
  const setFlowToFollow = () => {
    if (["Baby and child", "Fashion"].includes(formData.category.name)) {
      setHasChildSubcategories(true);
      setTabs(formData.category.childCategory);

      if (formData.subCategory && formData.subCategory.id) {
        // check location
        for (let i = 0; i < formData.category.childCategory.length; i++) {
          if (
            formData.category.childCategory[i].childCategory.find(
              (item) => item.id === formData.subCategory.id
            )
          ) {
            setActiveTab(formData.category.childCategory[i]);
            break;
          }
        }
      } else {
        setActiveTab(formData.category.childCategory[0]);
      }
      setOptionsList(activeTab.childCategory);
    } else {
      setHasChildSubcategories(false);
      setOptionsList(formData.category.childCategory);
    }
  };

  return (
    <>
      {formData?.category?.childCategory &&
        formData?.category?.childCategory?.length > 0 && (
          <View
            style={[
              styles.heading,
              categoryType === "Vehicle" && styles.headingVehicle,
              flex.directionRow,
            ]}
          >
            <Heading type="bodyText" bold>
              Subcategory
            </Heading>
            <Heading type="bodyText" style={{ color: "red" }} bold>
              *
            </Heading>
          </View>
        )}
      {hasChildSubcategories && (
        <View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentInset={{ right: 32 }}
            contentContainerStyle={styles.tabs}
          >
            {tabs?.map((tab) => (
              <Tab
                style={styles.tab}
                key={tab.id}
                label={tab.name}
                active={activeTab.id === tab.id}
                onPress={() => setActiveTab(tab)}
              />
            ))}
          </ScrollView>
        </View>
      )}
      <ScrollView
        contentContainerStyle={[
          styles.scrollViewTiles,
          hasChildSubcategories && styles.scrollViewTilesPaddinTop,
        ]}
      >
        {optionsList &&
          optionsList
            .sort(function (a, b) {
              return a.order - b.order;
            })
            .map((option, index) => (
              <TypeTag
                key={index}
                label={option.name?.trim().toUpperCase()}
                icon={option.iconUrl}
                iconActive={option.iconActiveUrl}
                style={[styles.typeTag, index % 2 && styles.typeTagEven]}
                onPress={() => {
                  if (categoryType === "Vehicle") {
                    actions.setFormValue(
                      formData?.subCategory?.id !== option?.id
                        ? { subCategory: option, customProperties: {} }
                        : {
                            subCategory: {},
                            customProperties: {},
                          }
                    );
                    actions.changePostDetail(true);
                    return;
                  }
                  actions.setFormValue(
                    formData?.subCategory?.id !== option?.id
                      ? { subCategory: option }
                      : {
                          subCategory: {},
                        }
                  );
                  actions.changePostDetail(true);
                }}
                active={formData?.subCategory?.id === option?.id}
              />
            ))}
        <View style={{ width: "42%" }} />
      </ScrollView>
    </>
  );
};

export default SubcategoriesSection;
