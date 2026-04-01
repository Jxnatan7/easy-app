import CommunicationRequestService from "@/services/CommunicationRequestService";
import { useMutation } from "@tanstack/react-query";

const useValidateCommunication = function (onSuccess: () => void = () => {}) {
  const { data, isSuccess, isPending, error, mutate, mutateAsync } =
    useMutation({
      mutationFn: ({
        communicationId,
        status,
      }: {
        communicationId: string;
        status: string;
      }) => CommunicationRequestService.validate(communicationId, status),
      mutationKey: ["validate-communication"],
      onSuccess,
    });

  return { data, isSuccess, isPending, error, mutate, mutateAsync };
};

export default useValidateCommunication;
