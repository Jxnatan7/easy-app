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
import type { Theme } from "@/theme";
import { Image, ImageProps } from "expo-image";

const imageVariant = createVariant<Theme>({
  themeKey: "imageVariants",
  property: "variant",
});

type RestyleProps = SpacingProps<Theme> &
  LayoutProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ColorProps<Theme> &
  VariantProps<Theme, "imageVariants"> &
  ImageProps;

export const RestyleImage = createRestyleComponent<RestyleProps, Theme>(
  [
    spacing,
    layout,
    backgroundColor,
    border as unknown as any,
    color,
    imageVariant,
  ],
  Image
);

export type RestyleImageProps = React.ComponentProps<typeof RestyleImage>;
