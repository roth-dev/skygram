import { PropsWithChildren } from "react";
import { Provider as HiddenPostProvider } from "./hidden-posts";
import { Provider as TrendingProvider } from "./trending";

export function Provider({ children }: PropsWithChildren<{}>) {
  return (
    <TrendingProvider>
      <HiddenPostProvider>{children}</HiddenPostProvider>
    </TrendingProvider>
  );
}
