import { colorScheme, useColorScheme } from "nativewind";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { Storage } from "@/storage";
import useMMKV from "@/hooks/useMMKV";

export type SchemeType = "light" | "dark" | "system";

type ThemeContextType = {
  setColorScheme: (scheme: SchemeType) => void;
  currentScheme: SchemeType;
};
const Theme = createContext<ThemeContextType>({
  setColorScheme() {},
  currentScheme: "system",
});

export default function ThemeProvider({ children }: PropsWithChildren) {
  const mmkv = useMMKV<SchemeType>("colorScheme");

  const { setColorScheme: setCurrentScheme, colorScheme: currentScheme } =
    useColorScheme();

  useEffect(() => {
    const scheme = mmkv.get("colorScheme");
    colorScheme.set(scheme ?? "system");
  }, []);

  const value = useMemo(() => {
    return {
      setColorScheme: (scheme: SchemeType) => {
        colorScheme.set(scheme);
        mmkv.set("colorScheme", scheme);
        setCurrentScheme(scheme);
      },
      currentScheme: currentScheme as SchemeType,
    };
  }, [currentScheme, setCurrentScheme]);
  return <Theme.Provider value={value}>{children}</Theme.Provider>;
}

export function useThem() {
  return useContext(Theme);
}
