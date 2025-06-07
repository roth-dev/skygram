import Layout from "@/components/Layout";
import { HStack, Text, VStack } from "@/components/ui";
import { Button } from "@/components/ui/button";
import Spacer from "@/components/ui/spacer";
import {
  MenuAction,
  MenuView,
  NativeActionEvent,
} from "@react-native-menu/menu";
import { useCallback, useMemo, useState } from "react";
import { Platform } from "react-native";
import { SchemeType, useTheme } from "@/context/theme-provider";
import ExpoIcon from "@/components/ui/icon";

type DarkTheme = "dim" | "dark";
export default function AppearanceScreen() {
  const { setColorScheme, currentScheme } = useTheme();
  const [selectedColorMode, setSelectedColorMode] = useState<SchemeType>(
    () => currentScheme
  );
  const [selectedDarkTheme, setSelectedDarkTheme] = useState<DarkTheme>("dim");

  const onSelectColorMode = useCallback(
    ({ nativeEvent }: NativeActionEvent) => {
      setColorScheme(nativeEvent.event as SchemeType);
      setSelectedColorMode(nativeEvent.event as SchemeType);
    },
    []
  );

  const onSelectDarkTheme = useCallback(
    ({ nativeEvent }: NativeActionEvent) => {
      setSelectedDarkTheme(nativeEvent.event as DarkTheme);
    },
    []
  );

  const ColorModeActions: MenuAction[] = useMemo(
    () =>
      (["system", "light", "dark"] as SchemeType[]).map((mode) => ({
        id: mode,
        title: mode.charAt(0).toUpperCase() + mode.slice(1),
        imageColor: "#000",
        image:
          selectedColorMode === mode
            ? Platform.select({
                ios: "checkmark",
                android: "ic_menu_check", // or your own check icon
              })
            : undefined,
      })),
    [selectedColorMode]
  );

  const darkThemeActions: MenuAction[] = useMemo(
    () =>
      (["dim", "dark"] as DarkTheme[]).map((theme) => ({
        id: theme,
        title: theme.charAt(0).toUpperCase() + theme.slice(1),
        imageColor: "#000",
        image:
          selectedDarkTheme === theme
            ? Platform.select({
                ios: "checkmark",
                android: "ic_menu_check", // or your own check icon
              })
            : undefined,
      })),
    [selectedDarkTheme]
  );
  return (
    <Layout.ScrollView>
      <VStack className="m-4 rounded-lg gap-2 bg-transparent">
        <Text size="sm" className="text-gray-400">
          App Appearance
        </Text>
        <VStack className="p-4 rounded-lg gap-6" darkColor="secondary">
          <HStack darkColor="secondary">
            <ExpoIcon name="phone-portrait-outline" />
            <Text>Color mode</Text>
            <Spacer />
            <MenuView
              onPressAction={onSelectColorMode}
              title="Choose theme"
              actions={ColorModeActions}
            >
              <Button asChild variant="ghost" size="sm" className="pr-0">
                <Text className="capitalize">{selectedColorMode}</Text>
                <ExpoIcon name="chevron-expand-outline" size="md" />
              </Button>
            </MenuView>
          </HStack>
          <HStack darkColor="secondary">
            <ExpoIcon name="moon-outline" />
            <Text>Dark theme</Text>
            <Spacer />
            <MenuView
              onPressAction={onSelectDarkTheme}
              actions={darkThemeActions}
            >
              <Button asChild variant="ghost" className="pr-0">
                <Text className="capitalize">Dark</Text>
                <ExpoIcon name="chevron-expand-outline" size="md" />
              </Button>
            </MenuView>
          </HStack>
        </VStack>
      </VStack>
    </Layout.ScrollView>
  );
}
