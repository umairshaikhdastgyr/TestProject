import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BodyText, Icon, CheckBoxSquare } from '#components';
import styles from './styles';

const PaymentListHeader = (section, index, isActive) => (
  <View style={styles.listHeader}>
    <Text style={styles.headerText}>{section.title}</Text>
    <Icon
      icon={isActive ? 'chevron-up' : 'chevron-right'}
      style={styles.arrowIcon}
    />
  </View>
);

const PaymentMethodTile = ({
  onPress,
  defaultChange,
  item,
  title,
  icon,
  type,
  defaultState,
  tile,
}) => (
  <TouchableOpacity activeOpacity={0.4} onPress={onPress}>
    <View style={[styles.container, { opacity: 1 }]}>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <View style={styles.leftContainer}>
          {title === 'Google pay' ? <MaterialCommunityIcons style={{ top: -3 }} size={23} name="google" /> : (
            <Icon
              icon={icon}
              style={[{ top: -3 }, title === 'Apple pay' && styles.appleIcon]}
            />
          )}
        </View>
        <View style={styles.rightContainer}>
          <BodyText
            theme="medium"
            bold
            align="left"
            numberOfLines={1}
            style={[
              styles.titleText,
              (type === 'default' && defaultState.state === tile)
              || (type === 'card-item'
                && defaultState.selectedCard?.id === item.id)
                ? styles.titleSelected
                : '',
            ]}
          >
            {title}
          </BodyText>
        </View>
        {type === 'default' ? (
          <View style={styles.arrowContainer}>
            {defaultState.state !== tile && <Icon icon="chevron-right" />}
            {defaultState.state === tile && <Icon icon="chevron-down" />}
          </View>
        ) : (
          <View style={styles.arrowContainer}>
            <Icon icon="chevron-right" />
          </View>
        )}
      </View>
      {type === 'default' && defaultState.state === tile && (
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <CheckBoxSquare
            containerStyle={{ marginBottom: 0, marginTop: 20, paddingLeft: 40 }}
            label="Set as default"
            active={defaultState.default === tile}
            onChange={defaultChange}
          />
        </View>
      )}
    </View>
  </TouchableOpacity>
);

export default PaymentMethodTile;
