import { useEffect, useState } from "react";
import { useColorScheme as useNativeColorScheme } from "react-native";
import * as Storage from "@/lib/storage";

export function useColorScheme() {
  const systemColorScheme = useNativeColorScheme();
  const [storedTheme, setStoredTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    async function loadTheme() {
      try {
        const saved = await Storage.getItem("theme");
        if (saved === "light" || saved === "dark") {
          setStoredTheme(saved);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    }
    loadTheme();
  }, []);

  return storedTheme || systemColorScheme || "light";
}
