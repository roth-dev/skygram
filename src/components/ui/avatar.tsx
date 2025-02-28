import * as React from "react";
import { View, ViewProps } from "react-native";
import { cn } from "@/lib/utils";
import { assets } from "assets/images";
import { Image, ImageProps } from "expo-image";

// inspired by shadcn `Avatar` component
const Avatar = React.forwardRef<View, ViewProps>(
  ({ className, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          "relative bg-gray-200 flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      />
    );
  }
);

Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<Image, ImageProps>(
  ({ className, ...props }, ref) => {
    return (
      <Image
        ref={ref}
        source={props.source ?? assets.PERSON}
        style={{ width: "100%", height: "100%" }}
        contentFit="contain"
        transition={500}
        {...props}
      />
    );
  }
);

AvatarImage.displayName = "AvatarImage";

export { Avatar, AvatarImage };
