import React, { useEffect } from 'react';

import { View, Text } from 'react-native';
import { Heading, CurrencyInputSell } from '#components';

import styles from './styles';
import { Fonts } from '#themes';

const PriceElement = ({
  titleText,
  bottomText,
  value,
  changeListener,
  offerDisabled,
  errOfferPriceErr,
  setErrOfferPriceErr,
  minPrice,
}) => {
  /* Actions */
  useEffect(() => {
    changeListener(value.replace(',', '.'));
  }, []);

  const moneyChecker = value2 => {
    const value1 = value2.replace(',', '.');
    const seprator = '.';
    const pattern = /^\s*-?[0-9]\d*(\.\d{1,3})?\s*$/;
    if (!pattern.test(value1) && value1) {
      if (value1[value1.length - 1] === seprator) {
        if (pattern.test(value1.split(seprator)[0])) {
          if (seprator === ',') {
            const sepCount = (value1.match(/,/g) || []).length;
            if (sepCount === 1) {
              changeListener(value1);
              setErrOfferPriceErr('Enter valid price');
            }
          } else if (seprator === '.') {
            const sepCount = (value1.match(/\./g) || []).length;
            if (sepCount === 1) {
              changeListener(value1);
              setErrOfferPriceErr('Enter valid price');
            }
          }
        } else {
          changeListener(value);
          // setErrOfferPriceErr('Enter valid price');
        }
      } else {
        changeListener(value);
        // setErrOfferPriceErr('Enter valid price');
      }
    } else {
      changeListener(value1);
      setErrOfferPriceErr(null);
    }
    // setPrice('');
  };

  return (
    <>
      <View style={styles['input-container']}>
        <Heading
          type="bodyText"
          bold
          style={{ fontSize: 16,fontFamily:Fonts.family.semiBold, textAlign: 'center' }}
        >
          {titleText}
        </Heading>
        <View style={styles.currencyContainer}>
          <CurrencyInputSell
            editable={!offerDisabled}
            value={value}
            onChangeText={vl => moneyChecker(vl.replace('$ ', ''))}
            onSubmitEditing={() => {
              setErrOfferPriceErr('');
              if (Number(value) < minPrice) {
                setErrOfferPriceErr('Your offer is too low');
              }
            }}
          />
          {errOfferPriceErr ? (
            <Text style={styles.redText}>{errOfferPriceErr}</Text>
          ) : null}
          {bottomText.length > 0 && (
            <Heading
              type="inactive"
              style={{
                fontSize: 12,
                textAlign: 'center',
                marginTop: 8,
                color: '#313334',
              }}
            >
              {bottomText}
            </Heading>
          )}
        </View>
      </View>
    </>
  );
};

export default PriceElement;
