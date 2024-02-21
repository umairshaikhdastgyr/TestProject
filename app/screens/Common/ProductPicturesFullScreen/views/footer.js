import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Icon } from "#components";

import { flex, margins, paddings } from "#styles/utilities";

import { selectPostsData } from "#modules/Posts/selectors";
import { selectUserData } from "#modules/User/selectors";
import { deleteIdeaGlobally } from "#modules/Ideas/actions";
import { useActions } from "#utils";
import { Colors } from "#themes";
import { MainAuthStackNavigation } from "../../../../navigators/MainAuthStackNavigation";

const Footer = ({
  setIsVisibleFavoriteModal,
  handleOpenShareOptions,
  navigation,
  postDetail,
  isVisibleFavoriteModal,
  handleFav,
}) => {
  /* Selectors */
  const { information: userInfo } = useSelector(selectUserData());
  const [loader, setLoader] = useState(false);

  /* Actions */
  const actions = useActions({ deleteIdeaGlobally });

  /* Methods */
  const handleDeleteFromFavorites = async () => {
    try {
      setLoader(true);
      await actions.deleteIdeaGlobally({
        postId: postDetail.id,
        userId: userInfo.id,
      });
      handleFav(false);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setLoader(false);
  }, [postDetail.isFavorite, isVisibleFavoriteModal]);

  return (
    <View style={[flex.directionRow, flex.justifyContentEnd, paddings["pb-5"]]}>
      <TouchableOpacity
        style={margins["mr-3"]}
        onPress={handleOpenShareOptions}
      >
        <Icon icon="share" />
      </TouchableOpacity>
      {loader ? (
        <ActivityIndicator size={"small"} color={Colors.active} />
      ) : userInfo?.id !== postDetail?.userId ? (
        <TouchableOpacity
          onPress={() => {
            if (userInfo.id) {
              if (postDetail?.isFavorite !== true) {
                setIsVisibleFavoriteModal(true);
                setLoader(true);
              } else {
                handleDeleteFromFavorites();
              }
            } else {
              MainAuthStackNavigation(navigation);
            }
          }}
        >
          {postDetail?.isFavorite !== true && <Icon icon="like" />}
          {postDetail?.isFavorite == true && (
            <Icon icon="like" color="active" />
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Footer;
