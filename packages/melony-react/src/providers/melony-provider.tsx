import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
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
  send: (event: Event, additionalBody?: Record<string, any>) => Promise<void>;
  reset: (events?: Event[]) => void;
  stop: () => void;
  client: MelonyClient;
  config?: Config;
  messages: AggregatedMessage[];
}

export const MelonyContext = createContext<MelonyContextValue | undefined>(
  undefined,
);

export type ClientHandler<TEvent extends Event = Event> = (
  event: TEvent,
  context: { client: MelonyClient<TEvent> }
) => void | Promise<void>;

export interface MelonyProviderProps {
  children: ReactNode;
  client: MelonyClient;
  initialEvents?: Event[];
  initialAdditionalBody?: Record<string, any>;
  aggregationOptions?: AggregateOptions;
  eventHandlers?: Record<string, ClientHandler>;
}

export const MelonyProvider: React.FC<MelonyProviderProps> = ({
  children,
  client,
  initialEvents,
  initialAdditionalBody,
  aggregationOptions,
  eventHandlers,
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

  const send = useCallback(async (event: Event, additionalBody?: Record<string, any>) => {
    const handler = eventHandlers?.[event.type];
    if (handler) {
      await handler(event, { client });
      return;
    }

    const generator = client.send(event, { ...initialAdditionalBody, ...additionalBody });
    // Consume the generator to ensure event processing completes
    for await (const _ of generator) {
      // Events are handled by the client subscription
    }
  }, [client, eventHandlers, initialAdditionalBody]);

  const reset = useCallback((events: Event[] = []) => {
    client.reset(events);
  }, [client]);

  const stop = useCallback(() => {
    client.stop();
  }, [client]);

  const contextValue = useMemo(
    () => ({
      ...state,
      messages,
      send,
      reset,
      stop,
      client,
    }),
    [state, messages, send, reset, stop, client],
  );

  return (
    <MelonyContext.Provider value={contextValue}>
      {children}
    </MelonyContext.Provider>
  );
};