import Layout from "@/components/Layout";
import { HStack, Text, View, VStack } from "@/components/ui";
import { Button } from "@/components/ui/button";
import Spacer from "@/components/ui/spacer";
import { Ionicons } from "@expo/vector-icons";
import {
  MenuAction,
  MenuView,
  NativeActionEvent,
} from "@react-native-menu/menu";
import { useCallback, useMemo, useState } from "react";
import { Platform } from "react-native";

type ColorMode = "system" | "light" | "dark";
type DarkTheme = "dim" | "dark";
export default function AppearanceScreen() {
  const [selectedColorMode, setSelectedColorMode] =
    useState<ColorMode>("system");
  const [selectedDarkTheme, setSelectedDarkTheme] = useState<DarkTheme>("dim");

  const onSelectColorMode = useCallback(
    ({ nativeEvent }: NativeActionEvent) => {
      setSelectedColorMode(nativeEvent.event as ColorMode);
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
      (["system", "light", "dark"] as ColorMode[]).map((mode) => ({
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
    <Layout.Screen safeArea>
      <VStack className="m-4 rounded-lg gap-2 bg-transparent">
        <Text size="sm" className="text-gray-400">
          App Appearance
        </Text>
        <VStack className="p-4 rounded-lg gap-6">
          <HStack className="gap-1">
            <Ionicons name="phone-portrait-outline" size={16} />
            <Text>Color mode</Text>
            <Spacer />
            <MenuView
              onPressAction={onSelectColorMode}
              title="Choose theme"
              actions={ColorModeActions}
            >
              <Button asChild variant="ghost" size="sm" className="pr-0">
                <Text className="capitalize">{selectedColorMode}</Text>
                <Ionicons name="chevron-expand-outline" size={16} />
              </Button>
            </MenuView>
          </HStack>
          <HStack className="gap-1">
            <Ionicons name="moon-outline" size={16} />
            <Text>Dark theme</Text>
            <Spacer />
            <MenuView
              onPressAction={onSelectDarkTheme}
              actions={darkThemeActions}
            >
              <Button asChild variant="ghost" className="pr-0">
                <Text className="capitalize">Dark</Text>
                <Ionicons name="chevron-expand-outline" size={16} />
              </Button>
            </MenuView>
          </HStack>
        </VStack>
      </VStack>
    </Layout.Screen>
  );
}
