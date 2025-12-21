import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { MelonyClient, ClientState } from "melony/client";
import { Event } from "melony";
import { Message } from "@/types";
import { groupEventsToMessages } from "@/lib/utils";

export interface MelonyContextValue extends ClientState {
  messages: Message[];
  sendEvent: (
    event: Event,
    options?: { runId?: string; state?: Record<string, any> }
  ) => Promise<void>;
  reset: (events?: Event[]) => void;
  client: MelonyClient;
}

export const MelonyContext = createContext<MelonyContextValue | undefined>(
  undefined
);

export interface MelonyClientProviderProps {
  children: ReactNode;
  client: MelonyClient;
  initialEvents?: Event[];
}

export const MelonyClientProvider: React.FC<MelonyClientProviderProps> = ({
  children,
  client,
  initialEvents,
}) => {
  const [state, setState] = useState<ClientState>(client.getState());

  useEffect(() => {
    if (
      initialEvents &&
      initialEvents.length > 0 &&
      client.getState().events.length === 0
    ) {
      client.reset(initialEvents);
    }
  }, [client, initialEvents]);

  useEffect(() => {
    setState(client.getState());
    const unsubscribe = client.subscribe(setState);
    return () => {
      unsubscribe();
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

  const reset = useCallback(
    (events?: Event[]) => client.reset(events),
    [client]
  );

  const value = useMemo(
    () => ({
      ...state,
      messages: groupEventsToMessages(state.events),
      sendEvent,
      reset,
      client,
    }),
    [state, sendEvent, reset, client]
  );

  return (
    <MelonyContext.Provider value={value}>{children}</MelonyContext.Provider>
  );
};
