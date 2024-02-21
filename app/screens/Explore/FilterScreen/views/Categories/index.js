import React from 'react';
import { useSelector } from 'react-redux';

import { View, ScrollView } from 'react-native';
import { Heading, CategoryTag } from '#components';
import { paddings, backgrounds, margins, shadows } from '#styles/utilities';

import { selectCategoriesData } from '#modules/Categories/selectors';

const Categories = ({ setFilterValue, filterValues }) => {
  /* Selectors */
  const { categoriesList } = useSelector(selectCategoriesData());

  return (
    <View style={{zIndex: 3}}>
      <Heading
        type="bodyText"
        style={{ ...margins['ml-4'], ...margins['mt-4'], ...margins['mb-3'] }}
      >
        Category
      </Heading>
      <View style={shadows.light}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentInset={{ right: 32 }}
          style={{
            ...backgrounds.backGrey,
            ...paddings['p-4'],
          }}
        >
          {categoriesList?.map(category => {
            if(category?.name=='Vehicles'){
              return null;
            }
            return(
            <CategoryTag
              key={category.id}
              label={category.name}
              icon={category.iconUrl}
              iconActive={category.iconActiveUrl}
              onPress={() =>
                setFilterValue(
                  filterValues.category.id !== category.id
                    ? { category, subCategories: [], subCategoriesChilds: []  }
                    : {
                        category: {},
                        subCategories: [],
                        subCategoriesChilds: [],
                      },
                )
              }
              active={filterValues.category.id === category.id}
            />
          )})}
        </ScrollView>
      </View>
    </View>
  );
};

export default Categories;
