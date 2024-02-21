import { call, put, takeLatest, select } from "redux-saga/effects";
import moment from "moment";
import _ from "lodash";
import { LocalStorage } from "#services";
import {
  sendMessage as sendMessageApi,
  receiveConversations as receiveConversationsApi,
  updateConversations as updateConversationsApi,
} from "#services/apiChat";

import {
  RECEIVE_CHAT_MSG,
  SEND_MESSAGE,
  RECEIVE_CONVERSATIONS,
  CHAT,
  GET_CHAT_DATA,
  CLEAR_BADGE,
  SEEN_CONVERSATION,
  UPDATE_CONVERSATION_VISIBILITY,
} from "./constants";
import { SET_NOTIFICATIONS } from "../Notifications/constants";
import { success, failure } from "../utils";

function* receiveChatMsg({ type, payload, userId }) {
  const response = JSON.parse(payload);
  const selectForChat = (state) => state[CHAT];
  const userData = (state) => state.user;
  const { information: userInfo } = yield select(userData);
  const stateData = yield select(selectForChat);
  const newData = { ...stateData.chatInfo };

  if (
    response.message.senderId !== userId ||
    (response.message.customInfo &&
      response.message.customInfo.sendToAll &&
      response.message.customInfo.sendToAll === true)
  ) {
    if (newData[response.conversationId] != null) {
      newData[response.conversationId].senderId = response.message.senderId;
      newData[response.conversationId].message = response.message.body;
      newData[response.conversationId].datetime = moment(
        response.message.datetime
      ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ");
      newData[response.conversationId].badgeCount += 1;

      if (response.message.customInfo) {
        newData[response.conversationId].customInfo =
          response.message.customInfo;
      } else {
        delete newData[response.conversationId].customInfo;
      }
      // check if exist current day
      const sectionFilter = moment(response.message.datetime)
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss.SSSSZ");
      const sectionIndex = newData[
        response.conversationId
      ].conversation.sections.findIndex(
        (section) => section.datetime === sectionFilter
      );

      if (sectionIndex !== -1) {
        // if exists, push in their data
        if (response.message.customInfo) {
          newData[response.conversationId].conversation.sections[
            sectionIndex
          ].data.unshift({
            datetime: moment(response.message.datetime).format(
              "YYYY-MM-DDTHH:mm:ss.SSSSZ"
            ),
            message: response.message.body,
            senderId: response.message.senderId,
            datetimeSeen: response.message.datetimeSeen,
            customInfo: response.message.customInfo,
          });
        } else {
          newData[response.conversationId].conversation.sections[
            sectionIndex
          ].data.unshift({
            datetime: moment(response.message.datetime).format(
              "YYYY-MM-DDTHH:mm:ss.SSSSZ"
            ),
            message: response.message.body,
            senderId: response.message.senderId,
            datetimeSeen: response.message.datetimeSeen,
          });
        }
      } else {
        // else, create a new section and add data
        const dateSection = moment(response.message.datetime).startOf("day");
        if (response.message.customInfo) {
          newData[response.conversationId].conversation.sections.unshift({
            title: dateSection.toString(),
            datetime: dateSection.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
            data: [
              {
                datetime: moment(response.message.datetime).format(
                  "YYYY-MM-DDTHH:mm:ss.SSSSZ"
                ),
                message: response.message.body,
                senderId: response.message.senderId,
                datetimeSeen: response.message.datetimeSeen,
                customInfo: response.message.customInfo,
              },
            ],
          });
        } else {
          newData[response.conversationId].conversation.sections.unshift({
            title: dateSection.toString(),
            datetime: dateSection.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
            data: [
              {
                datetime: moment(response.message.datetime).format(
                  "YYYY-MM-DDTHH:mm:ss.SSSSZ"
                ),
                message: response.message.body,
                senderId: response.message.senderId,
                datetimeSeen: response.message.datetimeSeen,
              },
            ],
          });
        }
      }

      yield call(LocalStorage.setChatData, newData);
      yield put({ type: success(type), newData });
    } else {
      // new conversation
      console.log("-=response-=-=-=-", JSON.stringify(response));
      newData[response.conversationId] = {};
      newData[response.conversationId].senderId = response?.message?.senderId;
      newData[response.conversationId].message = response?.message?.body;
      newData[response.conversationId].sellerId = response?.seller?.id;
      newData[response.conversationId].sellerFirstName = response?.message
        ?.customInfo?.sellerInfo?.firstName
        ? response?.message?.customInfo?.sellerInfo?.firstName
        : response?.seller?.firstName;
      newData[response.conversationId].sellerLastName = response?.message
        ?.customInfo?.sellerInfo?.lastName
        ? response?.message?.customInfo?.sellerInfo?.lastName
        : response?.seller?.lastName;
      newData[response.conversationId].urlImage = response?.seller?.pictureUrl;
      newData[response.conversationId].datetime = moment(
        response.message.datetime
      ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ");
      newData[response.conversationId].badgeCount = 1;

      if (response.message.customInfo) {
        newData[response.conversationId].customInfo =
          response.message.customInfo;
      }

      newData[response.conversationId].receiver = {};

      if (response.receiver.id !== userId) {
        newData[response.conversationId].receiver.userId = response.receiver.id;
        newData[response.conversationId].receiver.firstName =
          response.receiver.firstName;
        newData[response.conversationId].receiver.lastName =
          response.receiver.lastName;
        newData[response.conversationId].receiver.pictureUrl =
          response.receiver.pictureUrl;
      } else {
        newData[response.conversationId].receiver.userId = response?.seller?.id;
        newData[response.conversationId].receiver.firstName = response?.message
          ?.customInfo?.sellerInfo?.firstName
          ? response?.message?.customInfo?.sellerInfo?.firstName
          : response?.seller?.firstName;
        newData[response.conversationId].receiver.lastName = response?.message
          ?.customInfo?.sellerInfo?.lastName
          ? response?.message?.customInfo?.sellerInfo?.lastName
          : response?.seller?.lastName;
        newData[response.conversationId].receiver.pictureUrl =
          response?.seller?.pictureUrl;
      }

      newData[response.conversationId].post = {};
      newData[response.conversationId].post.id = response?.post?.id;
      newData[response.conversationId].post.title = response?.post?.title;
      newData[response.conversationId].post.urlImage = response?.post?.urlImage;
      newData[response.conversationId].conversation = {};
      newData[response.conversationId].conversation.sections = [];

      const dateSection = moment(response?.message?.datetime).startOf("day");
      if (response?.message?.customInfo) {
        newData[response.conversationId].conversation.sections.unshift({
          title: dateSection.toString(),
          datetime: dateSection.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
          data: [
            {
              datetime: moment(response.message.datetime).format(
                "YYYY-MM-DDTHH:mm:ss.SSSSZ"
              ),
              message: response?.message?.body,
              senderId: response?.message?.senderId,
              datetimeSeen: response?.message?.datetimeSeen,
              customInfo: response?.message?.customInfo,
            },
          ],
        });
      } else {
        newData[response.conversationId].conversation.sections.unshift({
          title: dateSection.toString(),
          datetime: dateSection.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
          data: [
            {
              datetime: moment(response?.message?.datetime).format(
                "YYYY-MM-DDTHH:mm:ss.SSSSZ"
              ),
              message: response?.message?.body,
              senderId: response?.message?.senderId,
              datetimeSeen: response?.message?.datetimeSeen,
            },
          ],
        });
      }

      yield call(LocalStorage.setChatData, newData);

      yield put({ type: success(type), newData });
    }
  }
}

function* sendMessage({ type, payload }) {
  const userData = (state) => state.user;
  const { information: userInfo } = yield select(userData);
  const response = yield call(sendMessageApi, payload);
  const errorMsg = _.get(response, "status", null);

  console.log(errorMsg);
  if (errorMsg != "success") {
    yield put({ type: failure(type), errorMsg: errorMsg ? errorMsg : 500 });
  } else {
    const selectForChat = (state) => state[CHAT];
    const stateData = yield select(selectForChat);

    const newData = { ...stateData.chatInfo };

    if (newData[response.conversationId] != null) {
      // add message
      newData[response.conversationId].senderId = response.senderId;
      newData[response.conversationId].message = response.message;
      newData[response.conversationId].datetime = moment(
        response.datetime
      ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ");
      newData[response.conversationId].badgeCount = 0;
      // check if exist current day
      const sectionFilter = moment(response.datetime)
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ss.SSSSZ");
      const sectionIndex = newData[
        response.conversationId
      ].conversation.sections.findIndex(
        (section) => section.datetime === sectionFilter
      );

      if (sectionIndex !== -1) {
        // if exists, push in their data

        if (response.customInfo) {
          newData[response.conversationId].conversation.sections[
            sectionIndex
          ].data[0] = {
            datetime: moment(response.datetime).format(
              "YYYY-MM-DDTHH:mm:ss.SSSSZ"
            ),
            message: response.message,
            senderId: response.senderId,
            datetimeSeen: null,
            customInfo: response.customInfo,
          };

          // newData[response.conversationId].conversation.sections[
          //   sectionIndex
          // ].data.unshift({
          //   datetime: moment(response.datetime).format(
          //     'YYYY-MM-DDTHH:mm:ss.SSSSZ',
          //   ),
          //   message: response.message,
          //   senderId: response.senderId,
          //   datetimeSeen: null,
          //   customInfo: response.customInfo,
          // });
        } else {
          newData[response.conversationId].conversation.sections[
            sectionIndex
          ].data[0] = {
            datetime: moment(response.datetime).format(
              "YYYY-MM-DDTHH:mm:ss.SSSSZ"
            ),
            message: response.message,
            senderId: response.senderId,
            datetimeSeen: null,
          };

          // newData[response.conversationId].conversation.sections[
          //   sectionIndex
          // ].data.unshift({
          //   datetime: moment(response.datetime).format(
          //     'YYYY-MM-DDTHH:mm:ss.SSSSZ',
          //   ),
          //   message: response.message,
          //   senderId: response.senderId,
          //   datetimeSeen: null,
          // });
        }
      } else {
        // else, create a new section and add data
        const dateSection = moment(response.datetime).startOf("day");
        if (response.customInfo) {
          newData[response.conversationId].conversation.sections[0] = {
            title: dateSection.toString(),
            datetime: dateSection.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
            data: [
              {
                datetime: moment(response.datetime).format(
                  "YYYY-MM-DDTHH:mm:ss.SSSSZ"
                ),
                message: response.message,
                senderId: response.senderId,
                datetimeSeen: null,
                customInfo: response.customInfo,
              },
            ],
          };
        } else {
          newData[response.conversationId].conversation.sections[0] = {
            title: dateSection.toString(),
            datetime: dateSection.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
            data: [
              {
                datetime: moment(response.datetime).format(
                  "YYYY-MM-DDTHH:mm:ss.SSSSZ"
                ),
                message: response.message,
                senderId: response.senderId,
                datetimeSeen: null,
              },
            ],
          };
        }
      }
    } else {
      // create conversation
      newData[response.conversationId] = {};
      newData[response.conversationId].senderId = response.senderId;
      newData[response.conversationId].message = response.message;
      newData[response.conversationId].sellerId = response.sellerId;
      newData[response.conversationId].sellerFirstName =
        response.sellerFirstName;
      newData[response.conversationId].sellerLastName = response.sellerLastName;
      newData[response.conversationId].urlImage = response.urlImage;
      newData[response.conversationId].datetime = moment(
        response.datetime
      ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ");
      newData[response.conversationId].badgeCount = 0;

      newData[response.conversationId].receiver = {};
      newData[response.conversationId].receiver.userId = response.sellerId;
      newData[response.conversationId].receiver.firstName =
        response.sellerFirstName;
      newData[response.conversationId].receiver.lastName =
        response.sellerLastName;
      newData[response.conversationId].receiver.pictureUrl = response.urlImage;

      newData[response.conversationId].post = {};
      newData[response.conversationId].post.id = response.postId;
      newData[response.conversationId].post.title = response.postTitle;
      newData[response.conversationId].post.urlImage = response.postUrlImage;
      newData[response.conversationId].conversation = {};
      newData[response.conversationId].conversation.sections = [];

      const dateSection = moment(response.datetime).startOf("day");
      if (response.customInfo) {
        newData[response.conversationId].conversation.sections.unshift({
          title: dateSection.toString(),
          datetime: dateSection.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
          data: [
            {
              datetime: moment(response.datetime).format(
                "YYYY-MM-DDTHH:mm:ss.SSSSZ"
              ),
              message: response.message,
              senderId: response.senderId,
              customInfo: response.customInfo,
            },
          ],
        });
      } else {
        newData[response.conversationId].conversation.sections.unshift({
          title: dateSection.toString(),
          datetime: dateSection.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
          data: [
            {
              datetime: moment(response.datetime).format(
                "YYYY-MM-DDTHH:mm:ss.SSSSZ"
              ),
              message: response.message,
              senderId: response.senderId,
            },
          ],
        });
      }
    }

    yield call(LocalStorage.setChatData, newData);
    yield put({ type: success(type), newData });
  }
}

export function* receiveConversations({ type, payload }) {
  const userData = (state) => state.user;
  const { information: userInfo } = yield select(userData);
  const response = yield call(receiveConversationsApi, payload);
  let errorMsg = _.get(response, "error", null);
  if (errorMsg) {
    yield put({ type: failure(type), errorMsg });
  } else if (payload.datetime != null) {
    // incremental function
    if (response?.conversations?.length > 0) {
      // do merge
      const selectForChat = (state) => state[CHAT];

      const stateData = yield select(selectForChat);
      const newData = { ...stateData.chatInfo };
      // check if conversation exists:
      for (let i = 0; i < response.conversations.length; i++) {
        if (newData[response.conversations[i].id] != null) {
          // already exists, only is required add the new messages
          newData[response.conversations[i].id].senderId =
            response.conversations[i].messagesData.messages.senderId;
          newData[response.conversations[i].id].message =
            response.conversations[i].messagesData.messages.body;
          newData[response.conversations[i].id].datetime = moment(
            response.conversations[i].updatedAt
          ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ");
          if (response.conversations[i].messagesData.messages.customInfo) {
            newData[response.conversations[i].id].customInfo =
              response.conversations[i].messagesData.messages.customInfo;
          }

          // check if exist current day
          const sectionFilter = moment(
            response.conversations[i].messagesData.messages.datetime
          )
            .startOf("day")
            .format("YYYY-MM-DDTHH:mm:ss.SSSSZ");
          const sectionIndex = newData[
            response.conversations[i].id
          ].conversation.sections.findIndex(
            (section) => section.datetime === sectionFilter
          );

          if (sectionIndex !== -1) {
            // if exists, push in their data
            if (response.conversations[i].messagesData.messages.customInfo) {
              newData[response.conversations[i].id].conversation.sections[
                sectionIndex
              ].data.unshift({
                datetime: moment(
                  response.conversations[i].messagesData.messages.datetime
                ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
                message: response.conversations[i].messagesData.messages.body,
                senderId:
                  response.conversations[i].messagesData.messages.senderId,
                datetimeSeen:
                  response.conversations[i].messagesData.messages.datetimeSeen,
                customInfo:
                  response.conversations[i].messagesData.messages.customInfo,
              });
            } else {
              newData[response.conversations[i].id].conversation.sections[
                sectionIndex
              ].data.unshift({
                datetime: moment(
                  response.conversations[i].messagesData.messages.datetime
                ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
                message: response.conversations[i].messagesData.messages.body,
                senderId:
                  response.conversations[i].messagesData.messages.senderId,
                datetimeSeen:
                  response.conversations[i].messagesData.messages.datetimeSeen,
              });
            }
          } else {
            // else, create a new section and add data
            const dateSection = moment(response.datetime).startOf("day");
            if (response.conversations[i].messagesData.messages.customInfo) {
              newData[
                response.conversations[i].id
              ].conversation.sections.unshift({
                title: dateSection.toString(),
                datetime: dateSection.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
                data: [
                  {
                    datetime: moment(
                      response.conversations[i].messagesData.messages.datetime
                    ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
                    message:
                      response.conversations[i].messagesData.messages.body,
                    senderId:
                      response.conversations[i].messagesData.messages.senderId,
                    datetimeSeen:
                      response.conversations[i].messagesData.messages
                        .datetimeSeen,
                    customInfo:
                      response.conversations[i].messagesData.messages
                        .customInfo,
                  },
                ],
              });
            } else {
              newData[
                response.conversations[i].id
              ].conversation.sections.unshift({
                title: dateSection.toString(),
                datetime: dateSection.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
                data: [
                  {
                    datetime: moment(
                      response.conversations[i].messagesData.messages.datetime
                    ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
                    message:
                      response.conversations[i].messagesData.messages.body,
                    senderId:
                      response.conversations[i].messagesData.messages.senderId,
                    datetimeSeen:
                      response.conversations[i].messagesData.messages
                        .datetimeSeen,
                  },
                ],
              });
            }
          }

          if (
            response.conversations[i].messagesData.messages.datetimeSeen ===
              null &&
            response.conversations[i].messagesData.messages.senderId !==
              payload?.userId
          ) {
            newData[response.conversations[i].id].badgeCount += 1;
          }
        } else {
          // will be required create the conversation
          newData[response.conversations[i].id] = {};
          newData[response.conversations[i].id].senderId =
            response.conversations[i].messagesData.messages.senderId;
          newData[response.conversations[i].id].message =
            response.conversations[i].messagesData.messages.body;
          newData[response.conversations[i].id].datetime = moment(
            response.conversations[i].updatedAt
          ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ");

          if (response.conversations[i].messagesData.messages.customInfo) {
            newData[response.conversations[i].id].customInfo =
              response.conversations[i].messagesData.messages.customInfo;
          }

          const seller = response.conversations[i].messagesData.members.find(
            (member) => member.isSeller === true
          );
          const sellerObj = response.users.find(
            (user) => user.userId === seller?.userId
          );

          newData[response.conversations[i].id].sellerId = sellerObj?.userId;
          newData[response.conversations[i].id].sellerFirstName =
            sellerObj?.firstName;
          newData[response.conversations[i].id].sellerLastName =
            sellerObj?.lastName;
          newData[response.conversations[i].id].urlImage =
            sellerObj?.pictureUrl;

          const receiver = response.conversations[i].messagesData.members.find(
            (member) => member?.userId !== payload?.userId
          );
          const receiverObj = response.users.find(
            (user) => user?.userId === receiver?.userId
          );

          newData[response.conversations[i].id].receiver = {};
          newData[response.conversations[i].id].receiver.userId =
            receiverObj?.userId;
          newData[response.conversations[i].id].receiver.firstName =
            receiverObj?.firstName;
          newData[response.conversations[i].id].receiver.lastName =
            receiverObj.lastName;
          newData[response.conversations[i].id].receiver.pictureUrl =
            receiverObj.pictureUrl;

          newData[response.conversations[i].id].badgeCount = 0;
          newData[response.conversations[i].id].post = {};
          newData[response.conversations[i].id].post.id =
            response.conversations[i].messagesData.postId;
          newData[response.conversations[i].id].order =
            response.conversations[i].messagesData.order;
          newData[response.conversations[i].id].post.title =
            response.conversations[i].messagesData.post.title;
          newData[response.conversations[i].id].post.urlImage =
            response.conversations[i].messagesData.post.urlImage;
          newData[response.conversations[i].id].conversation = {};
          newData[response.conversations[i].id].conversation.sections = [];

          const sections = [];

          const dateSection = moment(
            response.conversations[i].messagesData.messages.datetime
          ).startOf("day");
          if (response.conversations[i].messagesData.messages.customInfo) {
            sections.unshift({
              title: dateSection.toString(),
              datetime: dateSection.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
              data: [
                {
                  datetime: moment(
                    response.conversations[i].messagesData.messages.datetime
                  ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
                  message: response.conversations[i].messagesData.messages.body,
                  senderId:
                    response.conversations[i].messagesData.messages.senderId,
                  datetimeSeen:
                    response.conversations[i].messagesData.messages
                      .datetimeSeen,
                  customInfo:
                    response.conversations[i].messagesData.messages.customInfo,
                },
              ],
            });
          } else {
            sections.unshift({
              title: dateSection.toString(),
              datetime: dateSection.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
              data: [
                {
                  datetime: moment(
                    response.conversations[i].messagesData.messages.datetime
                  ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
                  message: response.conversations[i].messagesData.messages.body,
                  senderId:
                    response.conversations[i].messagesData.messages.senderId,
                  datetimeSeen:
                    response.conversations[i].messagesData.messages
                      .datetimeSeen,
                },
              ],
            });
          }

          if (
            response.conversations[i].messagesData.messages.datetimeSeen ===
              null &&
            response.conversations[i].messagesData.messages.senderId !==
              payload.userId
          ) {
            newData[response.conversations[i].id].badgeCount += 1;
          }

          newData[response.conversations[i].id].conversation.sections =
            sections;
        }
      }
      yield call(LocalStorage.setChatData, newData);
      yield put({ type: success(type), newData });
    } else {
      errorMsg = {};
      yield put({ type: failure(type), errorMsg });
    }
  } else {
    // total update
    const newData = {};
    if (response?.conversations?.length > 0) {
      for (let i = 0; i < response.conversations?.length; i++) {
        newData[response.conversations[i].id] = {};
        newData[response.conversations[i].id].senderId =
          response.conversations[i].messagesData.messages[
            response.conversations[i].messagesData.messages.length - 1
          ].senderId;
        newData[response.conversations[i].id].message =
          response.conversations[i].messagesData.messages[
            response.conversations[i].messagesData.messages.length - 1
          ].body;
        newData[response.conversations[i].id].datetime = moment(
          response.conversations[i].messagesData.messages[
            response.conversations[i].messagesData.messages.length - 1
          ].datetime
        ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ");

        if (
          response.conversations[i].messagesData.messages[
            response.conversations[i].messagesData.messages.length - 1
          ].customInfo
        ) {
          newData[response.conversations[i].id].customInfo =
            response.conversations[i].messagesData.messages[
              response.conversations[i].messagesData.messages.length - 1
            ].customInfo;
        }

        const seller = response.conversations[i].messagesData.members.find(
          (member) => member.isSeller === true
        );
        const sellerObj = response.users.find(
          (user) => user.userId === seller?.userId
        );

        newData[response.conversations[i].id].sellerId = sellerObj?.userId;
        newData[response.conversations[i].id].sellerFirstName =
          sellerObj?.firstName;
        newData[response.conversations[i].id].sellerLastName =
          sellerObj?.lastName;
        newData[response.conversations[i].id].urlImage = sellerObj?.pictureUrl;

        const receiver = response.conversations[i].messagesData.members.find(
          (member) => member.userId !== payload.userId
        );
        const receiverObj = response.users.find(
          (user) => user?.userId === receiver?.userId
        );

        newData[response.conversations[i].id].receiver = {};
        newData[response.conversations[i].id].receiver.userId =
          receiverObj?.userId || "";
        newData[response.conversations[i].id].receiver.firstName =
          receiverObj?.firstName || "";
        newData[response.conversations[i].id].receiver.lastName =
          receiverObj?.lastName || "";
        newData[response.conversations[i].id].receiver.pictureUrl =
          receiverObj?.pictureUrl;

        newData[response.conversations[i].id].badgeCount = 0;
        newData[response.conversations[i].id].post = {};
        newData[response.conversations[i].id].post.id =
          response.conversations[i].messagesData.postId;
        newData[response.conversations[i].id].post.title =
          response.conversations[i].messagesData.post.title;
        newData[response.conversations[i].id].post.urlImage =
          response.conversations[i].messagesData.post.urlImage;
        newData[response.conversations[i].id].conversation = {};
        newData[response.conversations[i].id].conversation.sections = [];

        const sections = [];

        for (
          let j = 0;
          j < response.conversations[i].messagesData.messages.length;
          j++
        ) {
          const sectionFilter = moment(
            response.conversations[i].messagesData.messages[j].datetime
          )
            .startOf("day")
            .format("YYYY-MM-DDTHH:mm:ss.SSSSZ");
          const sectionIndex = sections.findIndex(
            (section) => section.datetime === sectionFilter
          );

          if (sectionIndex !== -1) {
            // if exists, push in their data
            if (response.conversations[i].messagesData.messages[j].customInfo) {
              sections[sectionIndex].data.unshift({
                datetime: moment(
                  response.conversations[i].messagesData.messages[j].datetime
                ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
                message:
                  response.conversations[i].messagesData.messages[j].body,
                senderId:
                  response.conversations[i].messagesData.messages[j].senderId,
                datetimeSeen:
                  response.conversations[i].messagesData.messages[j]
                    .datetimeSeen,
                customInfo:
                  response.conversations[i].messagesData.messages[j].customInfo,
              });
            } else {
              sections[sectionIndex].data.unshift({
                datetime: moment(
                  response.conversations[i].messagesData.messages[j].datetime
                ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
                message:
                  response.conversations[i].messagesData.messages[j].body,
                senderId:
                  response.conversations[i].messagesData.messages[j].senderId,
                datetimeSeen:
                  response.conversations[i].messagesData.messages[j]
                    .datetimeSeen,
              });
            }
          } else {
            // else, create a new section and add data
            const dateSection = moment(
              response.conversations[i].messagesData.messages[j].datetime
            ).startOf("day");

            if (response.conversations[i].messagesData.messages[j].customInfo) {
              sections.unshift({
                title: dateSection.toString(),
                datetime: dateSection.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
                data: [
                  {
                    datetime: moment(
                      response.conversations[i].messagesData.messages[j]
                        .datetime
                    ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
                    message:
                      response.conversations[i].messagesData.messages[j].body,
                    senderId:
                      response.conversations[i].messagesData.messages[j]
                        .senderId,
                    datetimeSeen:
                      response.conversations[i].messagesData.messages[j]
                        .datetimeSeen,
                    customInfo:
                      response.conversations[i].messagesData.messages[j]
                        .customInfo,
                  },
                ],
              });
            } else {
              sections.unshift({
                title: dateSection.toString(),
                datetime: dateSection.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
                data: [
                  {
                    datetime: moment(
                      response.conversations[i].messagesData.messages[j]
                        .datetime
                    ).format("YYYY-MM-DDTHH:mm:ss.SSSSZ"),
                    message:
                      response.conversations[i].messagesData.messages[j].body,
                    senderId:
                      response.conversations[i].messagesData.messages[j]
                        .senderId,
                    datetimeSeen:
                      response.conversations[i].messagesData.messages[j]
                        .datetimeSeen,
                  },
                ],
              });
            }
          }

          if (
            response.conversations[i].messagesData.messages[j].datetimeSeen ===
              null &&
            response.conversations[i].messagesData.messages[j].senderId !==
              payload.userId
          ) {
            newData[response.conversations[i].id].badgeCount += 1;
          }
        }

        newData[response.conversations[i].id].conversation.sections = sections;
      }
      yield call(LocalStorage.setChatData, newData);
      yield put({ type: success(type), newData });
    } else {
      errorMsg = {};
      yield put({ type: failure(type), errorMsg });
    }
  }
}

function* getChatData({ type }) {
  // const userInfo = (state) => state.user.information;
  const userData = (state) => state.user;
  const { information: userInfo } = yield select(userData);
  const newData = yield call(LocalStorage.getChatData);
  yield put({ type: success(type), newData });
}

function* clearBadges({ type, payload }) {
  if (payload.conversationId != null) {
    const newData = yield call(LocalStorage.getChatData);
    if (newData[payload.conversationId].badgeCount !== 0) {
      newData[payload.conversationId].badgeCount = 0;
      yield call(LocalStorage.setChatData, newData);

      yield put({ type: success(type), newData });
    } else {
      const errorMsg = "";
      yield put({ type: failure(type), errorMsg });
    }
  } else {
    const errorMsg = "";
    yield put({ type: failure(type), errorMsg });
  }
}

function* seenConversation({ type, payload }) {
  const userData = (state) => state.user;
  const { information: userInfo } = yield select(userData);
  const selectForChat = (state) => state[CHAT];
  const stateData = yield select(selectForChat);
  const newData = { ...stateData.chatInfo };
  const { conversationId } = payload;
  if (conversationId) {
    newData[conversationId].badgeCount = 0;
    for (
      let j = 0;
      j < newData[conversationId].conversation.sections.length;
      j++
    ) {
      for (
        let k = 0;
        k < newData[conversationId].conversation.sections[j].data.length;
        k++
      ) {
        newData[conversationId].conversation.sections[j].data[k].datetimeSeen =
          moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSSZ");
      }
    }
    yield call(LocalStorage.setChatData, newData);
    // yield put({ type: success(GET_CHAT_DATA), newData });
    const response = yield call(updateConversationsApi, conversationId);
    yield put({ type: success(type), conversationId });
  } else {
    yield put({ type: success(type), conversationId });
  }
}

function* updateConversationVisibility({ type, payload }) {
  const userData = (state) => state.user;
  const { information: userInfo } = yield select(userData);
  const selectForChat = (state) => state[CHAT];
  const stateData = yield select(selectForChat);
  const newData = { ...stateData.chatInfo };
  const { conversationId, status } = payload;
  if (conversationId) {
    newData[conversationId].badgeCount = 0;
    for (
      let j = 0;
      j < newData[conversationId].conversation.sections.length;
      j++
    ) {
      for (
        let k = 0;
        k < newData[conversationId].conversation.sections[j].data.length;
        k++
      ) {
        if (
          newData[conversationId].conversation.sections[j].data[k].customInfo
            .type === status
        ) {
          newData[conversationId].conversation.sections[j].data[k].visibity =
            "hidden";
        }
      }
    }
    yield call(LocalStorage.setChatData, newData);
    // yield put({ type: success(GET_CHAT_DATA), newData });
    yield put({ type: success(type), conversationId });
  } else {
    yield put({ type: success(type), conversationId });
  }
}

export default function* actionWatcher() {
  yield takeLatest(RECEIVE_CHAT_MSG, receiveChatMsg);
  yield takeLatest(SEND_MESSAGE, sendMessage);
  yield takeLatest(RECEIVE_CONVERSATIONS, receiveConversations);
  yield takeLatest(GET_CHAT_DATA, getChatData);
  yield takeLatest(CLEAR_BADGE, clearBadges);
  yield takeLatest(SEEN_CONVERSATION, seenConversation);
  yield takeLatest(
    UPDATE_CONVERSATION_VISIBILITY,
    updateConversationVisibility
  );
}
