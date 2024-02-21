import React, { Component } from 'react';
import { View, Text, Animated, TouchableOpacity, Linking, Image } from 'react-native';
import { styles } from './styles';

export default class SupplierSet extends Component {
  state = {
    springValue: new Animated.Value(0),
  };
  componentDidMount() {
    setTimeout(() => {
      this.startAnimation();
    }, 100);
  }
  startAnimation = () => {
    Animated.sequence([
      Animated.spring(this.state.springValue, {
        toValue: 1,
        duration: 600,
      }),
    ]).start();
  };

  render() {
    const { springValue } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.3 }} />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            source={require('../../../assets/images/tick.png')}
            style={{ alignSelf: 'center' }}
          />
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 50,
          }}
        >
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              color: '#313334',
              fontStyle: 'normal',
              fontFamily: 'Montserrat',
            }}
          >
            You're all Set!{'\n'}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              color: '#313334',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontFamily: 'Montserrat',
            }}
          >
            Be sure to check the email associated{'\n'}
            with your Homitag account for{'\n'}
            information on how to set up your{'\n'}
            supplier account.
          </Text>
        </View>
      </View>
    );
  }
}
