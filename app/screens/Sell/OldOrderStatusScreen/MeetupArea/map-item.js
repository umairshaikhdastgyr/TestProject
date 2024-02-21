
import React from 'react';
import { View } from 'react-native';
import { flex, margins } from '#styles/utilities';
import { Icon, BodyText } from '#components';


const MapItem = ({ icon, data }) => (
  <View
    style={{
      ...flex.directionRow,
      ...flex.alignItemsCenter,
      paddingHorizontal: 20,
      marginBottom: 10,
    }}
  >
    <Icon icon={icon} style={margins['mr-1']} />
    <BodyText theme="underline">{data}</BodyText>
  </View>
);

export default MapItem;
