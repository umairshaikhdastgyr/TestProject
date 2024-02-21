import React, { useState, useRef, createRef } from "react";
import { StyleSheet, Animated, Dimensions, Platform } from "react-native";
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from "react-native-gesture-handler";
import DeviceInfo from "react-native-device-info";
import { isIphoneX } from "react-native-iphone-x-helper";
import { CachedImage } from "#components";
import * as Progress from "react-native-progress";
import { Colors } from "#themes";
import { ImageAspectRation } from "#constants";

const { width, height } = Dimensions.get("window");

const FullImageView = ({ image }) => {
  let hasDynamicIsland = DeviceInfo.hasDynamicIsland();
  const [panEnabled, setPanEnabled] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const pinchRef = createRef();
  const panRef = createRef();

  const onPinchEvent = Animated.event(
    [
      {
        nativeEvent: { scale },
      },
    ],
    { useNativeDriver: true }
  );

  const onPanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const handlePinchStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      setPanEnabled(true);
    }

    const nScale = nativeEvent.scale;
    if (nativeEvent.state === State.END) {
      if (nScale < 1) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        setPanEnabled(false);
      }
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onPanEvent}
      ref={panRef}
      simultaneousHandlers={[pinchRef]}
      enabled={panEnabled}
      failOffsetX={[-1000, 1000]}
      shouldCancelWhenOutside
    >
      <Animated.View>
        <PinchGestureHandler
          ref={pinchRef}
          onGestureEvent={onPinchEvent}
          simultaneousHandlers={[panRef]}
          onHandlerStateChange={handlePinchStateChange}
        >
          <Animated.View
            style={{ transform: [{ scale }, { translateX }, { translateY }] }}
          >
            {/* <Animated.Image
            source={{
              uri: image,
            }}
            style={[
              styles.filledImageView,
              {
                transform: [{ scale }, { translateX }, { translateY }],
                marginTop: hasDynamicIsland || isIphoneX() || Platform.OS == 'android' ? "38%" : 70,
              },
            ]}
            resizeMode="contain"
          /> */}
            <CachedImage
              source={{
                uri: image,
              }}
              style={[
                styles.filledImageView,
                {
                  marginTop:
                    hasDynamicIsland || isIphoneX() || Platform.OS == "android"
                      ? "38%"
                      : 70,
                },
              ]}
              indicator={Progress.Pie}
              resizeMode="contain"
              indicatorProps={{
                size: 30,
                borderWidth: 0,
                color: Colors.primary,
                unfilledColor: Colors.white,
              }}
            />
          </Animated.View>
        </PinchGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    marginRight: 24,
  },
  filledImageView: {
    width: width,
    aspectRatio: ImageAspectRation,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

export default FullImageView;
