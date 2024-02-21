import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {ProfileCompleteStatus} from './ProfileCompleteStatus';
import {userSelector} from '#modules/User/selectors';
import {getUserInfo} from '#modules/User/actions';
import {getUserNotificationSettings} from '#modules/User/actions';
import {Icon} from '#components';
import {styles} from './styles';
import {generalSelector} from '#modules/General/selectors';
import {getContent} from '#modules/General/actions';
import {useFocusEffect} from '@react-navigation/native';
import CheckConnection from '#utils/connectivity';
import {MainAuthStackNavigation} from '../../../navigators/MainAuthStackNavigation';

const DATA = [
  {
    icon: 'in-person',
    name: 'Dashboard',
    id: 'dashboard',
  },
  {
    icon: 'supplier',
    name: 'Become a supplier',
    id: 'supplier',
  },
  {
    icon: 'invite-friend',
    name: 'Invite a Friend',
    id: 'invite',
  },
  {
    icon: 'settings',
    name: 'Settings',
    id: 'settings',
  },
  {
    icon: 'payment',
    name: 'Payment Management',
    id: 'payment',
  },
  // {
  //   icon: 'privacy-policy',
  //   name: 'Privacy Policy',
  //   id: 'privacy',
  // },
  {
    icon: 'help-feedback',
    name: 'Help and Feedback',
    id: 'help',
  },
  {
    icon: 'user',
    name: 'Contact Us',
    id: 'contact',
  },
];

const onPress = async (id, navigation) => {
  switch (id) {
    case 'dashboard':
      navigation.navigate('Dashboard', {type: 'Dashboard'});
      break;
    case 'supplier':
      navigation.navigate('Supplier', {
        screen: 'SupplierScreen',
        from: 'ProfileMain',
      });
      break;
    case 'invite':
      navigation.navigate('InviteFriend');
      break;
    case 'settings':
      navigation.navigate('AccountSetting');
      break;
    case 'payment':
      navigation.navigate('PaymentManagement');
      break;
    case 'privacy':
      navigation.navigate('PrivacyPolicy');
      break;
    case 'help':
      navigation.navigate('HelpFeedback');
      break;
    case 'contact':
      navigation.navigate('ContactUs');
      break;
    default:
      break;
  }
};

const renderItem = ({item}, navigation) => (
  <TouchableOpacity
    style={styles.itemContainer}
    onPress={() => onPress(item.id, navigation)}>
    <View style={styles.mainItemContainer}>
      <Icon icon={item.icon} style={styles.icon} />
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
    <Icon icon="chevron-right" color="grey" style={styles.rightIcon} />
  </TouchableOpacity>
);

const MainScreen = ({navigation}) => {
  let network = CheckConnection();
  const dispatch = useDispatch();
  const {user} = useSelector(userSelector);

  const {information} = user;
  const percentageCompleted = information?.percentageCompleted ?? 0;
  const validCardPercentage = information?.validCards ? 0.2 : 0;

  const {general} = useSelector(generalSelector);

  const completeProfile = () => {
    navigation.navigate('VerifyAccount');
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(
        getContent({params: `?location=policy&isActive=true`, type: 'all'}),
      );
    }, []),
  );

  useEffect(() => {
    if (information.id) {
      dispatch(getUserInfo({userId: information.id}));
      dispatch(getUserNotificationSettings({userId: information.id}));
    } else {
      if (network === true) {
        MainAuthStackNavigation(navigation);
      }
    }
  }, [dispatch, information.id]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer} />
      <ProfileCompleteStatus
        percent={((percentageCompleted + validCardPercentage) * 100).toFixed(0)}
        info={user.information}
        onPress={completeProfile}
        paymentCardList={user.paymentCardList}
      />
      <FlatList
        data={DATA}
        renderItem={data => renderItem(data, navigation)}
        keyExtractor={item => `key-${item.id}`}
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default MainScreen;
