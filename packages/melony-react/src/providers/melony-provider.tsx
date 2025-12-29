import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { MelonyClient, ClientState } from "melony/client";
import { Config, Event } from "melony";
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
  config?: Config;
}

export const MelonyContext = createContext<MelonyContextValue | undefined>(
  undefined
);

export interface MelonyClientProviderProps {
  children: ReactNode;
  client: MelonyClient;
  initialEvents?: Event[];
  queryClient?: QueryClient;
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
  setContextValue: (value: MelonyContextValue) => void;
}

const MelonyContextProviderInner: React.FC<MelonyContextProviderInnerProps> = ({
  children,
  client,
  initialEvents,
  setContextValue,
}) => {
  const [state, setState] = useState<ClientState>(client.getState());

  const { data: config } = useQuery({
    queryKey: ["melony-config", client.url],
    queryFn: () => client.getConfig(),
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

  const reset = useCallback(
    (events?: Event[]) => client.reset(events),
    [client]
  );

  const dispatchClientAction = useCallback(
    async (event: Event) => {
      if (!event.type.startsWith("client:")) return false;

      switch (event.type) {
        case "client:navigate": {
          const url = event.data?.url;
          if (url) {
            window.history.pushState(null, "", url);
            window.dispatchEvent(new PopStateEvent("popstate"));
          }
          return true;
        }
        case "client:open-url": {
          const { url, target = "_blank" } = event.data || {};
          if (url) {
            window.open(url, target);
          }
          return true;
        }
        case "client:copy": {
          const { text } = event.data || {};
          if (text) {
            await navigator.clipboard.writeText(text);
          }
          return true;
        }
        case "client:reset": {
          reset([]);
          return true;
        }
        default:
          return false;
      }
    },
    [client, reset]
  );

  const sendEvent = useCallback(
    async (
      event: Event,
      options?: {
        runId?: string;
        state?: Record<string, any>;
      }
    ) => {
      const handled = await dispatchClientAction(event);
      if (handled) return;

      const generator = client.sendEvent(event, options);
      for await (const incomingEvent of generator) {
        // Also allow server to trigger client actions
        await dispatchClientAction(incomingEvent);
      }
    },
    [client, dispatchClientAction]
  );

  const value = useMemo(
    () => ({
      ...state,
      messages: groupEventsToMessages(state.events),
      sendEvent,
      reset,
      client,
      config: config as Config,
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
}) => {
  const [contextValue, setContextValue] = useState<
    MelonyContextValue | undefined
  >(undefined);

  return (
    <MelonyContext.Provider value={contextValue}>
      <QueryClientProvider client={queryClient}>
        <MelonyContextProviderInner
          client={client}
          initialEvents={initialEvents}
          setContextValue={setContextValue}
        >
          {children}
        </MelonyContextProviderInner>
      </QueryClientProvider>
    </MelonyContext.Provider>
  );
};
