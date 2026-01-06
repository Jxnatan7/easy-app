import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export type ChatMessage = {
  id?: string;
  chatId?: string;
  communicationRequestId?: string | null;
  content: string;
  senderId?: string;
  createdAt?: string;
  [k: string]: any;
};

export type Participant = {
  id: string;
  name?: string;
  [k: string]: any;
};

type SendPayload = Partial<
  Pick<ChatMessage, "chatId" | "communicationRequestId">
> & {
  content: string;
};

type UseChatSocketArgs = {
  chatId: string | undefined | null;
  token: string;
  url?: string;
  path?: string;
};

export default function useChatSocket({
  chatId,
  token,
  url = process.env.EXPO_PUBLIC_API_URL,
  path = "/ws/chat",
}: UseChatSocketArgs) {
  const socketRef = useRef<Socket | null>(null);
  const mountedRef = useRef(true);

  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatStatus, setChatStatus] = useState<string>("");

  const chatIdRef = useRef<string | null>(chatId ?? null);
  useEffect(() => {
    chatIdRef.current = chatId ?? null;
  }, [chatId]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!token || !chatId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setStatus("disconnected");
      }
      return;
    }

    setStatus("connecting");

    const socket = io(url, {
      path,
      autoConnect: true,
      reconnectionAttempts: 5,
      auth: { token },
      ...({ query: { token } } as any),
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    const safeSetStatus = (s: ConnectionStatus) => {
      if (!mountedRef.current) return;
      setStatus(s);
    };

    const handleConnect = () => {
      safeSetStatus("connected");
      socket.emit("joinByChat", { chatId });
    };

    const handleJoined = (data: any) => {
      if (!mountedRef.current) return;
      if (Array.isArray(data?.participants)) {
        setParticipants(data.participants);
      }
    };

    const handleParticipantJoined = (p: Participant) => {
      setParticipants((prev) => {
        if (prev.find((x) => x.id === p.id)) return prev;
        return [...prev, p];
      });
    };

    const handleParticipantLeft = (p: Participant) => {
      setParticipants((prev) => prev.filter((x) => x.id !== p.id));
    };

    const handleMessage = (m: ChatMessage) => {
      setMessages((prev) => [...prev, m]);
    };

    const handleConnectError = (err: any) => {
      console.error("socket connect_error", err);
      safeSetStatus("error");
    };

    const handleDisconnect = (reason: string) => {
      console.log("socket disconnected:", reason);
      if (!mountedRef.current) return;
      safeSetStatus("disconnected");
    };

    const handleChatStatus = (res: { action: string }) => {
      if (!mountedRef.current) return;
      setChatStatus(res.action);
    };

    socket.on("connect", handleConnect);
    socket.on("joined", handleJoined);
    socket.on("participant_joined", handleParticipantJoined);
    socket.on("participant_left", handleParticipantLeft);
    socket.on("message", handleMessage);
    socket.on("onChat", handleChatStatus);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);

    return () => {
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("joined", handleJoined);
        socket.off("participant_joined", handleParticipantJoined);
        socket.off("participant_left", handleParticipantLeft);
        socket.off("message", handleMessage);
        socket.off("onChat", handleChatStatus);
        socket.off("connect_error", handleConnectError);
        socket.off("disconnect", handleDisconnect);
        socket.disconnect();
      }
      socketRef.current = null;
      if (mountedRef.current) setStatus("disconnected");
    };
  }, [token, chatId, url, path]);

  const sendMessage = useCallback((payload: SendPayload): Promise<any> => {
    return new Promise((resolve, reject) => {
      const socket = socketRef.current;
      if (!socket || socket.disconnected) {
        reject(new Error("socket not connected"));
        return;
      }

      const finalPayload: ChatMessage = {
        chatId: payload.chatId,
        communicationRequestId:
          payload.communicationRequestId ??
          payload.chatId ??
          chatIdRef.current ??
          null,
        content: payload.content,
        timestamp: new Date(),
      };

      try {
        socket.emit("message", finalPayload, (ack: any) => {
          resolve(ack);
        });

        resolve({ ok: true });
      } catch (err) {
        reject(err);
      }
    });
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return {
    messages,
    participants,
    status,
    sendMessage,
    clearMessages,
    chatStatus,
    socket: socketRef.current,
  };
}
