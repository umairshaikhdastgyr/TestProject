import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from '#components';
import { styles } from './styles';

const renderPreviewImage = (item, index) => {
  return <Image style={styles.previewImage} source={item.source} resizeMethod="resize" resizeMode="contain"/>;
};

const renderIntroLabel = (item, index, onNext) => {
  return (
    <View style={styles.introLabelContainer}>
      <TouchableOpacity
        style={styles.arrowTouchContainer}
        disabled={index === 0}
        onPress={onNext}
      >
        <Icon icon="chevron-left" color={index === 0 ? 'grey' : 'active'} />
      </TouchableOpacity>
      <Text style={styles.introLabelText}>{item.title}</Text>
      <TouchableOpacity
        style={styles.arrowTouchContainer}
        disabled={index === 1}
        onPress={onNext}
      >
        <Icon icon="chevron-right" color={index === 1 ? 'grey' : 'active'} />
      </TouchableOpacity>
    </View>
  );
};

const renderIntroDescription = (item, index) => {
  return <Text style={styles.descripText}>{item.label}</Text>;
};

export const IntroSlider = ({ item, index, onNext }) => {
  return (
    <View style={[styles.container, {alignItems: 'center'}]}>
      {renderPreviewImage(item, index)}
      {renderIntroLabel(item, index, onNext)}
      {renderIntroDescription(item, index)}
      <View style={styles.dotsContainer}>
        <View style={index === 0 ? styles.activeDot : styles.dot} />
        <View
          style={
            index === 1
              ? [styles.activeDot, { marginLeft: 5, marginRight: 0 }]
              : styles.dot
          }
        />
      </View>
    </View>
  );
};
