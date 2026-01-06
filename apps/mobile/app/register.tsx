import React from "react";
import { Text } from "@/components/restyle";
import { Container } from "@/components/theme/Container";
import { useRouter } from "expo-router";
import { Form, FormTextInput, FormButton } from "@/components/theme/Form";
import { registerFormValidation } from "@/utils/schemaValidation";
import { useAuthActions } from "@/contexts/AuthProvider";

export default function Register() {
  const { replace, push } = useRouter();
  const { register } = useAuthActions();

  const onSubmit = async (
    values: { name: string; email: string; password: string },
    { setSubmitting, setFieldError }: any
  ) => {
    setSubmitting(true);
    try {
      register({
        name: values.name,
        email: values.email,
        password: values.password,
      }).then(() => replace("/(tabs)"));
    } catch (err: any) {
      const message = "Erro ao realizar cadastro. Verifique suas credenciais.";
      setFieldError("password", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container
      variant="screen"
      containerHeaderProps={{ backButtonFallback: () => push("/login") }}
    >
      <Text variant="header" mt="xxxl">
        Crie a sua conta
      </Text>

      <Form
        initialValues={{ name: "", email: "", password: "" }}
        validate={registerFormValidation}
        onSubmit={onSubmit}
      >
        <FormTextInput
          name="name"
          autoFocus
          marginTop="xl"
          placeholder="Nome"
          autoCapitalize="none"
        />

        <FormTextInput
          name="email"
          marginTop="m"
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <FormTextInput
          name="password"
          marginTop="m"
          placeholder="Senha"
          secureTextEntry
        />

        <FormButton variant="primary" text="Continuar" marginTop="xxxl" />
      </Form>
    </Container>
  );
}
