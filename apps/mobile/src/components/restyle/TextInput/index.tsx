import {
  createRestyleComponent,
  createVariant,
  spacing,
  layout,
  backgroundColor,
  color,
  SpacingProps,
  LayoutProps,
  BackgroundColorProps,
  BorderProps,
  ColorProps,
  VariantProps,
  border,
} from "@shopify/restyle";
import { TextInput, TextInputProps } from "react-native";
import type { Theme } from "@/theme";

const textInputVariant = createVariant<Theme>({
  themeKey: "textInputVariants",
  property: "variant",
});

type RestyleProps = SpacingProps<Theme> &
  LayoutProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ColorProps<Theme> &
  VariantProps<Theme, "textInputVariants"> &
  TextInputProps;

export const RestyleTextInput = createRestyleComponent<RestyleProps, Theme>(
  [
    spacing,
    layout,
    backgroundColor,
    border as unknown as any,
    color,
    textInputVariant,
  ],
  TextInput
);

export type RestyleTextInputProps = React.ComponentProps<
  typeof RestyleTextInput
>;
