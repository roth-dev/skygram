import { useInteractionState } from "@/hooks/useInteractionState";
import { forwardRef, PropsWithChildren } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

interface PressableWithHover extends PressableProps {
  hoverStyle: StyleProp<ViewStyle>;
}

export const PressableWithHover = forwardRef<
  View,
  PropsWithChildren<PressableWithHover>
>(function PressableWithHoverImpl(
  { children, style, hoverStyle, ...props },
  ref
) {
  const {
    state: hovered,
    onIn: onHoverIn,
    onOut: onHoverOut,
  } = useInteractionState();

  return (
    <Pressable
      {...props}
      style={
        typeof style !== "function" && hovered ? [style, hoverStyle] : style
      }
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      ref={ref}
    >
      {children}
    </Pressable>
  );
});
