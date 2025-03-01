import { PropsWithChildren } from "react";
import { Provider as ShellLayoutProvder } from "./shell-layout";
import { Provider as MinimalModeProvider } from "./minimal-mode";
export function Provider({ children }: PropsWithChildren) {
  return (
    <ShellLayoutProvder>
      <MinimalModeProvider>{children}</MinimalModeProvider>
    </ShellLayoutProvder>
  );
}
