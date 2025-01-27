import { SafeAreaView, ScrollView, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import LoginForm from "@/components/login-form";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarImage, Avatar } from "@/components/ui/avatar";
import Spacer from "@/components/ui/spacer";

export default function LoginScreen() {
  const params = useLocalSearchParams<{ type: "signin" | "singup" }>();
  const type = params.type ?? "signup";

  let content = <LoginForm />;

  if (type === "signin") {
    content = (
      <Card className="pt-3">
        {[1, 2].map((_, i) => {
          return (
            <CardContent key={i} className="flex-1 items-start">
              <Button
                variant="ghost"
                className="pl-0 pr-2 w-full  justify-start"
              >
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
                <CardTitle className="leading-0">roth</CardTitle>
                <CardDescription>roth.dev.bskh.socail</CardDescription>
                <Spacer />
                <Button.Icon name="arrow.forward" size={14} />
              </Button>
            </CardContent>
          );
        })}
        <CardContent className="flex-1 items-start">
          <Button variant="ghost" className="pl-0 pr-2 w-full  justify-start">
            <Avatar className="items-center justify-center">
              <Button.Icon name="plus" size={18} />
            </Avatar>
            <CardDescription>Other account</CardDescription>
            <Spacer />
            <Button.Icon name="arrow.forward" size={14} />
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <SafeAreaView className="flex-1 ">
      <ScrollView className="p-3 flex-1">
        <Text className="font-semibold text-2xl">
          {type === "singup" ? "Your account" : "Choose your account"}
        </Text>
        <Text className="text-gray-500 mb-2 mt-5">
          {type === "singup"
            ? "You're creating account on Bluesky Social provider"
            : "Sign in as..."}
        </Text>
        {content}
      </ScrollView>
    </SafeAreaView>
  );
}
