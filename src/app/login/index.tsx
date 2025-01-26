import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";
import React from "react";
import { ThemedText } from "@/components/ThemedText";

interface InputProps extends TextInputProps {
  label: string;
  iconSize?: number;
  iconColor?: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  onPress?: () => void;
}
function InputGroup({
  label,
  icon,
  iconSize = 18,
  iconColor = "",
  onPress,
  ...inputProps
}: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <View className="mb-4 gap-2">
      {!!label && (
        <Text className="text-gray-500 text-sm font-semibold">{label}</Text>
      )}
      <View
        className={cn(
          "flex-row items-center border rounded-lg pl-2 pr-2 gap-2",
          isFocused ? "border-blue-500" : "border-gray-300"
        )}
      >
        {icon && <Ionicons name={icon} size={iconSize} color={iconColor} />}
        <Pressable onPress={onPress} className="flex-1">
          <TextInput
            pointerEvents={onPress ? "none" : "auto"}
            {...inputProps}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn("flex-1  h-10", inputProps.className)}
          />
        </Pressable>
      </View>
    </View>
  );
}

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 ">
      <ScrollView className="p-3 flex-1">
        <Text className="font-semibold text-2xl">Your account</Text>
        <Text className="text-gray-500 mb-2 mt-5">
          You're creating account on Blueky Social provider
        </Text>
        <InputGroup
          label="Email"
          icon="mail"
          placeholder="Enter your email address"
          iconColor="gray"
        />
        <InputGroup
          label="Password"
          icon="lock-closed"
          placeholder="Enter your password"
          iconColor="gray"
        />
        <InputGroup
          value="1/11/2005"
          label="Your birth date"
          icon="calendar"
          iconColor="gray"
          onPress={() => Alert.alert("Pick a date")}
        />
        <Text className="text-gray-500 text-sm">
          By creating an account you agree to the{" "}
          <ThemedText type="link">Term of Service</ThemedText> and{" "}
          <ThemedText type="link">Privacy Policy.</ThemedText>
        </Text>
        <TouchableOpacity className="bg-blue-500 rounded-lg p-w mt-4">
          <Text className="text-center text-white p-2">Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
