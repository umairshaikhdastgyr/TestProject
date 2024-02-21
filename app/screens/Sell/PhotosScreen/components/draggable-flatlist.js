import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import DraggableFlatList from '#components/DraggableList';
import SelectedPhoto from './selected-photo';

const HomitagDraggableFlatList = ({
  data,
  style,
  setPicSelected,
  navigation,
  removePic,
  screen,
}) => {
  const renderItem = ({ item, index, drag, isActive }) => {
    const newData = [...data];
    const currIndex = newData.findIndex(currentItem => item === currentItem);
    return (
      <>
        <TouchableWithoutFeedback
          delayLongPress={200}
          onPress={() => {
            navigation.navigate('PhotoFullScreen', {
              imageUrl:
                item.type === 'taken-photo'
                  ? `data:image/jpg;base64,${item.image}`
                  : item.image,
              removePic,
              currIndex,
            });
          }}
          onLongPress={drag}
        >
          <View>
            <SelectedPhoto
              key={index}
              data={item}
              index={currIndex}
              isActive={isActive}
              removePic={removePic}
              screen="camera"
              navigation={navigation}
              screenType={screen}
            />
          </View>
        </TouchableWithoutFeedback>
      </>
    );
  };

  return (
    <View style={[style && { ...style }, { flex: 1 }]}>
      <DraggableFlatList
        data={data}
        horizontal
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${index}`}
        onDragEnd={({ data, from, to }) => {
          setPicSelected(data);
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default HomitagDraggableFlatList;
