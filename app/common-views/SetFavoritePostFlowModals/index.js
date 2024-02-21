import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";

import {
  StyleSheet,
  Modal,
  SafeAreaView,
  View,
  Animated,
  Easing,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import SelectAlbumStep from "./steps/select-album-step";
import NewAlbumStep from "./steps/new-album-step";
import { SweetAlert } from "#components";
import { safeAreaNotchHelper } from "#styles/utilities";

import { selectUserData } from "#modules/User/selectors";

const FavoriteFlowModals = ({ post, isVisible, closeModal }) => {
  /* Selectors */
  const { information: userInfo } = useSelector(selectUserData());

  /* States */
  const [activeStep, setActiveStep] = useState("select-album");
  const [albumSelectedInfo, setAlbumSelectedInfo] = useState({});

  const translationOnY = useRef(new Animated.Value(250)).current;
  const opacityBg = useRef(new Animated.Value(0)).current;
  const scaleNew = useRef(new Animated.Value(0.01)).current;

  const [newOnScreen, setNewOnScreen] = useState(false);

  const [alertContent, setAlertContent] = useState({
    title: "",
    message: "",
    type: "success",
    visible: false,
  });

  useEffect(() => {
    if (isVisible === true) {
      Animated.timing(translationOnY, {
        toValue: 0,
        easing: Easing.bezier(0, 0.97, 0.46, 0.99),
        duration: 500,
        useNativeDriver: true,
      }).start();

      Animated.timing(opacityBg, {
        toValue: 1,
        easing: Easing.linear,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, opacityBg, translationOnY]);

  useEffect(() => {
    if (isVisible === true && activeStep === "new-album") {
      setNewOnScreen(true);

      Animated.timing(translationOnY, {
        toValue: 250,
        easing: Easing.bezier(0, 0.97, 0.46, 0.99),
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(scaleNew, {
        toValue: 1,
        easing: Easing.elastic(1),
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    if (isVisible === true && activeStep === "select-album") {
      Animated.timing(translationOnY, {
        toValue: 0,
        easing: Easing.bezier(0, 0.97, 0.46, 0.99),
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(scaleNew, {
        toValue: 0.01,
        easing: Easing.bezier(0, 0.97, 0.46, 0.99),
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        setNewOnScreen(false);
      }, 201);
    }

    if (isVisible === true && activeStep === "saved-message") {
      Animated.timing(scaleNew, {
        toValue: 0.01,
        easing: Easing.bezier(0, 0.97, 0.46, 0.99),
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        setNewOnScreen(false);
        closeModal(true, albumSelectedInfo.name);
        setAlertContent({
          title: "",
          message: `Saved to ${albumSelectedInfo.name}`,
          type: "success",
          visible: true,
        });
      }, 201);
    }
  }, [
    activeStep,
    albumSelectedInfo.name,
    closeModal,
    isVisible,
    scaleNew,
    translationOnY,
  ]);

  useEffect(() => {
    if (alertContent.visible) {
      setTimeout(() => {
        onAlertModalTouchOutside();
      }, 500);
    }
  }, [alertContent.visible, onAlertModalTouchOutside]);

  /* Methods */
  const handleCloseModal = () => {
    closeModal('close');
    setActiveStep("select-album");
  };

  const handleCloseNewModal = () => {
    hideKeyboard();
    setActiveStep("select-album");
  };

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  const onAlertModalTouchOutside = useCallback(() => {
    setActiveStep("select-album");
    setAlertContent((prevState) => ({ ...prevState, visible: false }));
    closeModal();
  }, [closeModal]);

  const childProps = {
    post,
    setActiveStep,
    closeModal: handleCloseModal,
    userInfo,
    closeNewModal: handleCloseNewModal,
    translationOnY,
  };

  return (
    <>
      <Modal
        animationType="none"
        transparent
        visible={isVisible}
        hardwareAccelerated
      >
        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: opacityBg,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />
        <SafeAreaView style={styles.container}>
          <View style={styles["select-album"]}>
            <SelectAlbumStep
              {...childProps}
              setAlbumSelectedInfo={setAlbumSelectedInfo}
            />
          </View>
        </SafeAreaView>

        <Animated.View
          style={[
            styles["new-album"],
            {
              transform: [{ scaleX: scaleNew }, { scaleY: scaleNew }],
              opacity: newOnScreen === true ? 1 : 0,
            },
          ]}
        >
          <TouchableOpacity
            style={{ position: "absolute", width: "100%", height: "100%" }}
            onPress={() => hideKeyboard()}
          />
          <NewAlbumStep
            {...childProps}
            setAlbumSelectedInfo={setAlbumSelectedInfo}
          />
        </Animated.View>

        {activeStep === "select-album" && (
          <SafeAreaView style={safeAreaNotchHelper} />
        )}
      </Modal>
      <SweetAlert
        title={alertContent.title}
        message={alertContent.message}
        type={alertContent.type}
        dialogVisible={alertContent.visible}
        onTouchOutside={onAlertModalTouchOutside}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  "select-album": {
    flex: 1,
    justifyContent: "flex-end",
  },
  "new-album": {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
  "saved-message": {
    flex: 1,
    justifyContent: "center",
  },
});

export default FavoriteFlowModals;
