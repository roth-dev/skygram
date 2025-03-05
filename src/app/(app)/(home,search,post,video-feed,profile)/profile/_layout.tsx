import { ActivityIndicator } from "react-native";
import { useSession } from "@/state/session";
import { useProfileQuery } from "@/state/queries/profile";
import { View } from "@/components/ui";
import UserProfile from "@/components/profile";
import { Stack } from "expo-router";

export default function Profile() {
  const { currentAccount } = useSession();
  const { data, isFetching } = useProfileQuery({ did: currentAccount?.did });

  if (!data || isFetching) {
    return (
      <View className="flex-1 items-center">
        <ActivityIndicator size="large" color="#0070F3" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerLeft: undefined }} />
      <UserProfile isOwner profile={data} />
    </>
  );
}
