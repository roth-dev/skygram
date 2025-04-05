import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { useCallback, useRef } from "react";

interface HapticTabProps extends BottomTabBarButtonProps {
  onDoubleTap?: () => void;
}

export function HapticTab(props: HapticTabProps) {
  const lastTap = useRef<number>(0);

  const handlePress = useCallback(
    (ev: any) => {
      const now = Date.now();
      const DOUBLE_PRESS_DELAY = 300;

      if (props.onPressIn) {
        props.onPressIn(ev);
      }

      if (process.env.EXPO_OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
        // Double tap detected
        if (props.onDoubleTap) {
          props.onDoubleTap();
          if (process.env.EXPO_OS === "ios") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        }
      }

      lastTap.current = now;
    },
    [props.onPressIn, props.onDoubleTap]
  );

  return <PlatformPressable {...props} onPressIn={handlePress} />;
}
