import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import ExpandableText from 'react-native-expandable-text';
import BodyText from '../BodyText';
import Label from '../Label';
import { margins, paddings } from '#styles/utilities';
import { Fonts } from '#themes';

const CollapsibleText = props => {
  const [collapsed, setCollapsed] = useState(true);
  const [expandable, setExpandable] = useState(false);

  const toggle = () => {
    if (expandable) {
      setCollapsed(!collapsed);
    }
  };

  let arrow = null;
  if (expandable) {
    arrow = (
      <TouchableOpacity onPress={toggle} style={paddings['py-2']}>
        <Label type="active">{collapsed ? 'Read more' : 'Hide'}</Label>
      </TouchableOpacity>
    );
  }
  return (
    <View style={margins['mb-3']}>
      <ExpandableText
        collapsed={collapsed}
        collapseNumberOfLines={props.collapseNumberOfLines}
        onExpandableChange={value => setExpandable(value)}>
        <Text style={styles.text}>{props.text}</Text>
      </ExpandableText>
      {arrow}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    ...Fonts.style.homiBodyTextMedium,
    fontSize: 13,
    fontWeight: 'normal',
    lineHeight: 18,
  },
});

export default CollapsibleText;
