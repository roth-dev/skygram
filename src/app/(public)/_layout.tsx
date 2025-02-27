import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        title: "",
        headerLeft: () => {
          return <BackButton />;
        },
      }}
    />
  );
}
