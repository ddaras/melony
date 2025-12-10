import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import {
  MelonyRuntimeClient,
  MelonyRuntimeClientOptions,
  MelonyRuntimeClientState,
} from "@melony/client";
import { MelonyMessage } from "@melony/core/browser"; // Runtime client uses browser core exports

export interface MelonyContextValue extends MelonyRuntimeClientState {
  sendMessage: (message: MelonyMessage) => Promise<void>;
  clear: () => void;
  client: MelonyRuntimeClient;
}

const MelonyContext = createContext<MelonyContextValue | undefined>(undefined);

export interface MelonyProviderProps extends MelonyRuntimeClientOptions {
  children: ReactNode;
  client?: MelonyRuntimeClient;
}

export const MelonyProvider: React.FC<MelonyProviderProps> = ({
  children,
  client: providedClient,
  ...options
}) => {
  // Initialize client
  const client = useMemo(() => {
    return providedClient || new MelonyRuntimeClient(options);
  }, [providedClient, options.transport, options.threadId]); // Be careful with options dependency stability

  // State to sync with client
  const [state, setState] = useState<MelonyRuntimeClientState>(
    client.getState()
  );

  // Subscribe to client updates
  useEffect(() => {
    // Sync initial state in case it changed before effect ran
    setState(client.getState());

    const unsubscribe = client.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, [client]);

  // Wrapper to consume the generator
  const sendMessage = useCallback(
    async (message: MelonyMessage) => {
      const generator = client.sendMessage(message);
      // Consume the generator to ensure it executes and updates state
      for await (const _ of generator) {
        // We can ignore the events here because the client updates its state,
        // which triggers our subscription.
      }
    },
    [client]
  );

  const clear = useCallback(() => {
    client.clear();
  }, [client]);

  const value = useMemo(
    () => ({
      ...state,
      sendMessage,
      clear,
      client,
    }),
    [state, sendMessage, clear, client]
  );

  return (
    <MelonyContext.Provider value={value}>{children}</MelonyContext.Provider>
  );
};

export const useMelony = (): MelonyContextValue => {
  const context = useContext(MelonyContext);
  if (context === undefined) {
    throw new Error("useMelony must be used within a MelonyProvider");
  }
  return context;
};
