import React, { Component } from 'react';
import { View, Text, Keyboard, TouchableOpacity, Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import { styles } from './styles';

import { Icon, Button } from '#components';

class PostUpdateAlert extends Component {
  constructor(props) {
    super(props);
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

  render() {
    let isVisible = false;

    if (
      this.props.dialogVisible !== null ||
      this.props.dialogVisible !== undefined
    ) {
      if (this.props.dialogVisible === true) {
        isVisible = true;
      } else {
        isVisible = false;
      }
    }

    return (
      <Modal
        visible={isVisible}
        onRequestClose={() => this.props.onTouchOutside()}
        transparent
      >
        <View style={{flex:1,backgroundColor:'#00000040',alignItems:'center',justifyContent:'center'}}>
        <View style={styles.modalContainer}>
          <View style={styles.topContainer}>
            <LottieView
              source={require('#assets/lottie/success.json')}
              style={{ width: 150, height: 90, marginBottom: -25 }}
              autoPlay
              loop={false}
            />
            <Text style={styles.titleText}>
              {` ${this.props.postName} has been successfully ${
                this.props.type
              }`}
            </Text>
          </View>
          <View style={styles.btnContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>What now?</Text>
            </View>
            <View style={styles.contentContainer}>
              <TouchableOpacity
                onPress={() => this.props.onBtAPressed()}
                activeOpacity={0.6}
              >
                <View style={[styles.btContainer]}>
                  <View style={styles.contentHeaderContainer}>
                    <Text style={styles.contentHeaderTxt}>View</Text>
                  </View>
                  <View style={styles.contentAreaContainer}>
                    <Icon
                      icon="listing_grey"
                      size="medium"
                      style={[styles.btIcon, { width: 26, height: 19 }]}
                    />
                    <Text style={styles.contentAreaText}>View Listing</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.props.onBtBPressed()}
                activeOpacity={0.6}
              >
                <View style={styles.btContainer}>
                  <View style={styles.contentHeaderContainer}>
                    <Text style={styles.contentHeaderTxt}>Boost</Text>
                  </View>
                  <View style={styles.contentAreaContainer}>
                    <Icon
                      icon="boost_grey"
                      size="medium"
                      style={[styles.btIcon, { width: 21.4, height: 25.5 }]}
                    />
                    <Text style={styles.contentAreaText}>Boost Listing</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <Button
              label="Done"
              theme="primary"
              size="large"
              fullWidth
              onPress={() => this.props.onTouchOutside()}
            />
          </View>
        </View>
        </View>
      </Modal>
    );
  }
}

export default PostUpdateAlert;
