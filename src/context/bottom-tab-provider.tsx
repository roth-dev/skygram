import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

const tabContext = createContext<{
  setTab: (tabName: string) => void;
  currentTab: string | null;
}>({
  currentTab: "",
  setTab(tabName) {},
});

export const useBottomTab = () => useContext(tabContext);

export default function BottomTabProvider({ children }: PropsWithChildren) {
  const [currentTab, setTab] = useState("");

  const value = useMemo(() => {
    return {
      currentTab,
      setTab,
    };
  }, [currentTab]);

  return <tabContext.Provider value={value}>{children}</tabContext.Provider>;
}
