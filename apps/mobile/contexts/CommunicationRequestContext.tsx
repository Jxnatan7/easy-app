import {
  CommunicationRequestState,
  useCommunicationRequestStore,
} from "@/stores/communicationRequestStore";
import { createContext, useContext, useMemo } from "react";

const CommunicationRequestContext =
  createContext<CommunicationRequestState | null>(null);

export const CommunicationRequestProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const store = useCommunicationRequestStore();

  const storeContext = useMemo(() => {
    return { ...store };
  }, [store]);

  return (
    <CommunicationRequestContext.Provider value={storeContext}>
      {children}
    </CommunicationRequestContext.Provider>
  );
};

export const useCommunicationRequestContext = () => {
  const context = useContext(CommunicationRequestContext);
  if (context === null) {
    throw new Error(
      "useCommunicationRequest must be used within a CommunicationRequestProvider"
    );
  }
  return context;
};
