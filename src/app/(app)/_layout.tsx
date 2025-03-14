import { Easing, Platform, useColorScheme } from "react-native";
import { isIOS } from "@/platform/detection";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Ionicons } from "@expo/vector-icons";
import { HapticTab } from "@/components/HapticTab";
import BlurTabBarBackground from "@/components/ui/TabBarBackground.ios";
import { Redirect, Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useSession } from "@/state/session";
import { View } from "@/components/ui";
import { Colors } from "@/constants/Colors";

export default function RootTabs() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [ready, setReady] = useState(false);
  const { currentAccount } = useSession();

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return <View className="flex-1" />;
  }

  if (!currentAccount) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarButtonTestID: "bottomTab",
        tabBarAccessibilityLabel: "mainTabBar",
        tabBarBackground: BlurTabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: isIOS ? "absolute" : undefined,
            paddingTop: 5,
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(search)"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(post)"
        listeners={(e) => {
          return {
            tabPress: (e) => {
              e.preventDefault();
              // router.navigate("/(modal)/post");
            },
          };
        }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="add" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(video-feed)"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="videocam" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="(modal)" options={{ href: null }} />
    </Tabs>
  );
}
