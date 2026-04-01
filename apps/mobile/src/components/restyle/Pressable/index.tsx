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
import { Pressable, TouchableOpacityProps } from "react-native";
import type { Theme } from "@/theme";

const PressableVariant = createVariant<Theme>({
  themeKey: "pressableVariants",
  property: "variant",
});

type RestyleProps = SpacingProps<Theme> &
  LayoutProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ColorProps<Theme> &
  VariantProps<Theme, "pressableVariants"> &
  TouchableOpacityProps;

export const RestylePressable = createRestyleComponent<RestyleProps, Theme>(
  [
    spacing,
    layout,
    backgroundColor,
    border as unknown as any,
    color,
    PressableVariant,
  ],
  Pressable
);

export type RestylePressableProps = React.ComponentProps<
  typeof RestylePressable
>;
