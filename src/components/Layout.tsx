import { PropsWithChildren } from "react";
import { View } from "./ui";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Layout = ({ children }: PropsWithChildren) => {
  return <View className="flex-1">{children}</View>;
};

Layout.displayName = "Layout";

Layout.Tab = function ({
  children,
  safeArea = false,
  headerShown = false,
}: PropsWithChildren<{
  safeArea?: boolean;
  headerShown?: boolean;
}>) {
  const { top } = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown }} />
      {safeArea ? (
        <View style={{ paddingTop: top }} className="flex-1 bg-white">
          {children}
        </View>
      ) : (
        children
      )}
    </>
  );
};

Layout.displayName = "Tab";

Layout.Screen = function ({
  title,
  children,
  headerShown = true,
}: PropsWithChildren<{
  title?: string;
  headerShown?: boolean;
}>) {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown,
          title,
        }}
      />
      {children}
    </>
  );
};

export default Layout;
