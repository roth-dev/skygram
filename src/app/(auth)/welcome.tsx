import Logo from "@/components/Logo";
import { Text, View } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  return (
    <View className="flex-1 p-4 justify-center bg-white">
      {/* Logo Section */}
      <View className="justify-center items-center gap-2">
        <Logo width={120} height={120} />
        <Text font="bold" className="text-2xl">
          SkyGram
        </Text>
      </View>

      {/* Login Section */}
      <View className="gap-4 my-8">
        <Button
          onPress={() => {
            router.push({
              pathname: "/login",
              params: { type: "signin" },
            });
          }}
          className="bg-primary"
        >
          <Button.Text font="semiBold" className="text-white">
            Log In
          </Button.Text>
        </Button>

        <View className="items-center gap-2">
          <Text className="text-gray-500">Don't have a Bluesky account?</Text>
          <Button
            onPress={() => {
              router.push("https://bsky.app");
            }}
            variant="link"
            className="p-0"
          >
            <Button.Text className="text-primary">
              Sign up on bsky.app
            </Button.Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
