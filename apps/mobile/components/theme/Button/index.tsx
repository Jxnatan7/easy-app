import {
  RestyleTouchableOpacity,
  RestyleTouchableOpacityProps,
  Text,
  TextProps,
} from "@/components/restyle";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";

export type ButtonProps = RestyleTouchableOpacityProps & {
  text?: string;
  textProps?: TextProps;
};

export default function Button({
  text,
  textProps,
  variant = "default",
  children,
  ...props
}: ButtonProps) {
  const theme = useTheme<Theme>();

  const btnVariant =
    // @ts-ignore
    theme.buttonVariants?.[variant] ?? theme.buttonVariants.default;

  const gradientTokens =
    // @ts-ignore
    theme.buttonGradients?.[variant] ?? theme.buttonGradients.default;

  const gradientColors = gradientTokens.map(
    (token: keyof Theme["colors"]) => theme.colors[token]
  );

  const textColorToken = btnVariant?.color ?? "buttonTextLight";

  return (
    <RestyleTouchableOpacity activeOpacity={0.7} variant={variant} {...props}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.background,
          { borderRadius: btnVariant?.borderRadius ?? 10 },
        ]}
      >
        {text && (
          <Text
            variant="button"
            {...textProps}
            color={(textProps?.color ?? textColorToken) as any}
          >
            {text}
          </Text>
        )}
        {children}
      </LinearGradient>
    </RestyleTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
