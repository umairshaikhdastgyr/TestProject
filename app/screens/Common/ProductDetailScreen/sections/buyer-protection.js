import React from 'react';

import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Icon, Link } from '#components';
import { Colors } from '#themes';

const BuyerProtection = ({ prModalVisibleAction }) => {
  return (
    <TouchableOpacity onPress={() => { prModalVisibleAction(true); }} style={styles.container}>
      <Icon icon="homitag-h" size="medium-large" style={styles.icon} />
      <Link theme="active">Shipping buyer protection</Link>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 26,
    marginBottom: 28,
  },
  icon: {
    marginRight: 4,
  },
});

export default BuyerProtection;
