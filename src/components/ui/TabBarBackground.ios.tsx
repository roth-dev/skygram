import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  useAnimatedReaction,
  interpolateColor,
} from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";
import { useSegments } from "expo-router";
import { useMemo } from "react";

export default function BlurTabBarBackground() {
  const isFocused = useIsFocused();
  const segments = useSegments();
  const opacity = useSharedValue(0);

  const isVideoFeed = useMemo(() => {
    return (
      segments.indexOf("video-feed") !== -1 ||
      segments.indexOf("(video-feed)") !== -1 ||
      segments.indexOf("video-player") !== -1
    );
  }, [segments]);

  useAnimatedReaction(
    () => ({ isFocused, isVideoFeed }),
    (current) => {
      if (current.isVideoFeed) {
        opacity.value = withTiming(current.isFocused ? 1 : 0, {
          duration: 150,
        });
      } else {
        opacity.value = withTiming(0, {
          duration: 150,
        });
      }
    },
    [isFocused, isVideoFeed]
  );

  const blurViewStyle = useAnimatedStyle(() => ({
    opacity: 1 - opacity.value,
  }));

  const blackBgStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    backgroundColor: interpolateColor(
      opacity.value,
      [0, 1],
      ["transparent", "#000000"]
    ),
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, blackBgStyle]} />
      <Animated.View style={[StyleSheet.absoluteFill, blurViewStyle]}>
        <BlurView
          tint="systemChromeMaterial"
          intensity={80}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return bottom + tabHeight;
}
