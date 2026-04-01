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
import { CameraView, type CameraViewProps } from "expo-camera";

const imageVariant = createVariant<Theme>({
  themeKey: "cameraVariants",
  property: "variant",
});

type RestyleProps = SpacingProps<Theme> &
  LayoutProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ColorProps<Theme> &
  VariantProps<Theme, "cameraVariants"> &
  CameraViewProps;

export const RestyleCameraView = createRestyleComponent<RestyleProps, Theme>(
  [
    spacing,
    layout,
    backgroundColor,
    border as unknown as any,
    color,
    imageVariant,
  ],
  CameraView
);

export type RestyleCameraViewProps = React.ComponentProps<
  typeof RestyleCameraView
>;
