import * as React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import PropTypes from 'prop-types';

import { BodyText } from '#components';
import { Fonts } from '#themes';

const DeliveryCarrier = ({
  item,
  style,
  onPress,
  checkedViewStyle,
  uncheckedViewStyle,
}) => {
  const renderCheckedView = () => {
    if (item.selected && item.selected === true) {
      return <View style={[checkedViewStyle && checkedViewStyle]} />;
    }
    return <View style={[uncheckedViewStyle && uncheckedViewStyle]} />;
  };

  const renderProviderImage = () => {
    if (item.urlProvider) {
      return (
        <Image
          resizeMode="contain"
          style={{ width: 80, height: 25 }}
          source={{ uri: item.urlProvider }}
        />
      );
    }
  };

  const renderBody = () => {
    if (item.provider && item.rate) {
      return (
        <BodyText
          theme="inactive"
          size="medium"
          style={{ textTransform: 'uppercase',fontSize:14 }}
        >
          {item.provider} ${item.rate} ({item?.deliverTimeRange[0]}-
          {item?.deliverTimeRange[1]} days)
        </BodyText>
      );
    }
  };

  return (
    <TouchableOpacity
      style={[style && style]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {renderCheckedView()}
      {/* {renderUncheckedView()} */}
      {renderProviderImage()}
      {renderBody()}
    </TouchableOpacity>
  );
};

DeliveryCarrier.defaultProps = {
  onPress: () => [],
  item: {
    selected: false,
    urlProvider: '',
    provider: '',
    rate: null || 0,
  },
};

DeliveryCarrier.propTypes = {
  style: PropTypes.object,
  checkedViewStyle: PropTypes.object,
  uncheckedViewStyle: PropTypes.object,
  onPress: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
};

export default DeliveryCarrier;
