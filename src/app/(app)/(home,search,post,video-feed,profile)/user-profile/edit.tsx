import { Text, View } from "@/components/ui";
import { Stack } from "expo-router";

export default function Edit() {
  return (
    <View className="flex-1 items-center justify-center">
      <Stack.Screen
        options={{
          title: "Edit",
          headerShown: true,
          presentation: "formSheet",
        }}
      />
      <Text>Edit user Profile</Text>
    </View>
  );
}
