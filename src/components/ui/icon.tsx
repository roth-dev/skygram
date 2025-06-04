import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useThem } from "@/context/theme-provider";

const IconSize = {
  xs: 12,
  sm: 14,
  md: 16,
  base: 18,
  lg: 22,
  xl: 24,
  "2xl": 26,
  "3xl": 32,
};

export type ExpoIconType = keyof typeof Ionicons.glyphMap;

export type IoniconsProps = React.ComponentProps<typeof Ionicons>;
export interface ExpoIconProps extends Omit<IoniconsProps, "size"> {
  size?: keyof typeof IconSize;
}

const ExpoIcon = React.forwardRef<
  React.ComponentRef<typeof Ionicons>,
  ExpoIconProps
>(({ size = "base", ...props }, ref) => {
  const { currentScheme } = useThem();
  return (
    <Ionicons
      ref={ref}
      {...props}
      size={IconSize[size]}
      color={
        props.color ? props.color : currentScheme === "dark" ? "#fff" : "#000"
      }
    />
  );
});

ExpoIcon.displayName = "ExpoIcon";

export default ExpoIcon;
