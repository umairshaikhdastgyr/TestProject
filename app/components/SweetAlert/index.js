import React, { Component } from 'react';
import { Text, Keyboard, TouchableOpacity, Modal, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { Button } from '#components';

import { styles } from './styles';
import { Fonts } from '#themes';

class SweetAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.dialogVisible &&
      (!prevProps.dialogVisible || prevProps.dialogVisible === undefined)
    ) {
      Keyboard.dismiss();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dialogVisible != this.state.isVisible) {
      this.setState({ isVisible: nextProps.dialogVisible });
    }
  }

  onPress() {
    try {
      setTimeout(() => {
        this.props.onTouchOutside();
      }, 200);
      this.setState({ isVisible: false });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    let sourceImg = '';
    let widthImg = this.props.iconWidth ? this.props.iconWidth : 150;
    switch (this.props.type) {
      case 'success':
        sourceImg = require('#assets/lottie/success.json');
        widthImg = 150;
        break;
      case 'warning':
        sourceImg = require('#assets/lottie/warning.json');
        widthImg = 140;
        break;
      case 'error':
        sourceImg = require('#assets/lottie/error.json');
        widthImg = 150;
        break;
      default:
        sourceImg = require('#assets/lottie/success.json');
        widthImg = 150;
        break;
    }
    const { type, boostUnits, boostPrice } = this.props;
    return (
      <Modal
        visible={this.state.isVisible}
        transparent
        onDismiss={() =>
          this.setState({
            isVisible: false,
          })
        }
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#00000060',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.onPress();
            }}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
          />
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => this.onPress()}
              activeOpacity={0.9}
              style={styles.modalTouchContainer}
            >
              <LottieView
                source={sourceImg}
                style={{
                  width: widthImg,
                  height: type === 'warning' ? 70 : 90,
                  marginBottom: type === 'warning' ? 0 : 0,
                }}
                autoPlay
                loop={false}
              />
              {this.props.premessage && (
                <Text style={[styles.msgText, this.props.messageStyle]}>
                  {this.props.premessage}
                </Text>
              )}
              <Text style={styles.titleText}>{this.props.title}</Text>
              <Text style={[styles.msgText, this.props.messageStyle]}>
                {this.props.message}
              </Text>
            </TouchableOpacity>
            {boostUnits > 0 && (
              <>
                <View
                  style={{
                    padding: 20,
                    backgroundColor: '#F5F5F5',
                    width: '100%',
                    marginBottom: 30,
                  }}
                >
                  <Text
                    style={[
                      styles.msgText,
                      { fontFamily: Fonts.family.semiBold },
                    ]}
                  >
                    {`${boostUnits} ${
                      boostUnits > 1 ? 'Boosts' : 'Boost'
                    } Purchased`}
                  </Text>
                  <Text style={[styles.msgText, this.props.messageStyle]}>
                    <Text
                      style={[
                        styles.msgText,
                        { fontFamily: Fonts.family.semiBold },
                      ]}
                    >
                      Total Paid{' '}
                    </Text>
                    ${boostPrice}
                  </Text>
                </View>
              </>
            )}
            {this.props?.onDone ? (
              <View style={{ width: '100%', padding: 20 }}>
                <Button
                  label="Done"
                  theme={'primary'}
                  size="large"
                  fullWidth
                  onPress={() => {
                    this.props?.onDone?.();
                  }}
                />
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    );
  }
}

SweetAlert.defaultProps = {
  dialogVisible: false,
};

export default SweetAlert;
