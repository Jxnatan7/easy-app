import React from "react";
import { useRouter } from "expo-router";
import { Container } from "@/components/theme/Container";
import { Text } from "@/components/restyle";
import Button from "@/components/theme/Button";
import { Form, FormTextInput, FormButton } from "@/components/theme/Form";
import { loginFormValidation } from "@/utils/schemaValidation";
import { useAuthActions } from "@/contexts/AuthProvider";

export default function Login() {
  const { replace, push } = useRouter();
  const { login } = useAuthActions();

  const onSubmit = (values: any, { setFieldError }: any) => {
    try {
      login(values.email, values.password).then(() => {
        replace("/(tabs)/user");
      });
    } catch (err: any) {
      const message = "Erro ao realizar login.";
      setFieldError("password", message);
    }
  };

  return (
    <Container
      variant="screen"
      containerHeaderProps={{ backButtonFallback: () => push("/init") }}
    >
      <Text variant="header" mt="xxxl">
        Faça o seu Login
      </Text>

      <Form
        initialValues={{ email: "", password: "" }}
        validate={loginFormValidation}
        onSubmit={onSubmit}
        containerProps={{ marginTop: "xxl" }}
      >
        <FormTextInput
          name="email"
          label="E-mail"
          placeholder="seu-melhor@emai.com"
          keyboardType="email-address"
          autoFocus
          containerProps={{ paddingHorizontal: "m" }}
        />
        <FormTextInput
          name="password"
          placeholder="*********"
          label="Senha"
          secureTextEntry
          containerProps={{ marginTop: "m", paddingHorizontal: "m" }}
        />
        <FormButton variant="primary" text="Continuar" marginTop="xxxl" />
      </Form>
      <Button
        alignSelf="center"
        variant="secondary"
        text="Criar Conta"
        marginTop="s"
        onPress={() => push("/register")}
      />
    </Container>
  );
}
