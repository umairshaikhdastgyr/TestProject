import React, { Component } from 'react';
import {
  View, Text, Keyboard, TouchableOpacity,Modal
} from 'react-native';

import { styles } from './styles';

import { Button, Icon, RadioButton } from '#components';
import { check } from 'prettier';

class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      checked: CONTACTUS_SUBJECT.ITEM_RETURN.title,
      selectedOption: CONTACTUS_SUBJECT.ITEM_RETURN.value
    };
  }


  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.dialogVisible === true
      && (prevProps.dialogVisible === false
        || prevProps.dialogVisible === undefined)
    ) {
      Keyboard.dismiss();
    }

    if (prevProps.dialogVisible !== this.props.dialogVisible) {
      this.setState({ isVisible: this.props.dialogVisible });
    }
  }

  onPress() {
    try {
      this.setState({ isVisible: false });
      this.props.onTouchOutside();
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { checked, selectedOption } = this.state;
    return (
      <Modal
          animationType="fade"
          visible={this.state.isVisible}
          onRequestClose={() => {
            this.onPress()
          }}
          transparent
        >
          <View
            style={{
              backgroundColor: "#00000080",
              flex: 1,
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#ffffff",
                width: "90%",
                borderRadius: 5,
                ...styles.modalContainer
              }}
            >
     
          <View style={styles.topContainer}>
            <Text style={styles.titleText}>{this.props.title}</Text>
            <TouchableOpacity
              onPress={() => this.onPress()}
              activeOpacity={0.9}
              style={styles.exitBt}
            >
              <Icon size="medium" icon="close" />
            </TouchableOpacity>
          </View>
          <View style={styles.margin}>
            <RadioButton
              isActive={checked === CONTACTUS_SUBJECT.ITEM_RETURN.title}
              label={CONTACTUS_SUBJECT.ITEM_RETURN.title}
              onPress={() => this.setState({
                checked: CONTACTUS_SUBJECT.ITEM_RETURN.title,
                selectedOption: CONTACTUS_SUBJECT.ITEM_RETURN.value
              })}
            />
          </View>
          <View style={styles.margin}>
            <RadioButton
              isActive={checked === CONTACTUS_SUBJECT.ITEM_CANCEL.title}
              label={CONTACTUS_SUBJECT.ITEM_CANCEL.title}
              onPress={() => this.setState({
                checked: CONTACTUS_SUBJECT.ITEM_CANCEL.title,
                selectedOption: CONTACTUS_SUBJECT.ITEM_CANCEL.value
              })}
            />
          </View>
          <View style={styles.margin}>
            <RadioButton
              isActive={checked === CONTACTUS_SUBJECT.ITEM_ORDER.title}
              label={CONTACTUS_SUBJECT.ITEM_ORDER.title}
              onPress={() => this.setState({
                checked: CONTACTUS_SUBJECT.ITEM_ORDER.title,
                selectedOption: CONTACTUS_SUBJECT.ITEM_ORDER.value
              })}
            />
          </View>
          <View style={styles.margin}>
            <RadioButton
              isActive={checked === CONTACTUS_SUBJECT.ITEM_INVENTORY.title}
              label={CONTACTUS_SUBJECT.ITEM_INVENTORY.title}
              onPress={() => this.setState({
                checked: CONTACTUS_SUBJECT.ITEM_INVENTORY.title,
                selectedOption: CONTACTUS_SUBJECT.ITEM_INVENTORY.value
              })}
            />
          </View>
          <View style={styles.margin}>
            <RadioButton
              isActive={checked === CONTACTUS_SUBJECT.ITEM_POSTING.title}
              label={CONTACTUS_SUBJECT.ITEM_POSTING.title}
              onPress={() => this.setState({
                checked: CONTACTUS_SUBJECT.ITEM_POSTING.title,
                selectedOption: CONTACTUS_SUBJECT.ITEM_POSTING.value
              })}
            />
          </View>
          <View style={styles.margin}>
            <RadioButton
              isActive={checked === CONTACTUS_SUBJECT.ITEM_OTHER.title}
              label={CONTACTUS_SUBJECT.ITEM_OTHER.title}
              onPress={() => this.setState({
                checked: CONTACTUS_SUBJECT.ITEM_OTHER.title,
                selectedOption: CONTACTUS_SUBJECT.ITEM_OTHER.value
              })}
            />
          </View>
          <View style={styles.contentContainer}>
            <Button
              label={this.props.mainBtTitle}
              theme="primary"
              size="large"
              fullWidth
              onPress={() => this.props.onMainButtonPressed(checked,selectedOption)}
            />
          </View>
          </View>
          </View>
      </Modal>
    );
  }
}

Dialog.defaultProps = {
  dialogVisible: false,
};
const CONTACTUS_SUBJECT = {
  ITEM_RETURN: { value: 'item_return', title: 'Item Return' },
  ITEM_ORDER: { value: 'item_order', title: 'Cancel Order' },
  ITEM_INVENTORY: { value: 'item_inventory', title: 'Item Inventory' },
  ITEM_CANCEL: { value: 'item_cancel', title: 'Cancel Item' },
  ITEM_POSTING: {
    value: 'item_posting', title: 'Item Posting'
  },
  ITEM_OTHER: { value: 'item_other', title: 'Other' }
}

export default Dialog;
