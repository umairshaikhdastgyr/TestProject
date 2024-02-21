import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Tag, Loader } from '#components';
import FilterInput from './filter-input';
import { paddings } from '#styles/utilities';
import { Metrics, Colors, Fonts } from '#themes';

import { useActions } from '#utils';
import { selectFiltersData } from '#modules/Filters/selectors';
import {
  getCustomFilterOptionsList,
  getModelsByMake,
} from '#modules/Filters/actions';

import SectionListContacts from '../../components/SectionListContacts';

const TagList = ({ property, name, valuesToCall, values, setFilterValue, onlySelection }) => {
  /* Selectors */
  const { propertiesFetchedOptions } = useSelector(selectFiltersData());

  /* Actions */
  const actions = useActions({
    getCustomFilterOptionsList,
    getModelsByMake,
  });

  /* States */
  const [filterText, setFilterText] = useState('');
  const [countOfCalls, setCountOfCalls] = useState(-1);

  /* Effects */
  useEffect(() => {
    if (!propertiesFetchedOptions[name] && name !== 'model') {
      actions.getCustomFilterOptionsList({
        name,
        url: property.dataBasePath,
      });
    }
    if (name === 'model') setCountOfCalls(0);
  }, []);

  useEffect(() => {
    //console.log(propertiesFetchedOptions);
  }, [propertiesFetchedOptions]);

  useEffect(() => {
    if (countOfCalls >= 0) callModelData(valuesToCall[countOfCalls]);
  }, [countOfCalls]);

  /* Methods */
  const callModelData = async valueToCall => {
    if (countOfCalls <= valuesToCall.length) {
      await actions.getModelsByMake({
        makeId: valueToCall.value,
        index: countOfCalls,
      });
      setTimeout(() => setCountOfCalls(countOfCalls + 1), 1000);
    }
  };

  const handlePressTag = option => {
    let valuesToUpdate = [...values];

    if(onlySelection && onlySelection === true){
      if (!values.find(value => value.value === option.id)){
        valuesToUpdate = [];
        valuesToUpdate.push({ name: option.name, value: option.id });
      } else {
        valuesToUpdate = [];
      }
    } else {
      if (!values.find(value => value.value === option.id))
        valuesToUpdate.push({ name: option.name, value: option.id });
      else
        valuesToUpdate = valuesToUpdate.filter(
          value => value.value !== option.id,
        );
    }
    setFilterValue({ [name]: valuesToUpdate });
  };

  const parseData = () => {
    if(propertiesFetchedOptions[name]){
      if(filterText !== ''){
        let dataFiltered = propertiesFetchedOptions[name].filter((item) => {
          return item.name.toUpperCase().includes(filterText.toUpperCase());
        });

        return dataFiltered;
      } else {
        return propertiesFetchedOptions[name];
      }
    } else {
      return [];
    } 
  }

  const itemToRender = (item) => {
    return (
      <View style={{flexDirection: 'row', marginVertical: 2, marginLeft: 20}}>
        <Tag
          key={item.id}
          label={item.name.toUpperCase()}
          active={values.find(value => value.value === item.id)}
          onPress={() => handlePressTag(item)}
        />
      </View>
    );
  }

  const emptyItem = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.emptyText}>No items available</Text>
      </View>
    );
  }

  return (
    <>
      <FilterInput value={filterText} setValue={setFilterText} nameProperty={name}/>
      <SectionListContacts
        ref={s=>sectionListElement=s}
        sectionListData={parseData()}
        renderItem={(item) => itemToRender(item)}
        scrollAnimation={true}
        showsVerticalScrollIndicator={false}
        SectionListClickCallback={(item,index)=>{
           //console.log('---SectionListClickCallback--:',item,index)
        }}
        otherAlphabet="#"
        letterTextStyle={styles.alphabetLetter}
        letterViewStyle={styles.alphabetView}
        emptyItem={emptyItem}
      />
      {/*
        <ScrollView contentContainerStyle={paddings['px-4']}>
          <View style={styles.container}>
            {!propertiesFetchedOptions[name] && <Loader />}
            {propertiesFetchedOptions[name] &&
              propertiesFetchedOptions[name].map(option => (
                
              ))}
          </View>
        </ScrollView>
      */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hideTag: {
    display: 'none',
  },
  alphabetLetter: {
    color: '#00BDAA',
    fontFamily: Fonts.family.semiBold,
    fontWeight: '600',
    fontSize: 14,
    padding: 8,
    marginVertical: 2,
    marginRight: 10,
  },
  alphabetView: {

  },
  emptyText: {
    color: '#343434',
    marginTop: 30,
    textAlign: 'center',
    fontFamily: Fonts.family.regular,
    fontWeight: '400',
    fontSize: 14,
  }
});

export default TagList;
