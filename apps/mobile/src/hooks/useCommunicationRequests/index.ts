import CommunicationRequestService from "@/services/CommunicationRequestService";
import { useMutation } from "@tanstack/react-query";

const useCommunicationRequests = function (onSuccess: () => void = () => {}) {
  const { data, isSuccess, isPending, error, mutate, mutateAsync } =
    useMutation({
      mutationFn: ({ userId, payload }: { userId: string; payload: any }) =>
        CommunicationRequestService.listByUserId(userId, payload),
      mutationKey: ["communication-requests"],
      onSuccess,
    });

  return { data, isSuccess, isPending, error, mutate, mutateAsync };
};

export default useCommunicationRequests;
