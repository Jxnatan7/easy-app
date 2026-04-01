import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { IconButton } from "../IconButton";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";

export const BackButton = ({ fallback }: { fallback?: () => void }) => {
  const theme = useTheme<Theme>();
  const { canGoBack, back } = useRouter();
  return (
    <IconButton
      onPress={() => (canGoBack() ? back() : fallback?.())}
      icon={
        <MaterialIcons
          name="keyboard-arrow-left"
          size={30}
          color={theme.colors.mainText}
        />
      }
    />
  );
};
