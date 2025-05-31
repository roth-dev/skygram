import { Stack } from "expo-router";

export default function AccountSettingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Account",
        }}
      />
    </Stack>
  );
}
