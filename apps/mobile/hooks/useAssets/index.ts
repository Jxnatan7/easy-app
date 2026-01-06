import { useState, useEffect } from "react";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { localAnimations, localFonts, localImages } from "@/assets";

export default function useAssets() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await SplashScreen.preventAutoHideAsync();

        const fontPromise = Font.loadAsync({
          ...localFonts,
          ...FontAwesome.font,
        });

        const cacheImages = [...localImages, ...localAnimations].map(
          (asset) => {
            return Asset.fromModule(asset).downloadAsync();
          }
        );

        await Promise.all([fontPromise, ...cacheImages]);
      } catch (e) {
        console.warn("Erro ao carregar assets:", e);
      } finally {
        setIsReady(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isReady;
}
