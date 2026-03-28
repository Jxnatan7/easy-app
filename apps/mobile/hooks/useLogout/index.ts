import { useAuthStore } from "@/src/features/auth/store/authStore";

export function useLogout() {
  const { logout } = useAuthStore();
  return () => {
    logout();
  };
}
