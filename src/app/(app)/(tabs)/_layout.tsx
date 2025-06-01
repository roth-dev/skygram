import { emitSoftReset } from "@/state/events";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import BlurTabBarBackground from "@/components/ui/TabBarBackground";
import { HapticTab } from "@/components/HapticTab";
import { Redirect, Tabs, useRouter } from "expo-router";
import { Platform } from "react-native";
import { isIOS } from "@/platform/detection";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useCallback, useEffect, useState } from "react";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { useSession } from "@/state/session";
import { View } from "@/components/ui";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const { currentAccount } = useSession();

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleTabPress = useCallback((props: BottomTabBarButtonProps) => {
    const isHome =
      props.accessibilityState?.selected &&
      props?.accessibilityLargeContentTitle === "(home)";
    if (isHome) {
      emitSoftReset();
    }
  }, []);

  if (!ready) {
    return <View className="flex-1" />;
  }

  if (!currentAccount) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Tabs
      // backBehavior="order"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: (props) => (
          <HapticTab {...props} onDoubleTap={() => handleTabPress(props)} />
        ),
        tabBarButtonTestID: "bottomTab",
        tabBarAccessibilityLabel: "mainTabBar",
        tabBarBackground: BlurTabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
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
              router.push("/(modal)/post" as any);
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
    </Tabs>
  );
}
