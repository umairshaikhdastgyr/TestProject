import React, { Component } from "react";
import { View, Text, Keyboard, TouchableOpacity, Modal } from "react-native";
import LottieView from "lottie-react-native";
import { styles } from "./styles";

import { Icon, Button } from "#components";
import colors from "#themes/colors";

class SweetCustomAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.dialogVisible === true &&
      (prevProps.dialogVisible === false ||
        prevProps.dialogVisible === undefined)
    ) {
      Keyboard.dismiss();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.dialogVisible != this.state.isVisible
    ) {
      this.setState({ isVisible: nextProps.dialogVisible });
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
        animationType="fade"
        transparent
        visible={this.state.isVisible}
        onRequestClose={() => {
          this.onPress();
        }}
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
          <View style={styles.modalContainer}>
            <View style={styles.topContainer}>
              <Text style={styles.titleText}>Congratulations!</Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.textContainer}>
                <Text style={[styles.msgText]}>
                  You successfully listed{" "}
                  <Text style={[styles.msgText, styles.msgTextBold]}>
                    {this.props.postTitle}
                  </Text>
                </Text>
              </View>
              <View style={styles.btnsContainer}>
                <TouchableOpacity
                  onPress={() => this.props.onBtAPressed()}
                  activeOpacity={0.6}
                >
                  <View style={styles.btContainer}>
                    <Icon icon="return" size="medium" style={styles.btIcon} />
                    <Text style={styles.btText}>Post Another</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.onBtBPressed()}
                  activeOpacity={0.6}
                >
                  <View style={styles.btContainer}>
                    <Icon icon="listing" size="medium" style={styles.btIcon} />
                    <Text style={styles.btText}>View Listing</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.onBtCPressed() } activeOpacity={0.6}>
                  <View style={styles.btContainer}>
                    <Icon icon="rocket" size='medium' style={styles.btIcon} />
                    <Text style={styles.btText}>Boost Listing</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.footerContainer}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.onShareItem();
                  }}
                  activeOpacity={0.6}
                  style={styles.shareOpacity}
                >
                  <Text style={[styles.doneText, { color: colors.primary }]}>
                    Share Item
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.onDonePressed()}
                  activeOpacity={0.6}
                  style={styles.doneOpacity}
                >
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

SweetCustomAlert.defaultProps = {
  dialogVisible: false,
};

export default SweetCustomAlert;
