import Logo from "@/components/Logo";
import { HStack, Text, View } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  return (
    <View className="flex-1 p-4 justify-center gap-3">
      <HStack className="justify-center">
        <Logo width={120} height={120} />
      </HStack>
      <Text font="bold" className="font-semibold text-2xl text-center">
        Welcome back
      </Text>
      <Button
        onPress={() => {
          router.push({
            pathname: "/login",
            params: {
              type: "singup",
            },
          });
        }}
      >
        <Button.Text font="semiBold" className="text-white">
          Create an account
        </Button.Text>
      </Button>
      <Button
        onPress={() => {
          router.push({
            pathname: "/login",
            params: {
              type: "signin",
            },
          });
        }}
        variant="secondary"
        className="bg-neutral-200"
      >
        <Button.Text font="semiBold" className="text-gray-800">
          Sing in
        </Button.Text>
      </Button>
    </View>
  );
}
