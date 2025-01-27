import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 m-3 items-center justify-center bg-muted p-6 md:p-10">
      <View className="w-full gap-3">
        <Text className="font-semibold text-2xl text-center">Welcome back</Text>
        <Button
          onPress={() => {
            router.push({
              pathname: "/auth/login",
              params: {
                type: "singup",
              },
            });
          }}
        >
          <Button.Text>Create an account</Button.Text>
        </Button>
        <Button
          onPress={() => {
            router.push({
              pathname: "/auth/login",
              params: {
                type: "signin",
              },
            });
          }}
          variant="secondary"
          className="bg-neutral-200"
        >
          <Button.Text className="text-gray-800">Sing in</Button.Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
