import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet } from "react-native";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

import { Container } from "@/components/theme/Container";
import { Message } from "@/components/theme/Message";
import { MessageInput } from "@/components/theme/MessageInput";
import { MessageList } from "@/components/theme/MessageList";
import { IconButton } from "@/components/theme/IconButton";

import { useChatController } from "@/hooks/useChatController";
import { usePreventGoBack } from "@/hooks/usePreventGoBack";
import { BottomSheet } from "@/components/theme/BottomSheet";
import { Text } from "@/components/restyle";
import { FlashListRef } from "@shopify/flash-list";
import Button from "@/components/theme/Button";
import { ActionModal } from "@/components/theme/ActionModal";
import useValidateCommunication from "@/hooks/useValidateCommunication";
import { useQueryClient } from "@tanstack/react-query";
import { useLogout } from "@/hooks/useLogout";
import { useCommunicationRequestStore } from "@/stores/communicationRequestStore";
import { ThemeButton } from "@/components/theme/ThemeButton";

export default function ChatScreen() {
  const {
    chatId,
    blockBack,
    visitorName,
    communicationRequestId: selectedRequestId,
    status,
  } = useLocalSearchParams<{
    chatId: string;
    blockBack: string;
    visitorName: string;
    communicationRequestId: string;
    status: string;
  }>();

  const { push, replace, canDismiss, dismissAll } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const isBackBlocked = blockBack === "true";
  const queryClient = useQueryClient();
  const logout = useLogout();

  usePreventGoBack(isBackBlocked);

  const chatController = useChatController(chatId);

  const communicationId = useMemo(
    () => selectedRequestId ?? chatController.communicationRequestId,
    [selectedRequestId, chatController.communicationRequestId]
  );

  if (!chatId) {
    return <Redirect href="/init" />;
  }

  const { messages, sendMessage, connectionStatus, currentUserId, isVisitor } =
    chatController;

  const renderMessageItem = useCallback(
    ({ item }: { item: any }) => (
      <Message
        content={item.content}
        isMyMessage={item.sender._id.toString() === currentUserId}
        timestamp={item.timestamp}
      />
    ),
    [currentUserId]
  );

  const listRef = useRef<FlashListRef<any>>(null);

  const scrollToBottom = () => {
    const id = setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 50);

    return () => clearTimeout(id);
  };

  const handleSend = async (content: string) => {
    sendMessage({ chatId, content }).then(() => {
      scrollToBottom();
    });
  };

  const { mutateAsync, isPending } = useValidateCommunication(() => {
    setModalIsOpen(false);
    queryClient.invalidateQueries({ queryKey: ["communication-requests"] });
  });

  const handleRedirect = () => {
    setModalIsOpen(false);

    if (isVisitor) {
      logout();

      if (canDismiss()) {
        dismissAll();
      }
      replace("/init");
      return;
    }
    push("/(tabs)");
  };

  const handleValidation = async (status: "FINALIZED") => {
    if (!communicationId) return;

    mutateAsync({
      communicationId: communicationId,
      status: status,
    }).then(handleRedirect);
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (chatController.chatStatus === "FINISHED") {
      if (isVisitor) {
        logout();
        if (canDismiss()) {
          dismissAll();
        }
        replace("/init");
        return;
      }
      replace("/(tabs)");
    }
  }, [chatController.chatStatus]);

  return (
    <>
      <Container
        variant="chat"
        containerHeaderProps={{
          title:
            visitorName ||
            useCommunicationRequestStore.getState().user?.name ||
            "Chat",
          hideBackButton: isBackBlocked,
          backButtonFallback: () => push("/(tabs)"),
          children: (
            <>
              {isVisitor && <ThemeButton />}
              {status !== "FINALIZED" && (
                <IconButton
                  icon={
                    <FontAwesome5 name="ellipsis-v" size={24} color="black" />
                  }
                  onPress={() => setIsOpen(true)}
                />
              )}
            </>
          ),
        }}
      >
        <MessageList
          ref={listRef}
          data={messages}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={renderMessageItem}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />

        <MessageInput
          onSend={handleSend}
          editable={connectionStatus === "connected" && status !== "FINALIZED"}
        />
        <BottomSheet
          isVisible={isOpen}
          onClose={() => setIsOpen(false)}
          height="80%"
        >
          <Text textAlign="center" variant="infoTitle" color="textLight">
            Finalizar Conversa ?
          </Text>
          <Button
            alignSelf="center"
            marginTop="l"
            variant="red"
            text="Finalizar"
            onPress={() => {
              setIsOpen(false);
              setModalIsOpen(true);
            }}
          />
        </BottomSheet>
      </Container>
      <ActionModal
        visible={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        loading={isPending}
        title="Confirmação"
        description="Deseja finalizar a conversa?"
        confirmText="Confirmar"
        rejectText="Rejeitar"
        onConfirm={() => handleValidation("FINALIZED")}
        onReject={() => setModalIsOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  contentContainer: {
    flexGrow: 1,
  },
  listContent: {
    flexGrow: 1,
  },
});
