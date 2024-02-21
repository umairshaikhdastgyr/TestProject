import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

import { SafeAreaView, Text, Keyboard } from "react-native";
import { StepsBar, FooterAction } from "#components";

import TagTypeOptions from "./sections/tag-type-options";

import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";

import { selectSellData } from "#modules/Sell/selectors";
import { useActions } from "#utils";

import { setFormValue } from "#modules/Sell/actions";

import Tabs from "../../Explore/AddFilterScreen/views/Tabs";
import PropertySection from "../../Explore/AddFilterScreen/views/PropertySection";

import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";

const MainDetailsToAddScreen = ({ navigation, route }) => {
  /* Selectors */
  const { formData, optionsFromBack } = useSelector(selectSellData());

  /* Actions */
  const actions = useActions({ setFormValue });

  /* States */
  const [isCallingOptions, setIsCallingOptions] = useState({
    make: true,
    model: true,
  });

  const [properties, setProperties] = useState(route?.params?.properties);

  /* Effects */
  useEffect(() => {
    let defaultValues = {};
    for (let i = 0; i < properties.length; i++) {
      defaultValues[properties[i].name] = [];
      if (formData.customProperties[properties[i].name]) {
        defaultValues[properties[i].name].push(
          formData.customProperties[properties[i].name]
        );
        if (properties[i].name === "make") {
          if (formData.customProperties["model"]) {
            defaultValues["model"] = [];
            defaultValues["model"].push(formData.customProperties["model"]);
          }
        }
      }
    }
    setAddFilterValues(defaultValues);

    let checkedProperties = properties;

    for (let i = 0; i < checkedProperties.length; i++) {
      if (checkedProperties[i].type === "year-integer") {
        let listOptions = [];
        const maxYear = Number(moment().format("YYYY")) + 1;

        for (let j = 0; j <= 31; j++) {
          listOptions.push(maxYear - j);
        }
        checkedProperties[i].listOptions = listOptions;
      }
    }

    setProperties(checkedProperties);
  }, []);

  useEffect(() => {
    //console.log(properties);
  }, [properties]);

  useEffect(() => {
    //console.log(addFilterValues);
  }, [addFilterValues]);

  /* States */
  const [activeTab, setActiveTab] = useState(route?.params?.tabName);
  const [addFilterValues, setAddFilterValues] = useState({});

  const setFilterValue = (newValue) => {
    setAddFilterValues({
      ...addFilterValues,
      ...newValue,
    });
  };

  const updatePropertiesOnForm = () => {
    let customProperties = { ...formData.customProperties };

    for (let i = 0; i < Object.keys(addFilterValues).length; i++) {
      if (addFilterValues[Object.keys(addFilterValues)[i]].length > 0) {
        customProperties[Object.keys(addFilterValues)[i]] =
          addFilterValues[Object.keys(addFilterValues)[i]][0];
      }
    }

    actions.setFormValue({
      customProperties,
    });

    navigation.goBack();
  };

  const checkSaveFunction = () => {
    if (addFilterValues[activeTab] && addFilterValues[activeTab].length > 0) {
      return false;
    } else {
      return true;
    }
  };
  let keyboardDidShowListener = null;
  let keyboardDidHideListener = null;
  const [buttonVisibility, setButtonVisibility] = useState(true);
  useFocusEffect(
    useCallback(() => {
      const keyboardDidShow = () => {
        setButtonVisibility(false);
      };

      const keyboardDidHide = () => {
        setButtonVisibility(true);
      };
      keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        keyboardDidShow
      );
      keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        keyboardDidHide
      );

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, [])
  );

  return (
    <>
      <SafeAreaView style={safeAreaViewWhite}>
        <StepsBar steps={5} step={3} />
        <Tabs
          properties={properties}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filterValues={addFilterValues}
        />
        {properties.map(
          (property) =>
            activeTab === property.name && (
              <PropertySection
                key={property.name}
                property={property}
                values={addFilterValues[property.name] || []}
                setFilterValue={setFilterValue}
                onlySelection={true}
              />
            )
        )}
        {activeTab === "model" && (
          <PropertySection
            key={"model"}
            property={{ name: "model", type: "tags" }}
            valuesToCall={addFilterValues.make || []}
            values={addFilterValues.model || []}
            setFilterValue={setFilterValue}
            onlySelection={true}
          />
        )}
        {buttonVisibility && (
          <FooterAction
            mainButtonProperties={{
              label: "Save Details",
              disabled: checkSaveFunction(),
              onPress: () => {
                updatePropertiesOnForm();
              },
            }}
          />
        )}
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default MainDetailsToAddScreen;
