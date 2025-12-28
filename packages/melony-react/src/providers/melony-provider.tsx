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
import { groupEventsToMessages } from "@/lib/group-events-to-messages";
import { NuqsAdapter } from "nuqs/adapters/react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

export interface MelonyContextValue extends ClientState {
  messages: Message[];
  sendEvent: (
    event: Event,
    options?: { runId?: string; state?: Record<string, any> }
  ) => Promise<void>;
  reset: (events?: Event[]) => void;
  client: MelonyClient;
  config?: {
    starterPrompts: any[];
    options: any[];
  };
}

export const MelonyContext = createContext<MelonyContextValue | undefined>(
  undefined
);

export interface MelonyClientProviderProps {
  children: ReactNode;
  client: MelonyClient;
  initialEvents?: Event[];
  queryClient?: QueryClient;
  configApi?: string;
}

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

interface MelonyContextProviderInnerProps {
  children: ReactNode;
  client: MelonyClient;
  initialEvents?: Event[];
  configApi?: string;
  setContextValue: (value: MelonyContextValue) => void;
}

const MelonyContextProviderInner: React.FC<MelonyContextProviderInnerProps> = ({
  children,
  client,
  initialEvents,
  configApi,
  setContextValue,
}) => {
  const [state, setState] = useState<ClientState>(client.getState());

  const { data: config } = useQuery({
    queryKey: ["melony-config", configApi],
    queryFn: () => client.getConfig(configApi),
    enabled: !!configApi,
    staleTime: Infinity,
  });

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
      options?: {
        runId?: string;
        state?: Record<string, any>;
      }
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
      config,
    }),
    [state, sendEvent, reset, client, config]
  );

  useEffect(() => {
    setContextValue(value);
  }, [value, setContextValue]);

  return <NuqsAdapter>{children}</NuqsAdapter>;
};

export const MelonyClientProvider: React.FC<MelonyClientProviderProps> = ({
  children,
  client,
  initialEvents,
  queryClient = defaultQueryClient,
  configApi,
}) => {
  const [contextValue, setContextValue] = useState<MelonyContextValue | undefined>(undefined);

  return (
    <MelonyContext.Provider value={contextValue}>
      <QueryClientProvider client={queryClient}>
        <MelonyContextProviderInner
          client={client}
          initialEvents={initialEvents}
          configApi={configApi}
          setContextValue={setContextValue}
        >
          {children}
        </MelonyContextProviderInner>
      </QueryClientProvider>
    </MelonyContext.Provider>
  );
};
