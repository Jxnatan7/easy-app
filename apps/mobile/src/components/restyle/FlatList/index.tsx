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
import { FlatList } from "react-native";
import React from "react";

const flatListVariant = createVariant<Theme>({
  themeKey: "flashListVariants",
  property: "variant",
});

type RestyleProps = SpacingProps<Theme> &
  LayoutProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ColorProps<Theme> &
  VariantProps<Theme, "flashListVariants"> &
  React.ComponentProps<typeof FlatList>;

export const RestyleFlatList = createRestyleComponent<RestyleProps, Theme>(
  [
    spacing,
    layout,
    backgroundColor,
    border as unknown as any,
    color,
    flatListVariant,
  ],
  FlatList
);

export type RestyleFlatListProps = React.ComponentProps<typeof RestyleFlatList>;
