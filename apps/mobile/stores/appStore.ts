import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generalStorage } from "./store";
import UserService from "@/services/UserService";
import { useAuthStore } from "./authStore";

type AppState = {
  theme: "light" | "dark";
  chatId: string | null;
  isLoading: boolean;
  error: string | null;

  setChatId: (id: string) => void;
  setupUser: (payload: any) => Promise<void>;
  setTheme: (theme: "light" | "dark") => void;
  clearAppData: () => void;
};

const INITIAL_STATE: Partial<AppState> = {
  chatId: null,
  isLoading: false,
  error: null,
  theme: "light",
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "light",
      chatId: null,
      isLoading: false,
      error: null,
      setupUser: async (payload) => {
        set({ isLoading: true, error: null });
        const { user } = useAuthStore.getState();

        if (!user) {
          throw new Error("Usuário não encontrado.");
        }

        try {
          const data = await UserService.update(user.id, payload);

          if (!data) {
            set({
              isLoading: false,
            });
            return;
          }

          useAuthStore.setState({
            user: data,
          });

          set({
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Falha no cadastro",
            isLoading: false,
          });
          throw error;
        }
      },
      setChatId: (id) => set({ chatId: id }),
      setTheme: (theme) => set({ theme }),
      clearAppData: () => set({ ...get(), ...INITIAL_STATE }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => generalStorage),
    }
  )
);
