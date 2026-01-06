import Button from "@/components/theme/Button";
import { Container } from "@/components/theme/Container";
import { MessageOptions } from "@/components/theme/MessageOptions";
import { StepHeader } from "@/components/theme/StepHeader";
import { TextInput } from "@/components/theme/TextInput";
import { useCommunicationRequestContext } from "@/contexts/CommunicationRequestContext";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function InitialMessage() {
  const { push } = useRouter();
  const [messageSelected, setMessageSelected] = useState<string>();

  const store = useCommunicationRequestContext();

  const handleSubmit = () => {
    if (!messageSelected) return;
    store.setInitialMessage(messageSelected);
    push("/(communication-request)/(steps)/name");
  };

  return (
    <Container variant="screen">
      <StepHeader
        title="Escreva a sua mensagem inicial para:"
        subtitle={store.user?.name}
        subtitleProps={{ fontSize: 24 }}
      />
      <MessageOptions
        messageSelected={messageSelected}
        setMessageSelected={setMessageSelected}
      />
      <TextInput
        value={messageSelected}
        autoFocus
        placeholder="Ex.: Ola, gostaria de saber mais sobre..."
        minHeight={120}
        onEndEditing={({ nativeEvent }) => setMessageSelected(nativeEvent.text)}
        onChangeText={(text) => setMessageSelected(text)}
        multiline
      />
      <Button
        alignSelf="center"
        variant="primary"
        text="Continuar"
        marginTop="xl"
        onPress={() => handleSubmit()}
        disabled={!messageSelected}
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: messageSelected ? 1 : 0.5,
        }}
      />
    </Container>
  );
}
