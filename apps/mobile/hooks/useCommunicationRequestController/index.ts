import { useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import useCommunicationRequests from "@/hooks/useCommunicationRequests";
import useCommunicationRequestsSocket from "@/hooks/useCommunicationRequestsSocket";
import { PaginatedResult } from "@/components/theme/PaginatedFlashList";

type RequestItem = any;

export function useCommunicationRequestController(search?: string) {
  const userToken = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const { mutateAsync } = useCommunicationRequests();

  const {
    newRequests,
    status: connectionStatus,
    clearNewRequests,
  } = useCommunicationRequestsSocket({
    token: userToken,
  });

  const fetchRequests = useCallback(
    async (
      page: number,
      pageSize: number
    ): Promise<PaginatedResult<RequestItem> | undefined> => {
      if (!user?.id) return undefined;

      if (page === 1) {
        clearNewRequests();
      }

      const response = await mutateAsync({
        userId: user.id,
        payload: {
          page,
          pageSize,
          q: search,
        },
      });

      return response;
    },
    [user?.id, mutateAsync, clearNewRequests, search]
  );

  return {
    user,
    fetchRequests,
    newRequests,
    connectionStatus,
  };
}
