import "./globals.css";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryProvider } from "@/lib/react-query";
import {
  SessionAccount,
  Provider as SessionProvider,
  useSession,
  useSessionApi,
} from "@/state/session";
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
import { router, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
function Root() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}

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
            <Root />
          </GestureHandlerRootView>
        </ModerationProvider>
      </LabelDefsProvider>
    </QueryProvider>
  );
}

export default function App() {
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    Promise.all([initPersistedState()]).then(() => setReady(true));
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <SessionProvider>
      <PrefsStateProvider>
        <StatsigProvider>
          <InnerApp />
        </StatsigProvider>
      </PrefsStateProvider>
    </SessionProvider>
  );
}
