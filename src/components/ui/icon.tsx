import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useThem } from "@/context/theme-provider";

export type ExpoIconType = keyof typeof Ionicons.glyphMap;

const ExpoIcon = React.forwardRef<
  React.ComponentRef<typeof Ionicons>,
  React.ComponentProps<typeof Ionicons>
>((props, ref) => {
  const { currentScheme } = useThem();
  return (
    <Ionicons
      ref={ref}
      {...props}
      color={props.color ?? currentScheme === "dark" ? "#fff" : "#000"}
    />
  );
});

ExpoIcon.displayName = "ExpoIcon";

export default ExpoIcon;
