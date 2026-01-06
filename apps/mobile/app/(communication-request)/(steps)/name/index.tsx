import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import Button from "@/components/theme/Button";
import { Container } from "@/components/theme/Container";
import { StepHeader } from "@/components/theme/StepHeader";
import { TextInput } from "@/components/theme/TextInput";

import useCreateCommunicationRequest from "@/hooks/useCreateCommunicationRequest";
import { useDebounce } from "@/hooks/useDebounce";
import { useCommunicationRequestContext } from "@/contexts/CommunicationRequestContext";

export default function Name() {
  const { push } = useRouter();
  const [name, setName] = useState<string>("");

  const { mutateAsync, isPending } = useCreateCommunicationRequest();
  const store = useCommunicationRequestContext();

  const { debouncedFn: handleNameChange, clear: clearDebounce } = useDebounce(
    (text: string) => {
      setName(text);
    },
    500
  );

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      store.setVisitorName(name);
      const payload = store.getPayload();

      const response = await mutateAsync(payload);

      store.setResponse(response);
      push("/awaiting-validation");
    } catch (error) {
      console.error("Erro ao criar solicitação", error);
    }
  };

  const handleEndEditing = (text: string) => {
    clearDebounce();
    setName(text);
  };

  return (
    <Container variant="screen">
      <StepHeader
        title="Insira o seu nome"
        subtitle="O seu nome é essencial para que o usuário aceite a sua solicitação"
      />

      <TextInput
        autoFocus
        placeholder="O seu nome..."
        returnKeyType="done"
        onChangeText={handleNameChange}
        onEndEditing={({ nativeEvent }) => handleEndEditing(nativeEvent.text)}
      />

      <Button
        variant="primary"
        alignSelf="center"
        onPress={handleSubmit}
        text="Continuar"
        marginTop="xxxl"
        disabled={!name || isPending}
        style={[
          styles.buttonCenter,
          (!name || isPending) && styles.buttonDisabled,
        ]}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  buttonCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
