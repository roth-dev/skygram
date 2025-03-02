import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useWebMediaQueries } from "@/hooks/useWebMediaQueries";
import { isWeb } from "@/platform/detection";
import { clamp } from "@/lib/numbers";

export function useBottomBarOffset(modifier: number = 0) {
  const { isTabletOrDesktop } = useWebMediaQueries();
  const { bottom: bottomInset } = useSafeAreaInsets();
  return (
    (isWeb && isTabletOrDesktop ? 0 : clamp(60 + bottomInset, 60, 75)) +
    modifier
  );
}
