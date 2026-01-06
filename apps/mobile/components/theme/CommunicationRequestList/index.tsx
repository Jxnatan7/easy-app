import React, { useCallback } from "react";
import { RestyleFlashListProps } from "@/components/restyle";
import { CommunicationRequestListEmpty } from "../CommunicationRequestListEmpty";
import { PaginatedFlashList } from "../PaginatedFlashList";
import { useCommunicationRequestController } from "@/hooks/useCommunicationRequestController";

type RequestItem = any;

export type CommunicationRequestListProps = Omit<
  RestyleFlashListProps,
  "data"
> & {
  renderItem: any;
  search?: string;
};

export const CommunicationRequestList = ({
  renderItem,
  search,
  ...props
}: CommunicationRequestListProps) => {
  const { user, fetchRequests, newRequests } =
    useCommunicationRequestController(search);

  const renderNewRequestsHeader = useCallback(() => {
    if (newRequests.length === 0) return null;

    return (
      <>
        {newRequests.map((item, index) =>
          renderItem({
            item,
            index,
            target: "Cell",
            extraData: props.extraData,
          })
        )}
      </>
    );
  }, [newRequests]);

  if (!user?.id) {
    return <CommunicationRequestListEmpty />;
  }

  return (
    <PaginatedFlashList<RequestItem>
      {...props}
      style={{ alignSelf: "center", backgroundColor: "transparent" }}
      renderItem={renderItem}
      fetchData={fetchRequests}
      pageSize={10}
      ListHeaderComponent={renderNewRequestsHeader}
      ListEmptyComponent={
        newRequests.length > 0 ? undefined : (
          <CommunicationRequestListEmpty
            showRedirect={false}
            text="Você não possui solicitações de comunicação no momento."
          />
        )
      }
    />
  );
};
