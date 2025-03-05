import { SafeAreaView, ScrollView, Text, TextInput } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import LoginForm from "@/components/login-form";
import BackButton from "@/components/button/back-button";
import { SessionAccount, useSession, useSessionApi } from "@/state/session";
import { DEFAULT_SERVICE } from "@/constants";
import { createFullHandle } from "@/lib/strings/handles";
import { useServiceQuery } from "@/state/queries/service";
import AccountList from "@/components/account/account-list";

export default function LoginScreen() {
  const router = useRouter();
  const { login, resumeSession } = useSessionApi();
  const { accounts, currentAccount } = useSession();
  const {
    data: serviceDescription,
    error: serviceError,
    refetch: refetchService,
  } = useServiceQuery(DEFAULT_SERVICE);
  const params = useLocalSearchParams<{ type: "signin" | "singup" }>();
  const type = params.type ?? "signup";

  const [addAccount, setAddAccount] = useState(() => accounts.length === 0);

  const identifierValueRef = useRef<string>("");
  const passwordValueRef = useRef<string>("");
  const authFactorTokenValueRef = useRef<string>("");
  const passwordRef = useRef<TextInput>(null);

  useEffect(() => {
    if (accounts.length > 0) {
      setAddAccount(false);
    }
  }, [accounts]);

  const onSelectAccount = useCallback(
    async (acc: SessionAccount) => {
      await resumeSession(acc);
      router.replace("/(app)/(home)");
    },
    [resumeSession]
  );

  const onLogin = useCallback(() => {
    const identifier = identifierValueRef.current.toLowerCase().trim();
    const password = passwordValueRef.current;
    const authFactorToken = authFactorTokenValueRef.current;
    let fullIdent = identifier;
    if (!serviceDescription) return;

    if (
      !identifier.includes("@") && // not an email
      !identifier.includes(".")
    ) {
      let matched = false;
      for (const domain of serviceDescription?.availableUserDomains) {
        if (fullIdent.endsWith(domain)) {
          matched = true;
        }
      }
      if (!matched) {
        fullIdent = createFullHandle(
          identifier,
          serviceDescription?.availableUserDomains[0]
        );
      }
    }
    login(
      {
        service: DEFAULT_SERVICE,
        identifier: fullIdent,
        password,
        authFactorToken: authFactorToken.trim(),
      },
      "LoginForm"
    )
      .then((r) => {
        router.replace("/(app)/(home)");
      })
      .catch((err) => console.log(err));
  }, [
    serviceDescription,
    identifierValueRef,
    authFactorTokenValueRef,
    passwordValueRef,
  ]);

  let content = (
    <LoginForm
      onChangeEmail={(v) => (identifierValueRef.current = v)}
      onChangePassword={(v) => (passwordValueRef.current = v)}
    />
  );

  if (type === "signin" && accounts.length > 0 && !addAccount) {
    content = <AccountList onSelect={onSelectAccount} />;
  } else if (addAccount) {
    content = (
      <LoginForm
        isLogin
        onChangeEmail={(v) => (identifierValueRef.current = v)}
        onChangePassword={(v) => (passwordValueRef.current = v)}
        onNextPress={onLogin}
      />
    );
  }
  return (
    <SafeAreaView className="flex-1 ">
      <BackButton className="m-3 mb-0" />
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
