import { useAppStore } from "@/stores/appStore";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

export const useDeviceTheme = () => {
  const colorScheme = useColorScheme();
  const appStore = useAppStore();

  useEffect(() => {
    let isMounted = true;

    if (colorScheme && isMounted) {
      appStore.setTheme(colorScheme);
    }

    return () => {
      isMounted = false;
    };
  }, [colorScheme]);
};
