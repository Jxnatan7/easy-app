import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { generalStorage } from "./store";
import { User } from "./authStore";

export type CommunicationRequestState = {
  code: string | null;
  user: Partial<User> | null;
  initialMessage: string | null;
  visitorId: string | null;
  visitorName: string | null;
  visitorToken: string | null;
  isLoading: boolean;
  error: string | null;
  communicationRequestId: string | null;
  isAwaitingResponse: boolean;
  getPayload: () => {
    userId: string;
    initialMessage: string;
    visitorName: string;
  };
  setResponse: (response: any) => void;
  setVisitorName: (name: string) => void;
  setCode: (code: string) => void;
  setInitialMessage: (message: string) => void;
  setUser: (user: Partial<User>) => void;
  setIsAwaitingResponse: (state: boolean) => void;
  clearAppData: () => void;
};

const INITIAL_STATE: Partial<CommunicationRequestState> = {
  user: null,
  code: null,
  communicationRequestId: null,
  initialMessage: null,
  visitorId: null,
  visitorName: null,
  visitorToken: null,
  isLoading: false,
  error: null,
  isAwaitingResponse: false,
};

export const useCommunicationRequestStore = create<CommunicationRequestState>()(
  persist(
    (set, get) => ({
      user: null,
      code: null,
      communicationRequestId: null,
      initialMessage: null,
      visitorId: null,
      visitorName: null,
      visitorToken: null,
      isLoading: false,
      error: null,
      isAwaitingResponse: false,
      getPayload: () => ({
        userId: get().user?.id ?? "",
        initialMessage: get().initialMessage ?? "",
        visitorName: get().visitorName ?? "",
      }),
      setResponse: (response: any) => {
        set({
          visitorId: response.visitorId,
          visitorToken: response.visitorToken,
          communicationRequestId: response.id,
          isAwaitingResponse: true,
        });
      },
      setCode: (code: string) => set({ code }),
      setInitialMessage: (message: string) => set({ initialMessage: message }),
      setVisitorName: (name: string) => set({ visitorName: name }),
      setUser: (user: Partial<User>) => set({ user }),
      setIsAwaitingResponse: (state: boolean) =>
        set({ isAwaitingResponse: state }),
      clearAppData: () => set({ ...get(), ...INITIAL_STATE }),
    }),
    {
      name: "communication-request-storage",
      storage: createJSONStorage(() => generalStorage),
    }
  )
);
