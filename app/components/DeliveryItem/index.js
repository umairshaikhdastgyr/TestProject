import React, { useEffect, useState } from 'react';

import {
  View, TouchableOpacity, ScrollView, Image, Text,
} from 'react-native';
import { getNumberFormatSettings } from 'react-native-localize';
import {
  CheckBox, CurrencyInput, BodyText, Icon, Link,
} from '#components';

import styles from './styles';

const DeliveryItem = ({
  itemData,
  formData,
  setDeliveryFormData,
  updateDeliveryFormData,
  deliveryMethodsCount,
  sendAlert,
  errTotalPriceErr,
  setErrTotalPriceErr,
}) => {
  const [localData, setLocalData] = useState({});
  const [localAvailable, setLocalAvailable] = useState(true);

  useEffect(() => {
    if (
      formData.deliveryMethodsSelected.find((item) => item.id === itemData.id)
    ) {
      if (
        itemData.code !== 'pickup'
        && itemData.deliveryCustomProperties
        && itemData.deliveryCustomProperties.rangeAvailable
      ) {
        const price = Number(formData.price);
        if (
          price >= itemData.deliveryCustomProperties.rangeAvailable[0]
          && price <= itemData.deliveryCustomProperties.rangeAvailable[1]
        ) {
          setLocalData(
            formData.deliveryMethodsSelected.find(
              (item) => item.id === itemData.id,
            ),
          );
        } else {
          setDeliveryFormData(itemData);
          setLocalData(itemData);
        }
      } else {
        setLocalData(
          formData.deliveryMethodsSelected.find(
            (item) => item.id === itemData.id,
          ),
        );
      }
    } else {
      setLocalData(itemData);
    }
    //    setShipData(localData.deliveryCustomProperties.shippingCost.replace(',', '.'));
  }, []);

  useEffect(() => {
    if (Object.keys(localData).length > 0 && formData.deliveryMethodsSelected.find((element) => element.id === itemData.id)) {
      updateDeliveryFormData(localData);
    }
    if (Object.keys(localData).length > 0 && localData.deliveryCustomProperties.shippingCost && (parseFloat(localData.deliveryCustomProperties.shippingCost) + parseFloat(formData.price)) > 1500) {
      setErrTotalPriceErr(`Price + Shipping Cost ( $${parseFloat(formData.price).toFixed(2)} + $${parseFloat(localData.deliveryCustomProperties.shippingCost).toFixed(2)} ) should be less than or equal to $1500.00`);
    } else {
      // setErrTotalPriceErr(null);
    }

    // if (Object.keys(localData).length > 0 && localData.deliveryCustomProperties.shippingCost) {
    //  //setShipData(localData.deliveryCustomProperties.shippingCost.replace(',', '.'));
    // }
  }, [localData]);

  useEffect(() => {
    if (itemData.code === 'pickup') {
      setLocalAvailable(true);
    } else {
      // check price range
      const price = Number(formData.price);

      if (
        price >= itemData.deliveryCustomProperties.rangeAvailable[0]
        && price <= itemData.deliveryCustomProperties.rangeAvailable[1]
      ) {
        if (
          formData.deliveryMethodsSelected
            .filter((element) => element.code !== 'pickup')
            .filter((element) => element.id !== itemData.id).length > 0
        ) {
          setLocalAvailable(false);
        } else {
          setLocalAvailable(true);
        }
      } else {
        setLocalAvailable(false);
      }
    }
  }, [formData]);

  const providerObj = (object, index) => (
    <TouchableOpacity
      key={index}
      activeOpacity={0.8}
      style={styles.providerContainer}
      onPress={() => {
        const dataReference = localData.deliveryCustomProperties.optionsAvailable;

        let indexSelected = 0;
        for (let i = 0; i < dataReference.length; i++) {
          if (dataReference[i].selected && dataReference[i].selected === true) {
            indexSelected = i;
            break;
          }
        }

        if (dataReference[indexSelected].providers[index].selected && dataReference[indexSelected].providers[index].selected === true) {
          dataReference[indexSelected].providers[index].selected = false;
        } else {
          for (let i = 0; i < dataReference[indexSelected].providers.length; i++) {
            dataReference[indexSelected].providers[i].selected = false;
          }
          dataReference[indexSelected].providers[index].selected = true;
        }

        setLocalData({
          ...localData,
          deliveryCustomProperties: {
            ...localData.deliveryCustomProperties,
            optionsAvailable: [
              ...dataReference,
            ],
          },
        });
      }}
    >
      { object.selected && object.selected === true
          && <View style={styles.checkedView} />}
      { (!object.selected || (object.selected && object.selected === false))
          && <View style={styles.uncheckedView} />}
      <Image resizeMode="contain" style={{ width: 80, height: 25 }} source={{ uri: object.urlProvider }} />
      <BodyText theme="inactive" size="medium">
        {object.provider}
        {' '}
        $
        {object.cost}
        {' '}
        |
        {' '}
        {object.deliverTimeRange}
      </BodyText>
    </TouchableOpacity>
  );

  const optionObj = (object, index) => (
    <TouchableOpacity
      key={index}
      activeOpacity={0.4}
      onPress={() => {
        const dataReference = localData.deliveryCustomProperties.optionsAvailable;

        if (!localData.deliveryCustomProperties.optionsAvailable[index].selected) {
          for (let i = 0; i < dataReference.length; i++) {
            dataReference[i].selected = false;
            for (let j = 0; j < dataReference[i].providers.length; j++) {
              dataReference[i].providers[j].selected = false;
            }
          }

          dataReference[index].selected = true;
        } else {
          for (let i = 0; i < dataReference.length; i++) {
            dataReference[i].selected = false;
            for (let j = 0; j < dataReference[i].providers.length; j++) {
              dataReference[i].providers[j].selected = false;
            }
          }
        }

        setLocalData({
          ...localData,
          deliveryCustomProperties: {
            ...localData.deliveryCustomProperties,
            optionsAvailable: [
              ...dataReference,
            ],
          },
        });
      }}
    >
      <View style={(object.selected && object.selected === true) ? styles.objContainerSelected : styles.objContainer}>
        <Icon size="large" icon="delivery" style={(object.selected && object.selected === true) ? styles.tintStyle : ''} />
        <BodyText bold={(object.selected && object.selected === true)} align="center" size="small" theme={(object.selected && object.selected === true) ? 'active' : 'inactive'}>{object.weightRange.toUpperCase()}</BodyText>
      </View>
    </TouchableOpacity>
  );

  const { decimalSeparator } = getNumberFormatSettings();

  const setShipData = (shippingPrice) => {
    if (shippingPrice && (parseFloat(shippingPrice) + parseFloat(formData.price)) > 1500) {
      setErrTotalPriceErr(`Price + Shipping Cost ( $${parseFloat(formData.price).toFixed(2)} + $${parseFloat(shippingPrice).toFixed(2)} ) should be less than or equal to $1500.00`);
    } else {
      setErrTotalPriceErr(null);
    }
    setLocalData({
      ...localData,
      deliveryCustomProperties: {
        ...localData.deliveryCustomProperties,
        shippingCost: shippingPrice !== '' ? shippingPrice : 0,
      },
    });
  };


  const moneyChecker = (value1) => {
    const value = value1.replace(',', '.');
    const seprator = '.';
    const pattern = /^\s*-?[0-9]\d*(\.\d{1,3})?\s*$/;
    if (!pattern.test(value) && value) {
      if (value[value.length - 1] === seprator) {
        if (pattern.test(value.split(seprator)[0])) {
          if (seprator === ',') {
            const sepCount = (value.match(/,/g) || []).length;
            if (sepCount === 1) {
              setShipData(value);
              setErrTotalPriceErr('Enter valid amount');
            }
          } else if (seprator === '.') {
            const sepCount = (value.match(/\./g) || []).length;
            if (sepCount === 1) {
              setShipData(value);
              setErrTotalPriceErr('Enter valid amount');
            }
          }
        } else {
          setShipData(localData.deliveryCustomProperties.shippingCost);
          // setErrTotalPriceErr('Enter valid price');
        }
      } else {
        setShipData(localData.deliveryCustomProperties.shippingCost);
        // setErrTotalPriceErr('Enter valid price');
      }
    } else {
      setShipData(value);
      setErrTotalPriceErr(null);
    }
    // setPrice('');
  };
  return (
    <>
      <TouchableOpacity activeOpacity={0.4} onPress={() => { localAvailable === true ? setDeliveryFormData(localData) : sendAlert(localData); }}>
        <View style={[styles.container, { opacity: localAvailable === true ? 1 : 0.4 }]}>
          <View style={styles.leftContainer}>
            { formData.deliveryMethodsSelected.find((element) => element.id === itemData.id)
              && <View style={styles.checkedView} />}
            { !formData.deliveryMethodsSelected.find((element) => element.id === itemData.id)
              && <View style={styles.uncheckedView} />}
          </View>
          <View style={styles.rightContainer}>
            <BodyText theme="medium" bold align="left" numberOfLines={1} style={styles.titleText}>{itemData.name}</BodyText>
            <BodyText align="left" numberOfLines={1}>{itemData.description}</BodyText>
          </View>
          { itemData.deliveryCustomProperties.freeOption
            && (
            <View style={styles.arrowContainer}>
              { !formData.deliveryMethodsSelected.find((element) => element.id === itemData.id)
              && <Icon icon="chevron-right" />}
              { formData.deliveryMethodsSelected.find((element) => element.id === itemData.id)
              && <Icon icon="chevron-down" />}
            </View>
            )}
        </View>
      </TouchableOpacity>
      { formData.deliveryMethodsSelected.find((element) => element.id === itemData.id) && itemData.deliveryCustomProperties.optionsAvailable
        && (
        <View style={styles.childCustomContainer}>
          <BodyText theme="medium" bold align="left" numberOfLines={1} style={styles.titleText}>Select Item Weight</BodyText>
          <BodyText align="left">Please ship anything over 150 lbs independently.</BodyText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginTop: 15, flexGrow: 1 }} contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 5 }}>
            { localData && localData.deliveryCustomProperties
              && localData.deliveryCustomProperties.optionsAvailable.map((itemData, index) => (
                optionObj(itemData, index)
              ))}
          </ScrollView>
        </View>
        )}
      { formData.deliveryMethodsSelected.find((element) => element.id === itemData.id)
        && localData.deliveryCustomProperties
        && localData.deliveryCustomProperties.optionsAvailable
        && localData.deliveryCustomProperties.optionsAvailable.find((item) => (item.selected && item.selected === true))
        && (
        <View style={styles.childCustomContainer}>
          <BodyText theme="medium" bold align="left" numberOfLines={1} style={styles.titleText}>Select a Carrier</BodyText>
          <BodyText align="left" style={{ marginBottom: 5 }}>Please select one provider.</BodyText>
          { localData && localData.deliveryCustomProperties
            && localData.deliveryCustomProperties.optionsAvailable.find((item) => (item.selected && item.selected === true)).providers.map((itemData, index) => (
              providerObj(itemData, index)
            ))}
        </View>
        )}
      { formData.deliveryMethodsSelected.find((element) => element.id === itemData.id) && itemData.deliveryCustomProperties.freeOption && localData.deliveryCustomProperties && localData.deliveryCustomProperties.freeOption
        && (
        <View style={[styles.childContainer,
          (itemData.order < deliveryMethodsCount) && styles.botomLine]}
        >
          <View style={{ flex: 1 }}>
            <BodyText theme="medium" bold align="left" numberOfLines={1} style={styles.titleText}>{itemData.deliveryCustomProperties.freeOption.title}</BodyText>
            <BodyText align="left">{itemData.deliveryCustomProperties.freeOption.description}</BodyText>
          </View>
          <View style={[styles.freeContainer]}>
            <CheckBox
              label=""
              theme="alter"
              selected={localData?.deliveryCustomProperties?.freeOption?.valueSelected}
              onChange={(value) => {
                setLocalData({
                  ...localData,
                  deliveryCustomProperties: {
                    ...localData.deliveryCustomProperties,
                    freeOption: {
                      ...localData.deliveryCustomProperties.freeOption,
                      valueSelected: value,
                    },
                  },
                });
              }}
            />
          </View>
        </View>
        )}
      { formData.deliveryMethodsSelected.find((element) => element.id === itemData.id) && itemData.deliveryCustomProperties.freeOption && itemData.code === 'shipindependently' && localData.deliveryCustomProperties && localData?.deliveryCustomProperties?.freeOption?.valueSelected === false
        && (
        <View style={[styles.costContainer]}>
          <BodyText theme="medium" bold align="left" numberOfLines={1} style={styles.titleText}>Shipping Cost</BodyText>
          <CurrencyInput
            value={localData.deliveryCustomProperties.shippingCost > 0 ? localData.deliveryCustomProperties.shippingCost.toString() : ''}
            onChangeText={(value) => {
              moneyChecker(value);
            }}
          />
          {errTotalPriceErr ? (
            <Text style={styles.redText}>{errTotalPriceErr}</Text>
          ) : null}
        </View>
        )}
      { formData.deliveryMethodsSelected.find((element) => element.id === itemData.id) && itemData.deliveryCustomProperties.freeOption && itemData.code === 'shipindependently'
        && (
        <BodyText align="left" style={{ marginBottom: 20 }}>
          By selecting this option, you agree to comply with our
          {' '}
          <Link theme="bold">Shipping Policy</Link>
          {' '}
          and provide tracking information.
        </BodyText>
        )}
    </>
  );
};

export default DeliveryItem;
