import {
  Box,
  RestyleCameraView,
  RestyleCameraViewProps,
  Text,
} from "@/components/restyle";
import { CameraType, useCameraPermissions } from "expo-camera";
import { ActivityIndicator, StyleSheet, Vibration } from "react-native";
import Button, { ButtonProps } from "../Button";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { useQRCodeScanner } from "@/hooks/useQrCodeScanner";
import { useIsFocused } from "@react-navigation/native";

export type CameraButtonProps = ButtonProps & {
  icon?: React.ReactNode;
  offIcon?: React.ReactNode;
  isOff?: boolean;
};

type CodeCameraProps = RestyleCameraViewProps & {
  onCodeScanned: (code: string) => void;
  pathName?: string;
};

export type CodeCameraHandle = {
  reset: () => void;
};

export const CameraButton = ({
  icon,
  offIcon,
  isOff,
  ...props
}: CameraButtonProps) => (
  <Button variant="cameraOption" {...props}>
    {isOff && offIcon}
    {!isOff && icon}
  </Button>
);

export const CodeCamera = ({
  onCodeScanned,
  pathName,
  ...props
}: CodeCameraProps) => {
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState(false);

  const handleBarcodeScanned = useCallback(
    (data: string) => {
      if (!isFocused) return;

      Vibration.vibrate(100);
      onCodeScanned(data);
    },
    [isFocused, onCodeScanned]
  );

  const { onBarCodeScanned, resetScanner } = useQRCodeScanner({
    onRead: handleBarcodeScanned,
    path: pathName,
  });

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((prev) => !prev);
  };

  useEffect(() => {
    if (!isFocused) {
      resetScanner();
    }
    return () => {
      resetScanner();
    };
  }, [isFocused]);

  if (!isFocused) {
    return <Box />;
  }

  if (!permission) {
    return <ActivityIndicator />;
  }

  if (!permission.granted) {
    return (
      <Box style={styles.permissionContainer}>
        <Text variant="body">
          Você precisa permitir o uso da camera para ler o código
        </Text>
        <Button
          variant="transparent"
          onPress={requestPermission}
          text="Permitir acesso"
          textProps={{
            style: styles.linkText,
            color: "mainText",
          }}
        />
      </Box>
    );
  }

  return (
    <>
      <Box
        width="100%"
        maxHeight={{ smallPhone: 250, phone: 300 }}
        alignItems="center"
        overflow="hidden"
      >
        <Box
          width={{ smallPhone: 200, phone: 262 }}
          height={{ smallPhone: 200, phone: 262 }}
          overflow="hidden"
          borderRadius={10}
        >
          <RestyleCameraView
            facing={facing}
            enableTorch={flash}
            variant="code"
            onBarcodeScanned={onBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            {...props}
          />
        </Box>
      </Box>
      <Box style={styles.controlsContainer} paddingTop="s" paddingRight="xxl">
        <CameraButton
          onPress={toggleFlash}
          isOff={flash}
          icon={<Ionicons name="flash" size={24} color="black" />}
          offIcon={
            <Ionicons name="flash-off-outline" size={24} color="black" />
          }
        />
        <CameraButton
          onPress={toggleFacing}
          icon={<Entypo name="cycle" size={24} color="black" />}
        />
      </Box>
    </>
  );
};

const styles = StyleSheet.create({
  permissionContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  linkText: {
    textDecorationLine: "underline",
  },
  controlsContainer: {
    width: "100%",
    maxWidth: 400,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "center",
    gap: 10,
  },
});
