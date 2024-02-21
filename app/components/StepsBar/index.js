import React from 'react';

import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '#themes';

const StepsBar = ({ steps, step }) => {
  const renderSteps = () => {
    const stepsToRender = [];
    for (let index = 0; index < steps; index++) {
      stepsToRender.push(
        <View
          key={index}
          style={[styles.step, index < step && styles.stepActive]}
        />,
      );
    }
    return stepsToRender;
  };

  return <View style={styles.container}>{renderSteps()}</View>;
};

StepsBar.defaultProps = {
  steps: 1,
  step: 1,
};

const styles = StyleSheet.create({
  container: {
    height: 7,
    width: '100%',
    backgroundColor: 'rgba(196, 196, 196, 0.2)',
    flexDirection: 'row',
  },
  step: {
    flex: 1,
    height: 7,
  },
  stepActive: {
    backgroundColor: Colors.active,
  },
});

export default StepsBar;
