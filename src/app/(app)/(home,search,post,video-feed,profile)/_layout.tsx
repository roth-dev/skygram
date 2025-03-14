import { Stack } from "expo-router";
import React from "react";
import BackButton from "@/components/BackButton";

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
        headerTitleStyle: {
          fontSize: 14,
          fontFamily: "Inter_600SemiBold",
        },
        headerLeft: () => <BackButton />,
      }}
    />
  );
}
