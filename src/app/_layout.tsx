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
import { Provider as LightBoxStateProvider } from "@/state/lightbox";
import { Provider as PortalProvider } from "@/components/Portal";
import { readLastActiveAccount } from "@/state/session/util";
import { tryFetchGates, Provider as StatsigProvider } from "@/statsig/statsig";
import { init as initPersistedState } from "@/state/persisted";

import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomTabProvider from "@/context/bottom-tab-provider";
import GoogleFontProvider from "@/context/google-font-provider";
import { LogBox } from "react-native";
import { Lightbox } from "@/components/lightbox/Lightbox";
import ThemeProvider from "@/context/theme-provider";

LogBox.ignoreAllLogs();

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
      <LabelDefsProvider>
        <ModerationProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomTabProvider>
              <Slot />
              <Lightbox />
            </BottomTabProvider>
          </GestureHandlerRootView>
        </ModerationProvider>
      </LabelDefsProvider>
    </QueryProvider>
  );
}

export default function RootLayout() {
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    Promise.all([initPersistedState()]).then(() => setReady(true));
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <GoogleFontProvider>
        <SessionProvider>
          <PrefsStateProvider>
            <ShellStateProvider>
              <StatsigProvider>
                <LightBoxStateProvider>
                  <PortalProvider>
                    <InnerApp />
                  </PortalProvider>
                </LightBoxStateProvider>
              </StatsigProvider>
            </ShellStateProvider>
          </PrefsStateProvider>
        </SessionProvider>
      </GoogleFontProvider>
    </ThemeProvider>
  );
}
