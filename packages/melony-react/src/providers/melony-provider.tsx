import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { MelonyClient, ClientState } from "melony/client";
import {
  Config,
  Event,
} from "melony";
import { 
  AggregatedMessage, 
  AggregateOptions, 
  convertEventsToAggregatedMessages 
} from "../utils/message-converter";

export interface MelonyContextValue extends ClientState {
  sendEvent: (event: Event) => Promise<void>;
  reset: (events?: Event[]) => void;
  client: MelonyClient;
  config?: Config;
  messages: AggregatedMessage[];
}

export const MelonyContext = createContext<MelonyContextValue | undefined>(
  undefined,
);

export interface MelonyProviderProps {
  children: ReactNode;
  client: MelonyClient;
  initialEvents?: Event[];
  aggregationOptions?: AggregateOptions;
}

export const MelonyProvider: React.FC<MelonyProviderProps> = ({
  children,
  client,
  initialEvents,
  aggregationOptions,
}) => {
  const [state, setState] = useState<ClientState>(client.getState());

  // Handle initial events on mount only
  useEffect(() => {
    if (initialEvents?.length && client.getState().events.length === 0) {
      client.reset(initialEvents);
    }
  }, []); // Empty deps - run once on mount

  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = client.subscribe(setState);
    return unsubscribe;
  }, [client]);

  const messages = useMemo(
    () => convertEventsToAggregatedMessages(state.events, aggregationOptions),
    [state.events, aggregationOptions]
  );

  const contextValue = useMemo(
    () => ({
      ...state,
      messages,
      sendEvent: async (event: Event) => {
        const generator = client.sendEvent(event);
        // Consume the generator to ensure event processing completes
        for await (const _ of generator) {
          // Events are handled by the client subscription
        }
      },
      reset: client.reset.bind(client),
      client,
    }),
    [state, messages, client],
  );

  return (
    <MelonyContext.Provider value={contextValue}>
      {children}
    </MelonyContext.Provider>
  );
};