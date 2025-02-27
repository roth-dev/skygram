import { router } from "expo-router";
import { Button } from "./ui/button";

export default function BackButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onPress={() => {
        router.canGoBack() && router.back();
      }}
    >
      <Button.Icon size={20} name="arrow.backward" />
    </Button>
  );
}
