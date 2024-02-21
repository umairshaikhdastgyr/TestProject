import React, { Component } from "react";
import { CommonActions } from "@react-navigation/native";
import { connect } from "react-redux";
import io from "socket.io-client";
import DropdownAlert from "react-native-dropdownalert";
import { View, Alert, AppState, Platform, StatusBar } from "react-native";
import moment from "moment";
import { LocalStorage } from "#services";
import appConfig from "../../../app.json";

import AppTabNavigator from "../../navigators/AppTabNavigator.js";
import { chatSelector } from "#modules/Chat/selectors";
import { userSelector } from "#modules/User/selectors";
import { notificationSelector } from "#modules/Notifications/selectors";
import {
  receiveChatMsg,
  getChatData,
  receiveConversations,
} from "#modules/Chat/actions";
import { getTokenData, setTokenData } from "#modules/Notifications/actions";
import OneSignal from "react-native-onesignal";
import { getUserInfo } from "#modules/User/actions";
// import { NotifService } from '../../services';
import { SwitchActions } from "@react-navigation/native";
import { signOut as signOutAction } from "#modules/Auth/actions";
import { setPaymentDefault } from "#modules/Orders/actions";

let prevData = "";

class MainScreen extends Component {
  constructor(props) {
    super(props);
    // this.notif = new NotifService(
    //   this.onRegister.bind(this),
    //   this.onNotif.bind(this),
    //   appConfig.senderID,
    // );
    this.state = {
      initialChatCheck: false,
      registerToken: "",
      NotificationTokenChecked: false,
      registerPlatform: "",
      initialNotification: null,
    };

    // console.log(props)
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.user.information.id !== null &&
      (this.props.user.information.id === null ||
        this.props.user.information.id === undefined)
    ) {
      if (this.socket) {
        // this.socket.removeAllListeners();
        // this.socket.close();
      }
    }

    if (
      prevProps.chat.chatInfo !== this.props.chat.chatInfo &&
      this.props.chat.chatInfo === null
    ) {
      // for new fetch
      this.setState({ initialChatCheck: true });

      this.props.receiveConversations({
        userId: this.props.user.information.id,
        lightMode: false,
        origin: "app",
      });
    } else if (
      prevProps.chat.chatInfo !== this.props.chat.chatInfo &&
      this.props.chat.chatInfo !== null &&
      this.state.initialChatCheck === false
    ) {
      // for check new data

      this.setState({ initialChatCheck: true });

      const arrayObj = Object.entries(this.props.chat.chatInfo);

      if (arrayObj.length > 0) {
        arrayObj.sort((a, b) => {
          if (moment(a[1].datetime) > moment(b[1].datetime)) {
            return -1;
          }
          if (moment(a[1].datetime) < moment(b[1].datetime)) {
            return 1;
          }
          return 0;
        });

        this.props.receiveConversations({
          userId: this.props.user.information.id,
          lightMode: false,
          datetime: moment.utc(arrayObj[0][1].datetime).format(),
          origin: "app",
        });
      } else {
        this.props.receiveConversations({
          userId: this.props.user.information.id,
          lightMode: false,
          origin: "app",
        });
      }
    }

    if (
      prevProps.chat.conversationToSeen !==
        this.props.chat.conversationToSeen &&
      this.props.chat.conversationToSeen !== "" &&
      this.props.user !== null
    ) {
      const params = {
        conversationId: this.props.chat.conversationToSeen,
        userId: this.props.user.information.id,
      };
      this.sendSeenAction(params);
    }
  }

  componentDidMount() {
    this.CheckUser();
    this.loadPushToken();
    this.handleNotifications();
  }

  componentWillUnmount() {
    if (this.socket) {
      // this.socket.removeAllListeners();
      // this.socket.close();
    }
  }

  loadPushToken = async () => {
    const pushToken = await OneSignal.getDeviceState();
    OneSignal.setExternalUserId(this.props.user.information.id);
  };

  signOut = async () => {
    const data = {
      state: null,
      selectedCard: { id: null },
      default: null,
      title: null,
      icon: null,
    };
    this.props.setPaymentDefault(data);
    this.props.signOutAction();
  };

  CheckUser = async () => {
    const parentThis = this;

    const userData = await LocalStorage.getUserInformation();

    if (userData && userData.id) {
      this.socket = io(appConfig.socketServer, {
        path: "/socket.io",
        query: `userId=${userData.id}&firstName=${
          userData.firstName
        }&lastName=${userData.lastName}&pictureUrl=${encodeURIComponent(
          userData.profilepictureurl
        )}`,
      });

      // local events:
      // events to dispatch to chat section:
      this.socket.on("new_message", (data) => {
        console.log("new message nnnjjj");
        console.log(data);
        if (prevData !== data) {
          prevData = data;
          const dataObj = JSON.parse(data);
          const title = `${dataObj.receiver.firstName} ${dataObj.receiver.lastName}`;

          if (
            dataObj.message.senderId !== parentThis.props.user.information.id
          ) {
            if (
              dataObj.conversationId !==
              parentThis.props.chat.conversationToSeen
            ) {
              if (AppState.currentState === "active") {
                // setTimeout(() => {
                //   parentThis.sendTopAlert(title, dataObj.message.body, {
                //     typeAlert: 'message',
                //     conversationId: dataObj.conversationId,
                //     source: dataObj.receiver.pictureUrl,
                //   });
                // }, 300000);
              } else {
                // parentThis.notif.localNotif(title, dataObj.message.body, {
                //   typeAlert: 'message',
                //   conversationId: dataObj.conversationId,
                //   source: dataObj.receiver.pictureUrl,
                // });
              }
            }
          }

          setTimeout(() => {
            parentThis.props.receiveChatMsg(data, userData.id);
          }, 10);
        }
      });
      this.socket.on("notification", async (data) => {
        this.props.getUserInfo({ userId: this.props.user.information.id });

        setTimeout(async () => {
          if (this.props?.user?.information?.isBlocked) {
            await this.signOut();
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{ name: "MainAuth" }],
              })
            );
          }
        }, 1000);
      });

      const _socket = this.socket;

      this.socket.on("subscribe_conversation", (data) => {
        const dataReceived = JSON.parse(data);
        _socket.emit(
          "subscribe_conversation",
          JSON.stringify({ conversationId: dataReceived.conversationId })
        );
      });

      this.props.getChatData();

      //this.props.getTokenData();

      // This methods are available for socket interaction

      this.socket.on("connect", (data) => {
        console.log("connect event...");
      });

      this.socket.on("disconnect", (data) => {
        // console.log("disconnect event...");
      });

      this.socket.on("error", (data) => {
        // console.log("error event...");
      });
    }
  };

  sendSeenAction = (params) => {
    if (params.conversationId !== null && params.userId !== null) {
      this.socket.emit(
        "seen_conversation",
        JSON.stringify({
          conversationId: params.conversationId,
          userId: params.userId,
        })
      );
    }
  };

  handleNotifications = () => {
    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      (notificationReceivedEvent) => {
        let notification = notificationReceivedEvent.getNotification();
        const data = notification.additionalData;
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete(notification);
      }
    );

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler((notification) => {
      this.props.navigation.navigate("NotificationScreen");
    });
  };

  sendTopAlert = (title, message, payload) => {
    this.dropDownAlertRef?.alertWithType("success", title, message, payload);
  };

  _onTopAlertTap = async (data) => {
    switch (data.payload.typeAlert) {
      case "message":
        const item = this.props.chat.chatInfo[data.payload.conversationId];
        if (item !== undefined) {
          this.props.navigation.navigate(
            "ChatMain",
            {
              fromNotification: true,
              conversationId: data.payload.conversationId,
            },
            CommonActions.navigate("ChatScreen", {
              item,
              requireReload: data.payload.requireReload,
            })
          );
        } else if (data.payload.requireReload === false) {
          setTimeout(() => {
            this._onTopAlertTap(data);
          }, 500);
        } else {
          // must get data from server
          const arrayObj = Object.entries(this.props.chat.chatInfo);
          arrayObj.sort((a, b) => {
            if (moment(a[1].datetime) > moment(b[1].datetime)) {
              return -1;
            }
            if (moment(a[1].datetime) < moment(b[1].datetime)) {
              return 1;
            }
            return 0;
          });

          if (arrayObj.length > 0) {
            this.props.receiveConversations({
              userId: this.props.user.information.id,
              lightMode: false,
              datetime: moment.utc(arrayObj[0][1].datetime).format(),
              origin: "app",
            });
          } else {
            this.props.receiveConversations({
              userId: this.props.user.information.id,
              lightMode: false,
              origin: "app",
            });
          }

          data.payload.requireReload = false;
          setTimeout(() => {
            this._onTopAlertTap(data);
          }, 500);
        }
        break;
    }
  };

  // notification handlers
  onRegister(token) {
    // Alert.alert("Registered !", JSON.stringify(token));
    this.setState({ registerToken: token.token, registerPlatform: token.os });
  }

  onNotif(notif) {
    let customData = {};

    if (Platform.OS === "ios") {
      if (typeof notif.data.data.customData === "string") {
        customData = JSON.parse(notif.data.data.customData);
      } else {
        customData = notif.data.data.customData;
      }
    } else if (typeof notif.customData === "string") {
      customData = JSON.parse(notif.customData);
    } else {
      customData = notif.customData;
    }

    if (notif.userInteraction === true || notif.foreground === true) {
      // navigate

      if (customData) {
        const dataFromNot = {};
        dataFromNot.payload = {};
        dataFromNot.payload.typeAlert = customData.typeAlert;
        dataFromNot.payload.conversationId = customData.conversationId;
        dataFromNot.payload.requireReload = customData.requireReload;

        this._onTopAlertTap(dataFromNot);
      }
    } else {
      // show top alert
    }
    // Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    Alert.alert("Permissions", JSON.stringify(perms));
  }

  static router = AppTabNavigator.router;

  render() {
    const { navigation } = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "transparent",
        }}
      >
        <StatusBar barStyle="dark-content" />
        <AppTabNavigator navigation={navigation} />
        <DropdownAlert
          ref={(ref) => (this.dropDownAlertRef = ref)}
          onTap={this._onTopAlertTap}
          successColor="#000000CC"
          imageStyle={{
            padding: 8,
            width: 40,
            height: 40,
            borderRadius: 20,
            alignSelf: "center",
          }}
        />
      </View>
    );
  }
}

// export default MainScreen;

const mapStateToProps = (state) => ({
  ...chatSelector(state),
  ...userSelector(state),
  ...notificationSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  receiveChatMsg: (params, user) => dispatch(receiveChatMsg(params, user)),
  getChatData: () => dispatch(getChatData()),
  getUserInfo: (params) => dispatch(getUserInfo(params)),
  receiveConversations: (params) => dispatch(receiveConversations(params)),
  getTokenData: () => dispatch(getTokenData()),
  setPaymentDefault: (params) => dispatch(setPaymentDefault(params)),
  signOutAction: (params) => dispatch(signOutAction(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
