import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../theme/Colors';

const EmptyScreen = ({ route }) => {
  const params = route?.params;
  const navigation = useNavigation();
  const [customer, setCustomer] = useState([]);

  useEffect(() => {
  
  }, []);

 
  return (
    <View style={styles.container}>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

export default EmptyScreen;
