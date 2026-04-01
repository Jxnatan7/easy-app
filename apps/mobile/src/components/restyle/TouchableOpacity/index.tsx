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
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import type { Theme } from "@/theme";

const buttonVariant = createVariant<Theme>({
  themeKey: "buttonVariants",
  property: "variant",
});

type RestyleProps = SpacingProps<Theme> &
  LayoutProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ColorProps<Theme> &
  VariantProps<Theme, "buttonVariants"> &
  TouchableOpacityProps;

export const RestyleTouchableOpacity = createRestyleComponent<
  RestyleProps,
  Theme
>(
  [
    spacing,
    layout,
    backgroundColor,
    border as unknown as any,
    color,
    buttonVariant,
  ],
  TouchableOpacity
);

export type RestyleTouchableOpacityProps = React.ComponentProps<
  typeof RestyleTouchableOpacity
>;
