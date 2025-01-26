import "./globals.css";
import { PropsWithChildren } from "react";
import LoginPage from "./login/page";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";

export default function RootLayout({ children }: PropsWithChildren<{}>) {
  return (
    <ThemeProvider value={DarkTheme}>
      <LoginPage />
    </ThemeProvider>
  );
}
