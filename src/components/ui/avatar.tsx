import * as React from "react";
import { Image, ImageProps, View, ViewProps } from "react-native";
import { cn } from "@/lib/utils";
import { assets } from "assets/images";

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
  ({ className, ...props }, ref) => (
    <Image
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
      source={props.source ?? assets.PERSON}
      {...props}
    />
  )
);

AvatarImage.displayName = "AvatarImage";

export { Avatar, AvatarImage };
