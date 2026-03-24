import Button from "@/components/theme/Button";
import { CodeCamera } from "@/components/theme/CodeCamera";
import CodeInput from "@/components/theme/CodeInput";
import { Container } from "@/components/theme/Container";
import { StepHeader } from "@/components/theme/StepHeader";
import { useCommunicationRequestContext } from "@/contexts/CommunicationRequestContext";
import UserService from "@/services/UserService";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";

export default function CodeStepScreen() {
  const { push } = useRouter();
  const [codeInput, setCodeInput] = useState("CAMERA");
  const pathName = usePathname();
  const store = useCommunicationRequestContext();

  const onFullfill = (code: string) => {
    UserService.findByCode(code.toUpperCase()).then((user) => {
      if (user) {
        store.setUser(user);
        push(`/(communication-request)/(steps)/initial-message`);
      }
    });
  };

  return (
    <Container variant="screen">
      <StepHeader
        title="Insira o código"
        subtitle="O código do usuário que deseja conversar"
      />

      {codeInput === "CAMERA" && (
        <CodeCamera onCodeScanned={onFullfill} pathName={pathName} />
      )}

      {codeInput === "TEXT" && (
        <CodeInput
          length={10}
          keyboardType="name-phone-pad"
          autoFocus
          onFullfill={onFullfill}
        />
      )}

      <Button
        variant="primary"
        marginTop="xxl"
        alignSelf="center"
        text={codeInput === "CAMERA" ? "Digitar código" : "Ler QR Code"}
        onPress={() => {
          setCodeInput((prev) => (prev === "CAMERA" ? "TEXT" : "CAMERA"));
        }}
      />
    </Container>
  );
}
