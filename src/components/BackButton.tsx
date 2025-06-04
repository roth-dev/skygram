import { useRouter } from "expo-router";
import { Button } from "./ui/button";
import ExpoIcon, { type ExpoIconType } from "./ui/icon";

interface Props {
  icon?: ExpoIconType;
}
export default function BackButton({ icon }: Props) {
  const router = useRouter();
  return (
    <Button
      onPress={() => {
        router.back();
      }}
      size="icon"
      shape="rounded"
      variant="ghost"
    >
      <ExpoIcon name={icon ?? "arrow-back"} size="xl" />
    </Button>
  );
}
