import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ValidateVinNumber from "react_native_vindecoderapi";
import appConfig from "../../../../app.json";
import { SafeAreaView } from "react-native";
import { StepsBar, FooterAction } from "#components";

import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";

import { selectSellData } from "#modules/Sell/selectors";
import { useActions } from "#utils";

import { setFormValue } from "#modules/Sell/actions";

import Tabs from "../../Explore/AddFilterScreen/views/Tabs";
import PropertySection from "../../Explore/AddFilterScreen/views/PropertySection";

import moment from "moment";
import useCheckNetworkInfo from "../../../hooks/useCheckNetworkInfo";

const MainDetailsToAddScreen = ({ navigation, route }) => {
  /* Selectors */
  const { formData } = useSelector(selectSellData());

  /* Actions */
  const actions = useActions({ setFormValue });

  const { internetAvailable } = useCheckNetworkInfo();

  /* States */

  const [isValidVin, setIsValidVin] = useState(false);
  const [conType, setConType] = useState(undefined);

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
    if (internetAvailable === true) {
      if (!conType) {
        setConType(true);
      }
    } else if (internetAvailable === false) {
      setConType(false);
    }
  }, [internetAvailable]);

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
      } else {
        customProperties[Object.keys(addFilterValues)[i]] = undefined;
      }
    }

    actions.setFormValue({
      customProperties,
    });

    navigation.goBack();
  };
  const ValidateVinNumberCallBack = (text) => {
    if (text && text.decode) {
      setIsValidVin(true);
    } else {
      setIsValidVin(false);
    }
  };
  const vinNumberIsNotValid = () => {
    if (activeTab === "VIN Number") {
      if (
        addFilterValues &&
        addFilterValues?.[activeTab] &&
        addFilterValues?.[activeTab]?.[0]?.value !== "" &&
        Number(addFilterValues?.[activeTab]?.[0]?.value.length) === 17
      ) {
        if (conType) {
          ValidateVinNumber(
            appConfig.apikey,
            appConfig.secretkey,
            "info",
            addFilterValues[activeTab][0]?.value
              ? addFilterValues[activeTab][0]?.value.toUpperCase()
              : "",
            ValidateVinNumberCallBack
          );
        }
        if (isValidVin) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  return (
    <>
      <SafeAreaView style={safeAreaViewWhite}>
        <StepsBar steps={5} step={3} />
        <Tabs
          properties={properties}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filterValues={addFilterValues}
          sellMode={true}
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
        <FooterAction
          mainButtonProperties={{
            label: "Save Details",
            disabled: vinNumberIsNotValid(),
            onPress: () => {
              updatePropertiesOnForm();
            },
          }}
        />
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default MainDetailsToAddScreen;
