import {
  Box,
  RestyleContainer,
  RestyleContainerProps,
} from "@/components/restyle";
import { ContainerHeader, ContainerHeaderProps } from "../ContainerHeader";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/theme";

export type ContainerProps = RestyleContainerProps & {
  hideHeader?: boolean;
  containerHeaderProps?: ContainerHeaderProps;
  containerHeaderChildren?: React.ReactNode;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const Container = ({
  children,
  hideHeader,
  containerHeaderProps,
  containerHeaderChildren,
  ...props
}: ContainerProps) => {
  const theme = useTheme<Theme>();

  return (
    <RestyleContainer {...props}>
      <LinearGradient
        colors={[
          theme.colors.backgroundGradient0,
          theme.colors.backgroundGradient1,
        ]}
        style={styles.background}
      >
        {!hideHeader && (
          <ContainerHeader
            children={containerHeaderChildren}
            {...containerHeaderProps}
          />
        )}
        <Box mt="xxxl" />
        {children}
      </LinearGradient>
    </RestyleContainer>
  );
};

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: SCREEN_HEIGHT,
  },
});
