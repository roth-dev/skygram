import BackButton from "@/components/BackButton";
import { View } from "@/components/ui";
import VideoFeedScreen from "@/components/video/video-feed";
import { Stack, useLocalSearchParams } from "expo-router";

export default function VideoPlayerScreen() {
  const params = useLocalSearchParams<{
    thumbnail: string;
    sharedID: string;
  }>();

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "fade",
        }}
      />
      <View className="absolute z-10 bg-transparent left-4 top-16">
        <BackButton />
      </View>
      <VideoFeedScreen />
    </View>
  );
}
