import React, { Component } from 'react';
import { View, Text, Animated, Easing, Image, SafeAreaView } from 'react-native';
import { FooterAction } from '#components';
import { SupplierPerkScreen } from '..';
import { flex } from '#styles/utilities';
import { getUserInfo } from '#modules/User/actions';
import {
  EmailSend
} from '#services/apiChat';
import { ActivityIndicator } from 'react-native-paper';
import { connect } from 'react-redux';
import { selectUserData, userSelector } from '#modules/User/selectors';

export class Supplier extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    animation: new Animated.Value(250),
    load:false,
  };
  
  componentDidMount() {
    this.props.getUserInfo(this.props.user?.information?.id)
    setTimeout(() => {
      this.startAnimation();
    }, 600);
  }

  startAnimation = () => {
    Animated.timing(this.state.animation, {
      toValue: 1,
      duration: 400,
      easing: Easing.linear,
    }).start();
  };

  sendEmail = async() =>{
    this.setState({
      load:true,
    })
    const userEmail = this?.props?.user?.information?.email;

    const resEmail= await EmailSend(userEmail);

    if(resEmail && resEmail?.result && resEmail?.result?.success == false){
      this.setState({
        load:false,
      })
      alert(resEmail?.result?.content?.message)
    }else{
      this.setState({
        load:false,
      })
      this.props.navigation.navigate('SupplierPerks', {
        screen: SupplierPerkScreen,
        from: this.props.navigation.state?.params?.from,
      })
    }
  }

  render() {
    return (
      <SafeAreaView style={[flex.grow1, flex.justifyContentSpace]}>
        <View
          style={{
            flex: 0.45,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <Image
            source={require('#assets/images/supp.png')}
            //style={{ left: this.state.animation }}
          />
        </View>
        <View
          style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}
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
            Whats a Supplier?{'\n'}
          </Text>

          <Text
            style={{
              textAlign: 'center',
              color: '#313334',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontFamily: 'Montserrat',
            }}
          >
            Suppliers are Bussiness owners with a{'\n'}
            lot of merchandise to sell.{'\n'}
            {'\n'}Homitag offers suppliers exclusive tools{'\n'}
            and features to make selling in bulk a breeze.{'\n'}
            Click below to learn more and signup today!
          </Text>
        </View>
        {this.state.load? 
        <FooterAction
        mainButtonProperties={{
          label: <ActivityIndicator color="#fff" size={"small"} />,
          onPress:this.sendEmail
        }}
      /> 
      :
        <FooterAction
          mainButtonProperties={{
            label: this.props.user.information.becomeSupplier == true ? 'Your request is' : 'Next',
            subLabel: this.props.user.information.becomeSupplier == true ? 'already sent' : 'Supplier Perks',
            onPress:this.sendEmail,
            disabled: this.props.user.information.becomeSupplier == true,
          }}
        />
  }
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  ...userSelector(state),
});

const mapDispatchToProps = dispatch => ({
  profileSetup: param => dispatch(profileSetup(param)),
  requestCode: (param, userID, verificationType) =>
    dispatch(requestCode(param, userID, verificationType)),
  getUserInfo: (userId) =>{
    dispatch(getUserInfo({userId: userId}))},
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Supplier);
// const styles = StyleSheet.create({

// });
