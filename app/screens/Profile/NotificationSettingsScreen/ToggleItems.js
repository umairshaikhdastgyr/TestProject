import React, { Fragment, useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { Switch } from 'react-native-switch';
import { Colors } from '#themes';
import _ from 'lodash';
import { styles } from './styles';
import SmallLoader from '#components/Loader/SmallLoader';
const renderSeparator = () => <View style={styles.separator} />;

export const ToggleItem = ({
  item,
  mainId,
  onSwitchChange,
  updateSettingsAction,
  userId,
  dispatch,
  type,
}) => {
  const updateSettings = (property, value) => {
    const params =
      type === 0
        ? { topic: item.type, property, value }
        : { topic: item.type, kindNotification: property, value };
    dispatch(
      updateSettingsAction({
        userId,
        params,
      }),
    );
  };

  return item.subItem.map((subItem, subId) => (
    <View style={styles.toggleContainer} key={`key-${mainId}-${subId}`}>
      <Text style={subItem.value ? styles.activeItemText : styles.itemText}>
        {subItem.text}
      </Text>
      <Switch
        circleActiveColor={Colors.switchThumbActive}
        circleInActiveColor={Colors.switchThumbInactive}
        backgroundActive={Colors.inactiveShape}
        backgroundInactive={Colors.inactiveShape}
        onValueChange={value => {
          onSwitchChange(value, mainId, subId);
          updateSettings(subItem.property, value);
        }}
        value={subItem.value}
        changeValueImmediately={true}
        circleBorderWidth={0}
        barHeight={16}
        switchWidthMultiplier={1.6}
        circleSize={25}
        renderActiveText={false}
        renderInActiveText={false}
        outerCircleStyle={Colors.switchCircle}
        innerCircleStyle={Colors.switchCircle}
      />
    </View>
  ));
};

export const ToggleItems = ({
  settingData,
  title,
  updateSettingsAction,
  userId,
  dispatch,
  loading,
}) => {
  const [switchValues, setSwitchValues] = useState(settingData);
  useEffect(() => {
    setSwitchValues(settingData);
  }, [settingData]);

  const onSwitchChange = (value, mainId, lastId) => {
    const updatedSwitchValues = _.cloneDeep(switchValues);
    updatedSwitchValues[mainId].subItem[lastId].value = value;
    setSwitchValues(updatedSwitchValues);
  };
  const type = title === 'PRIVACY SETTINGS' ? 0 : 1;
  return (
    <Fragment>
      {type === 0 && renderSeparator()}
      {loading ? (
        <View style={styles.loaderContainer}>
          <SmallLoader />
        </View>
      ) : (
        switchValues.map((item, i) => (
          <Fragment key={`key-${i}`}>
            {i !== 0 ? renderSeparator() : null}
            <Text style={styles.subTitleText}>{item.subTitle}</Text>
            {renderSeparator()}
            <ToggleItem
              item={item}
              mainId={i}
              onSwitchChange={onSwitchChange}
              updateSettingsAction={updateSettingsAction}
              userId={userId}
              dispatch={dispatch}
              type={type}
            />
          </Fragment>
        ))
      )}
      {renderSeparator()}
    </Fragment>
  );
};
