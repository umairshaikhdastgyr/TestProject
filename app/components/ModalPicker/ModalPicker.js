import React, { Component } from 'react';
import {
  Modal,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CloseButton from '../../navigators/components/close-button';

export default class ModalPicker extends Component {
  state = {
    state: '',
    selectedValue: null,
    selectedText: null,
    modalVisible: false,
  };

  onModalPickerClose = () => {
    this.setState({ modalVisible: false });
  };

  componentDidMount = () => {
    this.props.defaultValue
      && this.setState({ selectedText: this.props.defaultValue });
  };

  onSelect(text, value) {
    this.setState({
      selectedValue: value,
      selectedText: text,
      modalVisible: false,
    });
    this.props.onChange(value);
  }

  render() {
    // const renderList = this.props.data.map(datum => {
    //   return (
    //     <ModalPickerItem
    //       onPress={() => this.onSelect(datum)}
    //       label={datum.label}
    //     />
    //   );
    // });
    return (
      <View>
        <TouchableWithoutFeedback
          onPress={() => this.setState({ modalVisible: true })}
        >
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderColor: '#B9B9B9',
            }}
          >
            <Text
              style={{
                fontSize: 15,
                paddingBottom: 10,
                color: this.state.selectedText
                  ? '#000000' : '#B9B9B9',

                fontFamily: 'Montserrat-Regular',
                flex: 1,
              }}
            >
              {this.state.selectedText
                ? this.state.selectedText
                : this.props.placeholder}
            </Text>
            <Ionicons
              name="ios-arrow-down"
              size={13}
              style={{ paddingHorizontal: 5 }}
              color="#8d847d"
            />
          </View>
        </TouchableWithoutFeedback>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={this.onModalPickerClose}
        >
          <View
            style={{

              alignItems: 'flex-end',
              justifyContent: 'center',
              marginHorizontal: 10,

              marginTop: 40,
            }}
          >
            <CloseButton onPress={this.onModalPickerClose} />

          </View>
          <ScrollView>
            <View>
              <View style={{ paddingLeft: 5 }}>{this.props.children}</View>
            </View>
          </ScrollView>
        </Modal>
      </View>
    );
  }
}
