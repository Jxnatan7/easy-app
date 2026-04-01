import { TextInput, TextInputProps } from "../TextInput";
import Feather from "@expo/vector-icons/Feather";
import theme from "@/theme";

export type SearchInputProps = TextInputProps & {
  hideIcon?: boolean;
};

const icon = (
  <Feather name="search" size={24} color={theme.colors.inputIconLight} />
);

export const SearchInput = ({
  hideIcon = false,
  ...props
}: SearchInputProps) => {
  return (
    <TextInput placeholder="Pesquisar" icon={!hideIcon && icon} {...props} />
  );
};
