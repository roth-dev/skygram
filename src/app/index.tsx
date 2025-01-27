import { Redirect, Slot, useFocusEffect, useRouter } from "expo-router";
import { useEffect } from "react";

export default function () {
  const router = useRouter();
  // useEffect(() => {
  //   router.push("/auth/welcome");
  // }, []);

  return <Redirect href="/auth/welcome" />;
  return <Slot />;
}
