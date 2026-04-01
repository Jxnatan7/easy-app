import {
  RestyleFlashList,
  RestyleFlashListProps,
  RestyleFlatList,
  RestyleFlatListProps,
} from "@/components/restyle";
import { Platform } from "react-native";

export const FlashList = ({ ...props }: RestyleFlashListProps) => {
  return Platform.OS === "web" ? (
    <RestyleFlatList {...(props as RestyleFlatListProps)} />
  ) : (
    <RestyleFlashList {...props} />
  );
};
