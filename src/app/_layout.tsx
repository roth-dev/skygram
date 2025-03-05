import "./globals.css";
import "react-native-reanimated";

import { useEffect, useState } from "react";

import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryProvider } from "@/lib/react-query";
import {
  SessionAccount,
  Provider as SessionProvider,
  useSession,
  useSessionApi,
} from "@/state/session";
import { Provider as ShellStateProvider } from "@/state/shell";
import { Provider as ModerationProvider } from "@/state/prefs/moderation-opts";
import { Provider as LabelDefsProvider } from "@/state/prefs/label-defs";
import { Provider as PrefsStateProvider } from "@/state/prefs";
import { readLastActiveAccount } from "@/state/session/util";
import { tryFetchGates, Provider as StatsigProvider } from "@/statsig/statsig";
import { init as initPersistedState } from "@/state/persisted";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomTabProvider from "@/context/bottom-tab-provider";
import GoogleFontProvider from "@/context/google-font-provider";

function InnerApp() {
  const { currentAccount } = useSession();

  const { resumeSession } = useSessionApi();

  // init
  useEffect(() => {
    async function onLaunch(account?: SessionAccount) {
      try {
        if (account) {
          await resumeSession(account);
        } else {
          await tryFetchGates(undefined, "prefer-fresh-gates");
        }
      } catch (e) {
        // logger.error(`session: resume failed`, {message: e})
      } finally {
        // (true)
      }
    }
    const account = readLastActiveAccount();
    onLaunch(account);
  }, [resumeSession]);

  return (
    <QueryProvider currentDid={currentAccount?.did}>
      {/* <LabelDefsProvider> */}
      <ModerationProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomTabProvider>
            <Slot />
          </BottomTabProvider>
        </GestureHandlerRootView>
      </ModerationProvider>
      {/* </LabelDefsProvider> */}
    </QueryProvider>
  );
}

export default function App() {
  const colorScheme = useColorScheme();

  const [isReady, setReady] = useState(false);

  useEffect(() => {
    Promise.all([initPersistedState()]).then(() => setReady(true));
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GoogleFontProvider>
        <SessionProvider>
          <PrefsStateProvider>
            <ShellStateProvider>
              <StatsigProvider>
                <InnerApp />
              </StatsigProvider>
            </ShellStateProvider>
          </PrefsStateProvider>
        </SessionProvider>
      </GoogleFontProvider>
    </ThemeProvider>
  );
}
