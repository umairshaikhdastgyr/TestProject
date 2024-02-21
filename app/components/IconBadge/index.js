import React from "react";
import { View } from "react-native";
import style from "./styles";
class IconBadge extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[
          style.MainView,
          this.props.MainViewStyle ? this.props.MainViewStyle : {}
        ]}
      >
        {
          // main element
          this.props.MainElement
        }
        {!this.props.Hidden && (
          <View
            style={[
              style.IconBadge,
              this.props.IconBadgeStyle ? this.props.IconBadgeStyle : {}
            ]}
          >
            {
              // badge element
              this.props.BadgeElement
            }
          </View>
        )}
      </View>
    );
  }
}

export default IconBadge;
