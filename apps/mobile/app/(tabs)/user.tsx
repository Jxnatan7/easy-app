import { RestyleTouchableOpacity } from "@/components/restyle";
import { Container } from "@/components/theme/Container";
import { Form, FormButton, FormTextInput } from "@/components/theme/Form";
import { useAuthActions } from "@/contexts/AuthProvider";
import { useUserForm } from "@/hooks/useUserForm";
import { userFormValidation } from "@/utils/schemaValidation";
import { Alert } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PressableCopyPaste } from "@/components/theme/PressableCopyPaste";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/theme";
import QRCodeStyled from "react-native-qrcode-styled";

const LogoutButton = () => {
  const theme = useTheme<Theme>();
  const { logout } = useAuthActions();
  return (
    <RestyleTouchableOpacity onPress={() => logout()} variant="icon">
      <MaterialIcons name="logout" size={24} color={theme.colors.mainText} />
    </RestyleTouchableOpacity>
  );
};

export default function User() {
  const { initialValues, handleSubmit, isEditing, isLoading } = useUserForm();

  const onSubmit = async (values: any) => {
    try {
      await handleSubmit(values);
      Alert.alert("Sucesso", "Informações salvas com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  return (
    <Container
      variant="screen"
      containerHeaderProps={{
        title: "Seu Perfil",
        hideBackButton: true,
        children: <LogoutButton />,
      }}
    >
      <Form
        initialValues={initialValues}
        validate={userFormValidation}
        onSubmit={onSubmit}
        enableReinitialize
        containerProps={{ marginBottom: "s" }}
      >
        <FormTextInput name="name" label="Nome" placeholder="Seu Nome" />

        <FormTextInput
          containerProps={{ marginTop: "s" }}
          name="email"
          label="Email"
          placeholder="Seu Email"
          keyboardType="email-address"
        />

        <FormTextInput
          containerProps={{ marginTop: "s" }}
          name="phone"
          label="Telefone"
          placeholder="Seu Telefone"
        />

        {initialValues.code && (
          <PressableCopyPaste
            label="Código"
            value={initialValues.code}
            containerProps={{ marginTop: "s" }}
          />
        )}

        {initialValues.code && (
          <QRCodeStyled
            data={initialValues.code}
            style={{
              backgroundColor: "white",
              alignSelf: "center",
              marginTop: 50,
            }}
            size={200}
            padding={10}
          />
        )}
        <FormButton
          text={isEditing ? "Atualizar Dados" : "Salvar Tudo"}
          marginTop="xxxl"
        />
      </Form>
    </Container>
  );
}
