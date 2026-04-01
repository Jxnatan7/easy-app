import React, { useState } from "react";
import { Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/theme";
import {
  Box,
  BoxProps,
  RestylePressable,
  RestylePressableProps,
  Text,
} from "@/components/restyle";

type Props = RestylePressableProps & {
  value?: string;
  placeholder?: string;
  label?: string;
  onPaste?: (text: string) => void;
  iconColor?: string;
  containerProps?: BoxProps;
};

export const PressableCopyPaste = ({
  value,
  placeholder = "Toque para colar",
  label,
  onPaste,
  iconColor,
  containerProps,
  ...rest
}: Props) => {
  const theme = useTheme<Theme>();
  const [hasCopied, setHasCopied] = useState(false);

  const finalIconColor = iconColor || theme.colors.backgroundDark || "#000";

  const handlePress = async () => {
    if (value) {
      96;
      await Clipboard.setStringAsync(value);
      setHasCopied(true);

      const id = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(id);
    }

    handlePaste();
  };

  const handlePaste = async () => {
    if (onPaste) {
      const content = await Clipboard.getStringAsync();
      if (content) {
        onPaste(content);
      } else {
        Alert.alert("Área de transferência vazia");
      }
    }
  };

  return (
    <Box
      width="100%"
      maxWidth={450}
      height="auto"
      flexDirection="column"
      {...containerProps}
    >
      {label && (
        <Text width="100%" mb="s" variant="label">
          {label}
        </Text>
      )}
      <RestylePressable variant="input" onPress={handlePress} {...rest}>
        <Text
          variant="body"
          color={value ? "backgroundDark" : "backgroundGray"}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {value || placeholder}
        </Text>

        {hasCopied ? (
          <Feather name="check" size={20} color="green" />
        ) : !value && onPaste ? (
          <Feather name="clipboard" size={20} color={finalIconColor} />
        ) : (
          <Feather name="copy" size={20} color={finalIconColor} />
        )}
      </RestylePressable>
    </Box>
  );
};
