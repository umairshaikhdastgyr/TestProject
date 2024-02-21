import React, { Component } from 'react';
import { View, Text, Animated, Easing, SafeAreaView, Image } from 'react-native';
import { FooterAction } from '#components';
import { flex } from '#styles/utilities';

export default class SupplierPerks extends Component {
  state = {
    left_animation: new Animated.Value(250),
    right_animation: new Animated.Value(-250),
  };
  componentDidMount() {
    setTimeout(() => {
      this.startAnimation();
      this.moveAnimation();
    }, 300);
  }

  startAnimation = () => {
    Animated.timing(this.state.right_animation, {
      toValue: 1,
      duration: 400,
      easing: Easing.linear,
    }).start();
  };
  moveAnimation = () => {
    Animated.timing(this.state.left_animation, {
      toValue: 1,
      duration: 400,
      easing: Easing.linear,
    }).start();
  };

  render() {
    return (
      <SafeAreaView style={[flex.grow1, flex.justifyContentSpace]}>
        <View
          style={[
            flex.grow1,
            { justifyContent: 'space-evenly', paddingHorizontal: 20 },
          ]}
        >
          <View style={[flex.directionRow, flex.justifyContentSpace]}>
            <View
              style={{
                flexDirection: 'column',
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#313334',
                  fontStyle: 'normal',
                  fontFamily: 'Montserrat',
                }}
              >
                Supplier Exclusivity{'\n'}
              </Text>
              <Text
                style={{
                  justifyContent: 'center',
                  color: '#313334',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontFamily: 'Montserrat',
                }}
              >
                Take advantage of exclusivity!{'\n'}
                Suppliers are the only users{'\n'}
                on Homitag that sell brand{'\n'}
                new products
              </Text>
            </View>

            <View style={{ flexDirection: 'column', margin: 15 }}>
              <Image
                source={require('#assets/images/achieve.png')}
              />
            </View>
          </View>
          <View
            style={{ width: '100%', height: 1, backgroundColor: '#F5F5F5' }}
          />
          <View style={[flex.directionRow, flex.justifyContentSpace]}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Image
                source={require('#assets/images/Vector.png')}
              />
            </View>

            <View
              style={{
                flexDirection: 'column',
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#313334',
                  fontStyle: 'normal',
                  fontFamily: 'Montserrat',
                }}
              >
                Exciting Features{'\n'}
              </Text>
              <Text
                style={{
                  justifyContent: 'center',
                  color: '#313334',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontFamily: 'Montserrat',
                }}
              >
                Utilize features like selling{'\n'}
                in bulk, creating a digital{'\n'}
                store-front, and managing{'\n'}
                your products through an{'\n'}
                intuitive dashboard
              </Text>
            </View>
          </View>
          <View
            style={{ width: '100%', height: 1, backgroundColor: '#F5F5F5' }}
          />
          <View style={[flex.directionRow, flex.justifyContentSpace]}>
            <View
              style={{
                flexDirection: 'column',
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#313334',
                  fontStyle: 'normal',
                  fontFamily: 'Montserrat',
                }}
              >
                Share to Earn{'\n'}
              </Text>
              <Text
                style={{
                  justifyContent: 'center',
                  color: '#313334',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontFamily: 'Montserrat',
                }}
              >
                Homitag users can also{'\n'}
                share your items with friends,{'\n'}
                social media, and {'\n'}
                other platforms{'\n'}
                to sell them faster.
              </Text>
            </View>

            <View style={{ flexDirection: 'column', marginTop: 55 }}>
              <Image
                source={require('#assets/images/share.png')}
              />
            </View>
          </View>
        </View>
        <FooterAction
          mainButtonProperties={{
            label: 'Done',
            onPress: () =>
              this.props.navigation.navigate('SupplierSet', {
                from: this.props.navigation.state?.params?.from,
              }),
          }}
        />
      </SafeAreaView>
    );
  }
}
