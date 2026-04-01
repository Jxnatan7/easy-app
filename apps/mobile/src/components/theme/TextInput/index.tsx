import React, { forwardRef } from "react";
import { ViewStyle } from "react-native";
import {
  Box,
  BoxProps,
  RestyleTextInput,
  RestyleTextInputProps,
  Text,
} from "@/components/restyle";
import theme from "@/theme";

export type IconDirection = "left" | "right";

export type TextInputProps = RestyleTextInputProps & {
  icon?: React.ReactNode;
  iconDirection?: IconDirection;
  iconContainerStyle?: ViewStyle;
  containerProps?: BoxProps;
  label?: string;
};

export const TextInput = forwardRef<any, TextInputProps>(
  (
    {
      icon,
      iconDirection = "left",
      iconContainerStyle,
      containerProps,
      label,
      ...props
    }: TextInputProps,
    ref: any
  ) => {
    const isRight = iconDirection === "right";

    return (
      <Box width="100%" maxWidth={450} {...containerProps}>
        {label && (
          <Text width="100%" mb="s" variant="label">
            {label}
          </Text>
        )}
        <Box
          flexDirection={isRight ? "row-reverse" : "row"}
          alignItems="center"
        >
          {icon && (
            <Box
              backgroundColor="inputBackgroundLight"
              height={40}
              padding="s"
              borderTopLeftRadius={isRight ? 0 : 6}
              borderBottomLeftRadius={isRight ? 0 : 6}
              borderBottomRightRadius={isRight ? 6 : 0}
              borderTopRightRadius={isRight ? 6 : 0}
              justifyContent="center"
              alignItems="center"
              style={iconContainerStyle}
            >
              {icon}
            </Box>
          )}

          <RestyleTextInput
            ref={ref}
            variant={!icon ? "default" : isRight ? "iconRigth" : "iconLeft"}
            placeholderTextColor={theme.colors.inputPlaceholderLight}
            {...props}
          />
        </Box>
      </Box>
    );
  }
);
