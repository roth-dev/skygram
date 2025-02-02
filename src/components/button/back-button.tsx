import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { cn } from "@/lib/utils";

export default function BackButton(props: TouchableOpacityProps) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        router.canGoBack() && router.back();
      }}
      {...props}
      className={cn(
        "w-10 h-10 rounded-full items-center justify-center bg-gray-200",
        props.className
      )}
    >
      <Ionicons name="close" size={18} />
    </TouchableOpacity>
  );
}
