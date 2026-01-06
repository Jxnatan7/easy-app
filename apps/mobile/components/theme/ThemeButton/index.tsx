import { RestyleTouchableOpacity } from "@/components/restyle";
import { useAppStore } from "@/stores/appStore";
import { Ionicons } from "@expo/vector-icons";

export const ThemeButton = () => {
  const theme = useAppStore((state) => state.theme);

  return (
    <RestyleTouchableOpacity
      variant="icon"
      onPress={() =>
        useAppStore.getState().setTheme(theme === "light" ? "dark" : "light")
      }
    >
      {theme === "light" ? (
        <Ionicons name="sunny-outline" size={24} color={"#000"} />
      ) : (
        <Ionicons name="moon-outline" size={24} color="#fff" />
      )}
    </RestyleTouchableOpacity>
  );
};
