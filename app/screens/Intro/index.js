import React, { Component } from "react";
import { HeaderBackButton } from "@react-navigation/elements";
import { Text, View, SafeAreaView } from "react-native";
import { Header, NormalButton } from "#components";
import AppIntroSlider from "react-native-app-intro-slider";
import Images from "#assets/images";
import { LocalStorage } from "#services";
import { styles } from "./styles";
import { IntroSlider } from "./IntroSlider";
import { Colors } from "#themes";
import { authSelector } from "#modules/Auth/selectors";
import { connect } from "react-redux";
import { setToken } from "#services/httpclient/clientHelper";

const slides = [
  {
    key: "intro1",
    title: "Make money\nselling",
    label: "Post it, ship it, get paid.",
    source: Images.intro1,
  },
  {
    key: "intro2",
    title: "Buy",
    label:
      "Find deals and buy from sellers & verified suppliers. Have it shipped or picked-up locally.",
    source: Images.intro2,
  },
];

class IntroScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIntroIndex: 0, // 1: next Intro
    };
    this.introSlider = null;
  }

  componentDidMount() {
    this.onInitial();
  }

  onInitial = async () => {
    const isFirstOpen = await LocalStorage.checkIfFirstOpen();
    if (!isFirstOpen && isFirstOpen !== null) {
      this.props.navigation.navigate("MainAuth");
    } else {
      const tokens = await LocalStorage.getTokens();

      setToken(tokens?.token);
      if (tokens) {
        this.props.navigation.navigate("MainAuth");
      }
    }
  };

  onPress = async () => {
    const { activeIntroIndex } = this.state;
    if (activeIntroIndex === 0) {
      this.setState({ activeIntroIndex: 1 }, () => {
        this.introSlider.goToSlide(this.state.activeIntroIndex);
      });
    } else {
      await LocalStorage.setFirstOpened();
      this.props.navigation.navigate("MainAuth");
    }
  };

  onNext = () => {
    const { activeIntroIndex } = this.state;
    this.setState({ activeIntroIndex: activeIntroIndex === 0 ? 1 : 0 }, () => {
      this.introSlider.goToSlide(this.state.activeIntroIndex);
    });
  };

  onSlideChange = (index, lastIndex) => {
    this.setState({ activeIntroIndex: index });
  };

  onSkip = async () => {
    await LocalStorage.setFirstOpened();
    this.props.navigation.navigate("MainAuth");
  };

  renderHeaderLeft = () => {
    if (this.state.activeIntroIndex > 0) {
      return (
        <HeaderBackButton
          tintColor={Colors.inactiveShape}
          onPress={() => {
            this.setState((state, props) => {
              return { activeIntroIndex: state.activeIntroIndex - 1 };
            });
            this.introSlider.goToSlide(0);
          }}
        />
      );
    }
  };

  renderHeaderRight = () => {
    return (
      <View style={styles.headerRightContainer}>
        <Text style={styles.darkText}>SKIP</Text>
      </View>
    );
  };

  renderButton = () => {
    const { activeIntroIndex } = this.state;
    return (
      <View style={[styles.buttonContainer, { paddingVertical: 30 }]}>
        <NormalButton
          label={activeIntroIndex === 0 ? "Next" : "Ok, I’m ready!"}
          buttonStyle={styles.button}
          onPress={this.onPress}
        />
      </View>
    );
  };

  renderIntroSlider = (props) => {
    return <IntroSlider {...props} onNext={this.onNext} />;
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          containerStyle={styles.headerContainer}
          leftComponent={this.renderHeaderLeft()}
          onLeftPress={() => []}
          rightComponent={this.renderHeaderRight()}
          onRightPress={this.onSkip}
        />
        <AppIntroSlider
          ref={(ref) => (this.introSlider = ref)}
          renderItem={this.renderIntroSlider}
          slides={slides}
          hidePagination
          onSlideChange={this.onSlideChange}
        />
        {this.renderButton()}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  ...authSelector(state),
});

export default connect(mapStateToProps)(IntroScreen);
