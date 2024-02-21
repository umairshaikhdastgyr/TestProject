import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Loader } from '#components';
import Vehicles from './vehicles';
import Households from './households';
import Electronic from './electronic';
import BabyAndChild from './baby-and-child';
import Exercise from './exercise';
import Beauty from './beauty';
import AutomotiveParts from './automotive-parts';
import Fashion from './fashion';
import Entertainment from './entertainment';
import Hobbies from './hobbies';
import Others from './others';
import Handmade from './handmade';

import { useActions } from '#utils';
import { selectCategoriesData } from '#modules/Categories/selectors';
import { selectFiltersData } from '#modules/Filters/selectors';
import { selectDeliveryData } from '#modules/Delivery/selectors';
import { getCategoryDetails } from '#modules/Categories/actions';
import { getMaxPricePerCategory } from '#modules/Filters/actions';
// import { getDeliveryMethods } from '#modules/Delivery/actions';

const FiltersByCategory = ({ filterValues, setFilterValue, navigation, setCustomPropertiesProps }) => {
  /* Selectors */
  const { categoryDetails } = useSelector(selectCategoriesData());
  const { grouped: deliveryGrouped } = useSelector(selectDeliveryData());
  const { filterOptions } = useSelector(selectFiltersData());

  /* Actions */
  const actions = useActions({
    getCategoryDetails,
    getMaxPricePerCategory,
  });

  /* Effects */
  useEffect(() => {
    if (filterValues.category.id) {
      actions.getCategoryDetails({ categoryId: filterValues.category.id });
      actions.getMaxPricePerCategory({ categoryId: filterValues.category.id });
    }
  }, [filterValues.category]);

  useEffect(() => {
    setFilterValue({ priceRange: [0, filterOptions.maxPrice] });
  }, [filterOptions.maxPrice]);

  /* Methods */
  const returnCategoryView = category => {
    const categoryProps = {
      key: category.id,
      categoryCustomProperties: filterValues.category.customProperties,
      deliveryGrouped: deliveryGrouped,
      subCategories: categoryDetails.subCategories,
      subCategoriesChilds: categoryDetails.subCategoriesChilds,
      priceRange: { min: 0, max: filterOptions.maxPrice },
      filterValues,
      setFilterValue,
      navigation,
      setCustomPropertiesProps,
    };

    switch (category.name) {
      case 'Vehicles':
        return <Vehicles {...categoryProps} />;
      case 'Households':
        return <Households {...categoryProps} />;
      case 'Electronic':
        return <Electronic {...categoryProps} />;
      case 'Baby and child':
        return <BabyAndChild {...categoryProps} />;
      case 'Exercise':
        return <Exercise {...categoryProps} />;
      case 'Beauty':
        return <Beauty {...categoryProps} />;
      case 'Automotive Parts':
        return <AutomotiveParts {...categoryProps} />;
      case 'Fashion':
        return <Fashion {...categoryProps} />;
      case 'Entertainment':
        return <Entertainment {...categoryProps} />;
      case 'Hobbies':
        return <Hobbies {...categoryProps} />;
      case 'Others':
        return <Others {...categoryProps} />;
      case 'Handmade':
        return <Handmade {...categoryProps} />;
      default:
        return '';
    }
  };

  return (
    <>
      {Boolean(filterValues.category.id) && categoryDetails.isFetching && (
        <Loader />
      )}
      {Boolean(filterValues.category.id) &&
        !categoryDetails.isFetching &&
        returnCategoryView(filterValues.category)}
    </>
  );
};

export default FiltersByCategory;
