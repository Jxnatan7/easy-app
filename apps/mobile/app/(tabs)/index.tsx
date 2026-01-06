import React, { useCallback, useState } from "react";
import { Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { CommunicationRequestItem } from "@/components/theme/CommunicationRequestItem";
import { CommunicationRequestList } from "@/components/theme/CommunicationRequestList";
import { Container } from "@/components/theme/Container";
import { SearchInput } from "@/components/theme/SearchInput";
import useValidateCommunication from "@/hooks/useValidateCommunication";
import { ActionModal } from "@/components/theme/ActionModal";
import { useDebounce } from "@/hooks/useDebounce";
import { ThemeButton } from "@/components/theme/ThemeButton";

const { width } = Dimensions.get("window");

export default function Home() {
  const { push } = useRouter();

  const [searchText, setSearchText] = useState("");
  const { debouncedFn: handleSearch } = useDebounce((text: string) => {
    setSearchText(text);
  }, 500);

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );

  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const { mutateAsync, isPending } = useValidateCommunication(() => {
    refresh();
  });

  const handleValidation = (status: "ACCEPTED" | "REJECTED") => {
    if (!selectedRequestId) return;

    mutateAsync({
      communicationId: selectedRequestId,
      status: status,
    }).then(() => {
      setSelectedRequestId(null);
    });
  };

  return (
    <Container
      variant="screen"
      containerHeaderProps={{
        title: "Conversas",
        hideBackButton: true,
        children: <ThemeButton />,
      }}
    >
      <SearchInput
        onChangeText={handleSearch}
        containerProps={{ mb: "m", mt: "l", alignSelf: "center" }}
      />

      <CommunicationRequestList
        key={`${refreshKey}-${searchText}`}
        keyExtractor={(item: any) => item._id}
        search={searchText}
        renderItem={({ item }: any) => (
          <CommunicationRequestItem
            key={item._id}
            item={item}
            status={item.status}
            onPress={() =>
              item.status === "PENDING"
                ? setSelectedRequestId(item._id)
                : (item.status === "ACCEPTED" || item.status === "FINALIZED") &&
                  push({
                    pathname: "/chat",
                    params: {
                      chatId: item.chatId,
                      visitorName: item.visitorName,
                      communicationRequestId: item._id,
                      status: item.status,
                    },
                  })
            }
          />
        )}
      />

      <ActionModal
        visible={!!selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
        loading={isPending}
        title="Responder Solicitação"
        description="Deseja permitir ou rejeitar a conversa deste visitante?"
        confirmText="Confirmar"
        rejectText="Rejeitar"
        onConfirm={() => handleValidation("ACCEPTED")}
        onReject={() => handleValidation("REJECTED")}
      />
    </Container>
  );
}
