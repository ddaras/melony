import React, { createContext, useContext, ReactNode } from "react";
import { UIContract } from "./types";

export type MelonyComponents = {
  [K in keyof UIContract]: React.ComponentType<UIContract[K] & { children?: ReactNode }>;
};

export interface MelonyUIContextValue {
  components: Partial<MelonyComponents>;
}

const MelonyUIContext = createContext<MelonyUIContextValue | null>(null);

export interface MelonyUIProviderProps {
  components: Partial<MelonyComponents>;
  children: ReactNode;
}

export function MelonyUIProvider({ components, children }: MelonyUIProviderProps) {
  return (
    <MelonyUIContext.Provider value={{ components }}>
      {children}
    </MelonyUIContext.Provider>
  );
}

export function useMelonyUI() {
  const context = useContext(MelonyUIContext);
  if (!context) {
    throw new Error("useMelonyUI must be used within a MelonyUIProvider");
  }
  return context;
}
