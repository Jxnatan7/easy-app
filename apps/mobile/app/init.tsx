import { Box, Text } from "@/components/restyle";
import Button from "@/components/theme/Button";
import { Container } from "@/components/theme/Container";
import { PlanetAnimation } from "@/components/theme/PlanetAnimation";
import { ThemeButton } from "@/components/theme/ThemeButton";
import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";
import { useCommunicationRequestStore } from "@/stores/communicationRequestStore";
import { Redirect, useRouter } from "expo-router";

export default function App() {
  const token = useAuthStore((s) => s.token);
  const chatId = useAppStore((s) => s.chatId);
  const visitorToken = useCommunicationRequestStore((s) => s.visitorToken);
  const isAwaitingResponse = useCommunicationRequestStore(
    (s) => s.isAwaitingResponse
  );

  if (token) {
    return <Redirect href="/(tabs)/user" />;
  }

  if (visitorToken && isAwaitingResponse) {
    return (
      <Redirect
        href={{
          pathname: "/awaiting-validation",
        }}
      />
    );
  }

  if (visitorToken && chatId) {
    return (
      <Redirect
        href={{
          pathname: "/chat",
          params: {
            chatId: chatId,
            blockBack: "true",
          },
        }}
      />
    );
  }

  const { push } = useRouter();

  return (
    <Container
      variant="screen"
      containerHeaderProps={{
        hideBackButton: true,
        justifyContent: "flex-end",
      }}
      containerHeaderChildren={<ThemeButton />}
    >
      <Box flex={1} justifyContent="flex-end" alignItems="center" mb="xl">
        <Text variant="header" mb="l">
          Easy - App
        </Text>
        <PlanetAnimation />
        <Box
          width="100%"
          alignItems="center"
          justifyContent="center"
          flexDirection="row"
          px="l"
          mb="xl"
        >
          <Text
            variant="sub-header"
            textAlign="center"
            flex={1}
            px="s"
            maxWidth={600}
          >
            Foque no seu negócio, a estrutura nós já construímos.
          </Text>
        </Box>
      </Box>

      <Box width="100%" alignItems="center" justifyContent="flex-end" pb="xl">
        <Button
          variant="primary"
          text="Começar a conversar"
          marginVertical="s"
          onPress={() => {
            push("/(communication-request)/(steps)/code");
          }}
        />
        <Button
          text="Fazer Login"
          variant="secondary"
          onPress={() => {
            push("/login");
          }}
        />
      </Box>
    </Container>
  );
}
