import React from 'react';
import { Text, View, TouchableOpacity , SafeAreaView} from 'react-native';
import { Icon } from '#components';
import { styles } from './styles';

const Items = [
  { id: 'personal-info', icon: 'personal-info', label: 'Personal Information' },
  { id: 'payment-management', icon: 'payment', label: 'Payment Information' },
  { id: 'id-verification', icon: 'id-verification', label: 'ID Verification' },
  { id: 'social-media', icon: 'social-media', label: 'Social Media' },
];

const VerifyAccountScreen = ({ navigation, route }) => {
  const onPress = id => {
    if (id === 'personal-info') {
      navigation.navigate('EditPersonalInfo');
    } else if (id === 'id-verification') {
      navigation.navigate('IDVerification');
    } else if (id === 'social-media') {
      navigation.navigate('SocialMedia');
    } else if (id === 'payment-management') {
      navigation.navigate('PaymentManagement');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {Items.map(item => (
          <TouchableOpacity
            style={styles.itemContainer}
            key={`key-${item.id}`}
            onPress={() => onPress(item.id)}
          >
            <Icon icon={item.icon} style={styles.personIcon} />
            <Text style={styles.itemText}>{item.label}</Text>
            <Icon icon="chevron-right" color="grey" style={styles.arrowIcon} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default VerifyAccountScreen;
