import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: "light",
        headerLeft: () => {
          return <BackButton icon="arrow-back" />;
        },
      }}
    >
      <Stack.Screen
        name="post"
        options={{
          headerTitle: "New Post",
          headerRight: () => (
            <Button shape="rounded">
              <Button.Text font="semiBold" className="text-white">
                Post
              </Button.Text>
            </Button>
          ),
          headerLeft: () => {
            return <BackButton icon="close" />;
          },
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerTitle: "Settings",
          headerLeft: (props) => {
            if (!props.canGoBack) return;

            return <BackButton icon="close" />;
          },
        }}
      />
      <Stack.Screen name="language" options={{ headerTitle: "Languages" }} />
      <Stack.Screen name="appearance" options={{ headerTitle: "Appearance" }} />
      <Stack.Screen
        name="accessibility"
        options={{ headerTitle: "Accessibility" }}
      />
      <Stack.Screen
        name="account-settings"
        options={{
          headerTitle: "Account",
        }}
      />
    </Stack>
  );
}
