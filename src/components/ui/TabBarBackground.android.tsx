import { StyleSheet, View } from "react-native";
import { useIsFocused, useRoute } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  useAnimatedReaction,
} from "react-native-reanimated";
import { useMemo } from "react";
import { useSegments } from "expo-router";

export default function TabBarBackground() {
  const isFocused = useIsFocused();
  const opacity = useSharedValue(1);
  const segments = useSegments();
  const isVideoFeed = useMemo(() => {
    return (
      segments.indexOf("video-feed") !== -1 ||
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

  const whiteBgStyle = useAnimatedStyle(() => ({
    opacity: 1 - opacity.value,
  }));

  const blackBgStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "black" },
          blackBgStyle,
        ]}
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "#ffffff" },
          whiteBgStyle,
        ]}
      />
    </View>
  );
}

export function useBottomTabOverflow() {
  return 0;
}
