import { View } from "@/components/ui";
import { useSession } from "@/state/session";
import ButterflyLogo from "assets/svg/logo";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
export const unstable_settings = {
  initialRouteName: "(auth)",
};

export default function () {
  const [ready, setReady] = useState(false);
  const { currentAccount } = useSession();

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center">
        <ButterflyLogo fill="blue" />
      </View>
    );
  }

  if (!currentAccount) {
    return <Redirect href="/(auth)/welcome" />;
  }
  return <Redirect href="/(tabs)/home" />;
}
