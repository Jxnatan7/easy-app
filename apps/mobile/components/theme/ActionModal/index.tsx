import React from "react";
import { Modal, ActivityIndicator, StyleSheet } from "react-native";
import { Box, RestylePressable, Text } from "@/components/restyle";
import theme from "@/theme";

interface ActionModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;

  onConfirm: () => void;
  confirmText?: string;
  onReject?: () => void;
  rejectText?: string;

  loading?: boolean;
}

export const ActionModal = ({
  visible,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = "Confirmar",
  onReject,
  rejectText = "Rejeitar",
  loading = false,
}: ActionModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        p="m"
      >
        <Box
          width="100%"
          maxWidth={450}
          backgroundColor="backgroundLight"
          borderRadius={8}
          p="l"
          elevation={5}
          shadowColor="textGray"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.25}
          shadowRadius={3.84}
        >
          <Text
            variant="containerHeader"
            color="textLight"
            textAlign="center"
            mb="s"
          >
            {title}
          </Text>

          <Text variant="body" textAlign="center" color="textGray" mb="l">
            {description}
          </Text>

          <Box
            flexDirection="row"
            justifyContent="space-between"
            mb="m"
            gap="s"
          >
            {onReject && (
              <RestylePressable
                onPress={onReject}
                disabled={loading}
                style={[
                  styles.buttonBase,
                  { backgroundColor: theme.colors.finish },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text variant="button" color="buttonTextLight" fontSize={16}>
                    {rejectText}
                  </Text>
                )}
              </RestylePressable>
            )}

            <RestylePressable
              onPress={onConfirm}
              disabled={loading}
              style={[
                styles.buttonBase,
                {
                  backgroundColor:
                    theme.colors.buttonBackgroundLight || "#007BFF",
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text variant="button" color="buttonTextLight" fontSize={16}>
                  {confirmText}
                </Text>
              )}
            </RestylePressable>
          </Box>

          <RestylePressable
            variant="transparent"
            onPress={onClose}
            disabled={loading}
          >
            <Text
              textAlign="center"
              variant="body"
              color="textGray"
              style={{ textDecorationLine: "underline" }}
            >
              Cancelar e fechar
            </Text>
          </RestylePressable>
        </Box>
      </Box>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
