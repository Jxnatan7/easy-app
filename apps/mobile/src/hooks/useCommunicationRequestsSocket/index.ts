import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export type CommunicationRequest = {
  id: string;
  visitorName: string;
  status: string;
  createdAt: string;
  [k: string]: any;
};

type UseRequestsSocketArgs = {
  token: string | null;
  url?: string;
  path?: string;
};

export default function useCommunicationRequestsSocket({
  token,
  url = process.env.EXPO_PUBLIC_API_URL,
  path = "/ws/chat",
}: UseRequestsSocketArgs) {
  const socketRef = useRef<Socket | null>(null);
  const mountedRef = useRef(true);

  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [newRequests, setNewRequests] = useState<CommunicationRequest[]>([]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!token) {
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
      query: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    const safeSetStatus = (s: ConnectionStatus) => {
      if (!mountedRef.current) return;
      setStatus(s);
    };

    const handleConnect = () => {
      safeSetStatus("connected");
    };

    const handleNewRequest = (request: CommunicationRequest) => {
      if (!mountedRef.current) return;
      setNewRequests((prev) => [request, ...prev]);
    };

    const handleUpdatedRequest = (request: CommunicationRequest) => {
      if (!mountedRef.current) return;
      setNewRequests((prev) => [request, ...prev]);
    };

    const handleConnectError = (err: any) => {
      console.error("socket connect_error", err);
      safeSetStatus("error");
    };

    const handleDisconnect = () => {
      if (!mountedRef.current) return;
      safeSetStatus("disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("new_communication_request", handleNewRequest);
    socket.on("update_communication_request", handleUpdatedRequest);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);

    return () => {
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("new_communication_request", handleNewRequest);
        socket.off("update_communication_request", handleUpdatedRequest);
        socket.off("connect_error", handleConnectError);
        socket.off("disconnect", handleDisconnect);
        socket.disconnect();
      }
      socketRef.current = null;
      if (mountedRef.current) setStatus("disconnected");
    };
  }, [token, url, path]);

  const clearNewRequests = useCallback(() => {
    setNewRequests([]);
  }, []);
  return {
    newRequests,
    status,
    socket: socketRef.current,
    clearNewRequests,
  };
}
