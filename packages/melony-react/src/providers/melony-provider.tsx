import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { Client, ClientState } from "@melony/core/client";
import { Event } from "@melony/core";
import { Message } from "@/types";
import { groupEventsToMessages } from "@/lib/utils";

export interface MelonyContextValue extends ClientState {
  messages: Message[];
  sendEvent: (
    event: Event,
    options?: { runId?: string; state?: Record<string, any> }
  ) => Promise<void>;
  clear: () => void;
  client: Client;
}

export const MelonyContext = createContext<MelonyContextValue | undefined>(
  undefined
);

export interface MelonyProviderProps {
  children: ReactNode;
  client: Client;
}

export const MelonyProvider: React.FC<MelonyProviderProps> = ({
  children,
  client,
}) => {
  const [state, setState] = useState<ClientState>(client.getState());

  useEffect(() => {
    setState(client.getState());
    return () => {
      client.subscribe(setState);
    };
  }, [client]);

  const sendEvent = useCallback(
    async (
      event: Event,
      options?: { runId?: string; state?: Record<string, any> }
    ) => {
      const generator = client.sendEvent(event, options);
      for await (const _ of generator) {
        // State updates automatically via subscription
      }
    },
    [client]
  );

  const clear = useCallback(() => client.clear(), [client]);

  const value = useMemo(
    () => ({
      ...state,
      messages: groupEventsToMessages(state.events),
      sendEvent,
      clear,
      client,
    }),
    [state, sendEvent, clear, client]
  );

  return (
    <MelonyContext.Provider value={value}>{children}</MelonyContext.Provider>
  );
};
