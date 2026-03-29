import { AuthService } from "@/services/AuthService";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { secureStorage } from "../../../../stores/store";
import { useAppStore } from "../../../../stores/appStore";
import { useCommunicationRequestStore } from "../../communication-request/store/communicationRequestStore";

export type User = {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  token: string;
  code: string;
  role: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  isLoading: boolean;
  error: string | null;

  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

const INITIAL_STATE: Partial<AuthState> = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  _hasHydrated: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await AuthService.login(email, password);
          set({
            token: data.token,
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Falha no login",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async ({ name, email, password }) => {
        set({ isLoading: true, error: null });
        try {
          AuthService.register(name, email, password).then(({ user: data }) => {
            set({
              token: data.token,
              user: {
                ...data,
                id: data._id,
              },
              isAuthenticated: true,
              isLoading: false,
            });
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Falha no cadastro",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({ ...get(), ...INITIAL_STATE });
        useAppStore.getState().clearAppData();
        useCommunicationRequestStore.getState().clearAppData();
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
