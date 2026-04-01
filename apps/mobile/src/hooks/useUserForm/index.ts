import { useMemo } from "react";
import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/src/features/auth/store/authStore";

export type UserFormValues = {
  name: string;
  email: string;
  phone: string;
};

export function useUserForm() {
  const user = useAuthStore((state) => state.user);
  const setupUser = useAppStore((state) => state.setupUser);
  const isLoading = useAppStore((state) => state.isLoading);

  const initialValues: UserFormValues & { code: string } = useMemo(
    () => ({
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      code: user?.code ?? "",
    }),
    [user],
  );

  const handleSubmit = async (values: UserFormValues) => {
    await setupUser({
      name: values.name,
      email: values.email,
      phone: values.phone,
    });
  };

  return {
    initialValues,
    handleSubmit,
    isEditing: !!user?.id,
    isLoading,
  };
}
