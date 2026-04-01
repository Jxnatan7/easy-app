import { Box } from "@/components/restyle";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";
import planetAnimationDark from "@/assets/animations/planet-dark.json";
import planetAnimationLight from "@/assets/animations/planet-light.json";
import { useMemo } from "react";
import { useAppStore } from "@/stores/appStore";

export function PlanetAnimation() {
  const colorScheme = useAppStore((state) => state.theme);

  const animation = useMemo(
    () => (colorScheme === "dark" ? planetAnimationDark : planetAnimationLight),
    [colorScheme]
  );

  return (
    <Box style={styles.animationContainer}>
      <LottieView
        source={animation}
        autoPlay
        speed={1}
        loop
        style={styles.animationView}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    width: 500,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  animationView: {
    width: 250,
    height: 250,
    alignSelf: "center",
  },
});
