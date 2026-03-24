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
} from "melony";
import {
  AggregatedMessage,
  AggregateOptions,
  convertEventsToAggregatedMessages
} from "../utils/message-converter";

export interface MelonyContextValue<TEvent = any> extends ClientState<TEvent> {
  send: (event: TEvent, additionalBody?: Record<string, any>) => Promise<void>;
  reset: (events?: TEvent[]) => void;
  stop: () => void;
  client: MelonyClient<TEvent>;
  config?: Config<any, TEvent>;
  messages: AggregatedMessage[];
}

export const MelonyContext = createContext<MelonyContextValue<any> | undefined>(
  undefined,
);

export type ClientHandler<TEvent = any> = (
  event: TEvent,
  context: { client: MelonyClient<TEvent> }
) => void | Promise<void>;

export interface MelonyProviderProps<TEvent = any> {
  children: ReactNode;
  client: MelonyClient<TEvent>;
  initialEvents?: TEvent[];
  initialAdditionalBody?: Record<string, any>;
  aggregationOptions?: AggregateOptions;
  handlers?: Record<string, ClientHandler<TEvent>>;
}

export const MelonyProvider: React.FC<MelonyProviderProps<any>> = ({
  children,
  client,
  initialEvents,
  initialAdditionalBody,
  aggregationOptions,
  handlers,
}) => {
  const [state, setState] = useState<ClientState<any>>(client.getState());

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

  const send = useCallback(async (event: any, additionalBody?: Record<string, any>) => {
    const eventKey = (client as any).eventKey || "type";
    const handler = handlers?.[(event as any)[eventKey]];
    if (handler) {
      await handler(event, { client });
      return;
    }

    const generator = client.send(event, { ...initialAdditionalBody, ...additionalBody });
    // Consume the generator to ensure event processing completes
    for await (const _ of generator) {
      // Events are handled by the client subscription
    }
  }, [client, handlers, initialAdditionalBody]);

  const reset = useCallback((events: any[] = []) => {
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