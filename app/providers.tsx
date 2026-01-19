"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { authClient } from "@/lib/auth-client";

const SessionContext = createContext<{
  refreshSession: () => Promise<void>;
}>({
  refreshSession: async () => {},
});

export function Providers({ children }: { children: ReactNode }) {
  const refreshSession = async () => {
    // Força a revalidação da sessão
    await authClient.getSession();
  };

  return (
    <SessionContext.Provider value={{ refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSessionContext = () => useContext(SessionContext);
