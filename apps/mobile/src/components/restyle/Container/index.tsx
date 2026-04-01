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
import { TouchableOpacityProps } from "react-native";
import type { Theme } from "@/theme";
import { Box } from "../Box";

const containerVariant = createVariant<Theme>({
  themeKey: "containerVariants",
  property: "variant",
});

type RestyleProps = SpacingProps<Theme> &
  LayoutProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ColorProps<Theme> &
  VariantProps<Theme, "containerVariants"> &
  TouchableOpacityProps;

export const RestyleContainer = createRestyleComponent<RestyleProps, Theme>(
  [
    spacing,
    layout,
    backgroundColor,
    border as unknown as any,
    color,
    containerVariant,
  ],
  Box
);

export type RestyleContainerProps = React.ComponentProps<
  typeof RestyleContainer
>;
