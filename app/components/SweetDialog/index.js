import React, { Component } from 'react';
import {
  View, Text, Keyboard, TouchableOpacity,Modal
} from 'react-native';

import { styles } from './styles';

import { Icon, Button } from '#components';

class SweetDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
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
    return (
      <Modal
        useNativeDriver={true}
        visible={this.state.isVisible}
        onRequestClose={() => this.onPress()}
        transparent
      >
        <View
          style={{
            backgroundColor: "#00000080",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.topContainer}>
              {this.props.logout && (
                <View style={[styles.logoutBt]}>
                  <Icon style={{ height: 20, width: 14 }} icon="logout" />
                </View>
              )}
              <Text
                style={
                  this.props.title == "Delete payment method"
                    ? styles.titleCardText
                    : styles.titleText
                }
              >
                {this.props.title}
              </Text>
              {this.props.title === "Delete payment method" ? (
                <></>
              ) : (
                <TouchableOpacity
                  onPress={() => this.onPress()}
                  activeOpacity={0.9}
                  style={styles.exitBt}
                >
                  <Icon size="medium" icon="close" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.contentContainer}>
              <Text
                style={
                  this.props.title == "Delete payment method"
                    ? styles.msgCardText
                    : styles.msgText
                }
              >
                {this.props.message}
              </Text>
              <Button
                label={this.props.mainBtTitle}
                theme="primary"
                size="large"
                fullWidth
                onPress={() => this.props.onMainButtonPressed()}
              />
              {this.props.secondaryBtTitle &&
                this.props.onSecondaryButtonPressed && (
                  <>
                    <View style={{ height: 20 }} />
                    <Button
                      label={this.props.secondaryBtTitle}
                      theme="secondary"
                      size="large"
                      fullWidth
                      onPress={() => this.props.onSecondaryButtonPressed()}
                    />
                  </>
                )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

SweetDialog.defaultProps = {
  dialogVisible: false,
};

export default SweetDialog;
