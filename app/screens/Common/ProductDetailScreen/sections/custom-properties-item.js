import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Icon, Label } from '#components';

const CustomPropertiesItem = ({ item }) => {
  if (item) {
    return (
      <View style={styles.mainContiner}>
        <View style={{ alignItems: 'center' }}>
          {Object.keys(item)[0] === 'color' ? (
            <View
              style={[
                styles.color,
                {
                  borderWidth: 1,
                  borderColor: 'gray',
                  backgroundColor: `#${item[Object.keys(item)].value}`,
                },
              ]}
            />
          ) : item[Object.keys(item)].icon.includes('https:') ? (
            <Image
              source={{
                uri: item[Object.keys(item)].icon,
              }}
              resizeMode="cover"
              style={styles.icon}
            />
          ) : (
            <Icon
              icon={item[Object.keys(item)].icon}
              style={styles['item-tag__icon']}
            />
          )}
          <View style={styles.mainInfoSection__tag}>
            <Label bold type="active">
              {item[Object.keys(item)].name}
            </Label>
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  mainContiner: {
    marginTop: 12,
    flex: 1,
    maxWidth: 120,
    alignItems: 'flex-start',
  },
  color: {
    height: 24,
    width: 24,
    marginBottom: 8,
    borderRadius: 36,
  },
  'item-tag__icon': {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#969696',
  },
  mainInfoSection__tag: {
    marginTop: 4,
  },
  icon: {
    width: 28,
    height: 28,
    paddingHorizontal: 25,
    tintColor: '#969696',
  },
});

export default CustomPropertiesItem;
