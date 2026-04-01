import { Asset } from "expo-asset";
import { useEffect, useState } from "react";

const localImages = [require("../assets/images/init-image.svg")];

export default function useImages() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const localPromises = localImages.map((img) =>
          Asset.fromModule(img).downloadAsync()
        );

        await Promise.all(localPromises);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  return appIsReady;
}
