import React from 'react';

import {BodyText, InputText} from '#components';
import {margins} from '#styles/utilities';
import { Keyboard } from 'react-native';
let isValid = false;

const StringFilter = ({
  name,
  values,
  setFilterValue,
  keyboardType,
  property,
}) => {
  const getValue = () => {
    if (property && property.type === 'string') {
      if (values.length > 0) {
        return values[0].value;
      } else {
        return '';
      }
    } else if (property && property.type === 'integer') {
      if (values.length > 0) {
        if (values[0].value !== 0) {
          return values[0].value
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
          return values[0].value;
        }
      } else {
        return '';
      }
    } else {
      return '';
    }
  };

  const setValue = value => {
    if (property && property.type === 'string') {
      setFilterValue({
        [name]: [{name: value, value: value, isValid: isValid}],
      });
    } else if (property && property.type === 'integer') {
      if (value !== '') {
        if (value.length <= 11 && Number(value.replace(/\,/g, ''))) {
          setFilterValue({
            [name]: [
              {
                name: Number(value.replace(/\,/g, '')),
                value: Number(value.replace(/\,/g, '')),
                isValid: isValid,
              },
            ],
          });
        }
      } else {
        setFilterValue({
          [name]: [{name: value, value: value, isValid: isValid}],
        });
      }
    } else {
      setFilterValue({[name]: [{name: value, value: value, isValid: isValid}]});
    }
  };
  return (
    <>
      <BodyText
        bold
        theme="medium"
        style={[margins['mb-2']]}>
        {name}
      </BodyText>
      <InputText
        placeholder=""
        fullWidth
        textAlign="left"
        value={getValue()}
        keyboardType={keyboardType}
        onSubmitEditing={() => Keyboard.dismiss()}
        style={{fontSize: 24}}
        onChangeText={value => {
          if (property && property.validation) {
            const condition = new RegExp(property.validation, 'g');
            isValid = condition.test(value);
          }

          setValue(value);
        }}
      />
      {property &&
        property.validationError &&
        getValue() !== '' &&
        isValid === false && (
          <BodyText style={{color: 'red'}}>{property.validationError}</BodyText>
        )}
    </>
  );
};

export default StringFilter;
