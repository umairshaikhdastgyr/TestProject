import React from "react";
import { string, arrayOf, shape } from "prop-types";

import { View } from "react-native";
import { Heading, CheckboxesFilterInput } from "#components";
import { paddings, borders } from "#styles/utilities";
import { isEmpty } from "lodash";

const CheckboxesFilter = ({
  title,
  options,
  mainValues,
  childValues,
  setFilterValue,
}) => {
  /* Methods */
  const parseChildsValues = (option) =>
    childValues.reduce((newArray, value) => {
      if (option.childCategory.findIndex(({ id }) => id === value.id) >= 0) {
        newArray.push(value.id);
      }
      return newArray;
    }, []);

  const onMainPress = (option) => {
    let mainValuesToUpdate = [...mainValues];
    let childValuesToUpdate = [...childValues];
    if (!mainValues.find(({ id }) => id === option.id)) {
      mainValuesToUpdate.push(option);
      option.childCategory.forEach((child) => {
        if (childValues.findIndex(({ id }) => id === child.id) === -1)
          childValuesToUpdate.push(child);
      });
    } else {
      mainValuesToUpdate = mainValuesToUpdate.filter(
        ({ id }) => id !== option.id
      );
      option.childCategory.forEach((child) => {
        childValuesToUpdate = childValuesToUpdate.filter(
          ({ id }) => id !== child.id
        );
      });
    }
    setFilterValue({
      subCategories: mainValuesToUpdate,
      subCategoriesChilds: childValuesToUpdate,
    });
  };

  const onChildPress = (child, option) => {
    let mainValuesToUpdate = [...mainValues];
    let childValuesToUpdate = [...childValues];
    if (isEmpty(childValuesToUpdate.find(({ id }) => id === child.id))) {
      childValuesToUpdate.push(child);
      if (!mainValues.find(({ id }) => id === option.id))
        mainValuesToUpdate.push(option);
    } else {
      childValuesToUpdate = childValuesToUpdate.filter(
        ({ id }) => id !== child.id
      );
      
      for (let index = 0; index < mainValuesToUpdate.length; index++) {
        const element = mainValuesToUpdate[index];
        let findObj = false;
        for (let index = 0; index < childValuesToUpdate.length; index++) {
          const childElement = childValuesToUpdate?.[index];
          if (!isEmpty(element?.childCategory.find(({ id }) => id === childElement.id))) {
            findObj = true;
          }
        }
        if (findObj === false && element?.id ===  option.id) {
          mainValuesToUpdate = mainValuesToUpdate.filter(
            ({ id }) => id !== option.id 
          );
        }
      }
     
     
    }
    setFilterValue({
      subCategories: mainValuesToUpdate,
      subCategoriesChilds: childValuesToUpdate,
    });
  };

  return (
    <View style={{ ...paddings["px-4"], ...paddings["py-5"], ...borders.bb }}>
      <Heading type="bodyText">{title}</Heading>
      {options.map((option) => (
        <CheckboxesFilterInput
          key={option.id}
          options={option}
          mainValues={mainValues.map((value) => value.id)}
          childValues={parseChildsValues(option)}
          onMainPress={() => onMainPress(option)}
          onChildPress={(child) => onChildPress(child, option)}
        />
      ))}
    </View>
  );
};

CheckboxesFilter.propTypes = {
  options: arrayOf(shape({})).isRequired,
  title: string.isRequired,
};

export default CheckboxesFilter;
