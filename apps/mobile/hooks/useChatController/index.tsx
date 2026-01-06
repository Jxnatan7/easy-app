import { useMemo } from "react";
import { useCommunicationRequestStore } from "@/stores/communicationRequestStore";
import useChatMessages from "@/hooks/useChatMessages";
import useChatSocket from "@/hooks/useChatSocket";
import { useAuthStore } from "@/stores/authStore";

export function useChatController(chatId: string) {
  const userToken = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const visitorToken = useCommunicationRequestStore((s) => s.visitorToken);
  const visitorId = useCommunicationRequestStore((s) => s.visitorId);
  const visitorCommunicationRequestId = useCommunicationRequestStore(
    (s) => s.communicationRequestId
  );

  const activeToken = userToken || visitorToken || "";
  const currentUserId = user?.id || visitorId;

  const oldMessagesQuery = useChatMessages(chatId);
  const {
    messages: liveMessages,
    sendMessage,
    status,
  } = useChatSocket({
    chatId,
    token: activeToken,
  });

  const allMessages = useMemo(() => {
    const historical = oldMessagesQuery.data?.items || [];
    return [...historical, ...liveMessages];
  }, [oldMessagesQuery.data, liveMessages]);

  return {
    messages: allMessages,
    sendMessage,
    connectionStatus: status,
    currentUserId,
    isLoading: oldMessagesQuery.isPending,
    communicationRequestId: visitorCommunicationRequestId,
    isVisitor: currentUserId === visitorId,
  };
}
