import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '#components';
import SelectedDraggblePhotos from '#screens/Sell/MainScreen/views/selected-draggble-photos';
import ListingType from '#screens/Sell/MainScreen/views/listing-type';
import { flex } from '#styles/utilities';
import styles from '../../styles';
import { Colors } from '#themes';

const CreatePostTab = ({ navigation, emptyImageAlert, fromScreen }) => {
  return (
    <View style={[flex.grow1, flex.justifyContentStart]}>
      <ScrollView>
        <Button
          label="Add Photos"
          redAsterisk
          icon="camera"
          theme="secondary-rounded"
          style={styles.addPhotosButton}
          onPress={() =>
            navigation.navigate(
              fromScreen === 'profile' ? 'SellPhotosProfile' : 'SellPhotos',
            )
          }
        />

        {emptyImageAlert && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: -25,
            }}
          >
            <Text
              style={{
                color: Colors.red,
                fontFamily: 'Montserrat-Regular',
              }}
            >
              Please add at least one picture
            </Text>
          </View>
        )}
        <SelectedDraggblePhotos navigation={navigation} />
        <ListingType fromEditor />
      </ScrollView>
    </View>
  );
};

export default CreatePostTab;
