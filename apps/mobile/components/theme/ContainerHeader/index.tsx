import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Box, BoxProps, Text } from "@/components/restyle";
import { BackButton } from "../BackButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ContainerHeaderProps = {
  title?: string;
  children?: React.ReactNode;
  hideBackButton?: boolean;
  backButtonFallback?: () => void;
} & BoxProps;

const HEADER_HEIGHT = 60;

export const ContainerHeader = ({
  title,
  hideBackButton = false,
  children,
  backButtonFallback,
  ...props
}: ContainerHeaderProps) => {
  const insets = useSafeAreaInsets();
  const totalHeight = HEADER_HEIGHT + insets.top;

  return (
    <Box
      style={[styles.headerWrapper, { paddingTop: insets.top }]}
      height={totalHeight}
      flexDirection="row"
      alignItems="center"
      width={Dimensions.get("window").width}
      backgroundColor="transparent"
      gap="m"
      px="l"
      justifyContent="space-between"
      {...props}
    >
      {!hideBackButton && <BackButton fallback={backButtonFallback} />}
      {title && (
        <Text variant="containerHeader" flex={1}>
          {title}
        </Text>
      )}
      {children}
    </Box>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 10,
  },
});
