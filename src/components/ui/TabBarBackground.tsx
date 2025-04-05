import { StyleSheet, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  useAnimatedReaction,
} from "react-native-reanimated";

export default function TabBarBackground() {
  const isFocused = useIsFocused();
  const opacity = useSharedValue(1);

  useAnimatedReaction(
    () => isFocused,
    (focused) => {
      opacity.value = withTiming(focused ? 0 : 1, {
        duration: 300,
      });
    },
    [isFocused]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: "black" }]}
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "#ffffff" },
          animatedStyle,
        ]}
      />
    </View>
  );
}

export function useBottomTabOverflow() {
  return 0;
}
