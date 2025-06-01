import { Stack } from "expo-router";
import React from "react";
import BackButton from "@/components/BackButton";
import { isAndroid, isIOS } from "@/platform/detection";

export const unstable_settings = {
  initialRouteName: "home",
  search: {
    initialRouteName: "search",
  },
  post: {
    initialRouteName: "post",
  },
  "video-feed": {
    initialRouteName: "video-feed",
  },
  profile: {
    initialRouteName: "profile",
  },
};

export default function DynamicLayout() {
  return (
    <Stack
      screenOptions={{
        gestureDirection: "horizontal",
        animation: "ios_from_right",
        headerTitleStyle: {
          fontSize: 16,
          fontFamily: "Inter_600SemiBold",
        },
        headerShown: false,
        headerLeft: () => (isIOS ? <BackButton /> : undefined),
      }}
    />
  );
}
