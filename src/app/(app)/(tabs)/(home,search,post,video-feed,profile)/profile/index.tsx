import { ActivityIndicator, SafeAreaView } from "react-native";
import { useAgent, useSession } from "@/state/session";
import { useProfileQuery } from "@/state/queries/profile";
import { View } from "@/components/ui";
import UserProfile from "@/components/profile";
import Layout from "@/components/Layout";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useRouter } from "expo-router";

export default function Profile() {
  const { currentAccount } = useSession();
  const { logout } = useAgent();
  const router = useRouter();
  const { data, isFetching, isPlaceholderData } = useProfileQuery({
    did: currentAccount?.did,
  });

  const onSettingPress = useCallback(() => {
    router.navigate("(app)/(modal)/settings");
  }, []);

  if (!data || isFetching) {
    return (
      <View className="flex-1 items-center">
        <ActivityIndicator size="large" color="#0070F3" />
      </View>
    );
  }

  return (
    <Layout.Tab
      headerShown={true}
      headerRight={() => (
        <Button
          variant="ghost"
          size="icon"
          enableHaptics
          onPress={onSettingPress}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            className="text-foreground"
          />
        </Button>
      )}
    >
      <SafeAreaView className="flex-1 bg-white dark:bg-black">
        <UserProfile
          shouldHeaderReady={!isPlaceholderData}
          isOwner
          profile={data}
        />
      </SafeAreaView>
    </Layout.Tab>
  );
}
