import React, { useEffect } from "react";
import { StyleSheet, ColorValue, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface Props {
  color: ColorValue;
  durationMs?: number;
  testID?: string;
  size?: number;
}

const LoadingSpinner = ({
  color,
  durationMs = 1000,
  testID,
  size = 24,
}: Props): JSX.Element => {
  const rotationDegree = useSharedValue(0);

  const rotateZ = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotationDegree.value}deg`,
        },
      ],
    };
  });

  useEffect(() => {
    rotationDegree.value = withRepeat(
      withTiming(360, {
        duration: durationMs,
        easing: Easing.linear,
      }),
      -1 // Infinite loop
    );
  }, [durationMs, rotationDegree]);

  const borderRadius = size / 2;

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      className="bg-transparent"
      accessibilityRole="progressbar"
    >
      <View style={[styles.background, { borderColor: color, borderRadius }]} />

      <Animated.View
        testID={testID}
        style={[
          styles.progress,
          { borderTopColor: color, borderRadius },
          rotateZ,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    width: "100%",
    height: "100%",
    borderWidth: 3,
    opacity: 0.25,
  },
  progress: {
    width: "100%",
    height: "100%",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderWidth: 3,
    position: "absolute",
  },
});

export default LoadingSpinner;
