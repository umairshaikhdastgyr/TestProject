import React, { useEffect, useState } from 'react';
import { Image, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { userSelector } from '#modules/User/selectors';
import Images from '#assets/images';
import { Icon } from '#components';
import { styles } from './styles';

const ITEMS = [
  { id: 0, label: 'Verify Account' },
  { id: 1, label: 'Payment Management' },
];

const EditProfileScreen = ({ navigation, route }) => {
  const { user } = useSelector(userSelector);
  const [profileImg, setProfileImg] = useState(
    _.get(user.information, 'profilepictureurl', null),
  );
  const onPress = index => {
    switch (index) {
      case 0:
        navigation.navigate('VerifyAccount');
        break;
      case 1:
        navigation.navigate('PaymentManagement');
        break;
      default:
        navigation.navigate('EditPersonalInfo');
        break;
    }
  };

  useEffect(() => {
    const img = _.get(user.information, 'profilepictureurl', null);
    setProfileImg(img);
  }, [user.information]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoContainer}>
        {profileImg && (
          <Image source={{ uri: profileImg }} style={styles.userImg} />
        )}
        {!profileImg && (
          <Image source={Images.userPlaceholder} style={styles.userImg} />
        )}
        <View style={styles.userSubInfoContainer}>
          <Text style={styles.blackBoldText} numberOfLines={2}>
            {_.get(user.information, 'name', '')}
          </Text>
          <TouchableOpacity onPress={() => onPress(2)}>
            <Text style={styles.activeText}>Edit Personal Information</Text>
          </TouchableOpacity>
        </View>
      </View>
      {ITEMS.map((item, index) => (
        <TouchableOpacity
          style={styles.itemContainer}
          key={`key-${index}`}
          onPress={() => onPress(index)}
        >
          <Text style={styles.blackText}>{item.label}</Text>
          <Icon icon="chevron-right" color="grey" style={styles.arrowIcon} />
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};

export default EditProfileScreen;
