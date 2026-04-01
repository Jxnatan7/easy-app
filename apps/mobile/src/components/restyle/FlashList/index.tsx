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
import { AnimatedFlashList, FlashList } from "@shopify/flash-list";
import React from "react";

const flashListVariant = createVariant<Theme>({
  themeKey: "flashListVariants",
  property: "variant",
});

type RestyleProps = SpacingProps<Theme> &
  LayoutProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ColorProps<Theme> &
  VariantProps<Theme, "flashListVariants"> &
  React.ComponentProps<typeof FlashList>;

export const RestyleFlashList = createRestyleComponent<RestyleProps, Theme>(
  [
    spacing,
    layout,
    backgroundColor,
    border as unknown as any,
    color,
    flashListVariant,
  ],
  AnimatedFlashList
);

export type RestyleFlashListProps = React.ComponentProps<
  typeof RestyleFlashList
>;
