import { Button } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

export default function ProfileLayout() {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerLeft: (props) =>
          props.canGoBack ? (
            <Button
              onPress={() => router.back()}
              shape="rounded"
              variant="ghost"
              size="icon"
            >
              <Ionicons name="close" size={20} />
            </Button>
          ) : undefined,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Profile",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
