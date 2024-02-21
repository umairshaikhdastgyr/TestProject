import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { Label, Tag } from '#components';
import { paddings, flex, margins } from '#styles/utilities';
import { Fonts } from '#themes';

const ExperienceSection = ({ experience, setExperience, sellerName }) => (
  <View style={styles.container}>
    <Label bold size="medium" style={{ textAlign: 'center', fontSize: 15 }}>
      How would you describe your experience {'\n'}with {sellerName}?
    </Label>
    <Label size="medium" style={{ textAlign: 'center' }}>
    {'\n'}
    Please select all that apply.
    </Label>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        ...paddings['px-3'],
        ...paddings['py-2'],
        ...flex.directionRow,
      }}
      style={{ marginTop: 35 }}>
      {['TIMELY', 'FRIENDLY','COMMUNICATIVE'].map(e => (
        <Tag
          key={e}
          label={e}
          active={experience.includes(e)}
          onPress={() => {
            if (experience.includes(e)) {
              let copy = experience;
              const filteredCopy = copy.filter(c => c !== e);
              setExperience(filteredCopy);
            } else {
              setExperience([...experience, e]);
            }
          }}
          style={margins['mb-0']}
        />
      ))}
    </ScrollView>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        ...paddings['px-3'],
        ...paddings['py-2'],
        ...flex.directionRow,
      }}>
      {['ITEM AS DESCRIBED'].map(e => (
        <Tag
          key={e}
          label={e}
          active={experience.includes(e)}
          onPress={() => {
            if (experience.includes(e)) {
              let copy = experience;
              const filteredCopy = copy.filter(c => c !== e);
              setExperience(filteredCopy);
            } else {
              setExperience([...experience, e]);
            }
          }}
          style={margins['mb-0']}
        />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
});
export default ExperienceSection;
