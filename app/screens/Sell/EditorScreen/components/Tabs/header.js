import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CloseButton from '../../../../../navigators/components/close-button';
import { Fonts } from '#themes';
const Header = ({ handleCloseEditorClick, navigation }) => (
  <View style={styles.container}>
    {Platform.OS === 'ios' ? (
      <TouchableWithoutFeedback
        onPress={() => {
          handleCloseEditorClick();
        }}
        style={{ paddingHorizontal: 5 }}
      >
        <Icon
          name="chevron-left"
          size={37}
          color="#959595"
          style={{ marginLeft: -2.2 }}
          onPress={() => {
            handleCloseEditorClick();
          }}
        />
      </TouchableWithoutFeedback>
    ) : (
      <TouchableWithoutFeedback
        onPress={() => {
          handleCloseEditorClick();
        }}
        style={{ paddingHorizontal: 10 }}
      >
        <Ionicons
          name="md-arrow-back"
          onPress={() => {
            handleCloseEditorClick();
          }}
          size={25}
          style={{ marginLeft: 10 }}
          color="#848584"
        />
      </TouchableWithoutFeedback>
    )}
    <Text
      style={{
        fontFamily: Fonts.family.regular,
        fontWeight: '600',
        color: '#343637',
      }}
    >
      Edit Post
    </Text>
    <CloseButton
    style={{marginRight: 10}}
      navigation={navigation}
      onPress={() => handleCloseEditorClick()}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 3,
    elevation: 1,
    backgroundColor: '#fff',
  },
});

export default Header;
