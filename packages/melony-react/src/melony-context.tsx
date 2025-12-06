import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { MelonyTheme, ThemeProvider } from "./theme";
import { WidgetRegistry, WidgetDefinition } from "@melony/client";
import { Action, MelonyEvent } from "@melony/core";

type EventHandler = (evt: MelonyEvent) => void;

interface MelonyContextType {
  widgetRegistry: WidgetRegistry;
  dispatchEvent: (evt: MelonyEvent) => void;
  addEventHandler: (listener: EventHandler) => () => void;
}

export const MelonyContext = createContext<MelonyContextType | null>(null);

export interface MelonyProviderProps {
  children: React.ReactNode;
  widgets?: WidgetDefinition[];
  theme?: Partial<MelonyTheme>;
  onEvent?: (event: MelonyEvent) => void;
}

export function MelonyProvider({
  children,
  widgets = [],
  theme,
  onEvent,
}: MelonyProviderProps) {
  const widgetRegistry = useMemo(() => {
    const registry = new WidgetRegistry();
    registry.registerMany(widgets);
    return registry;
  }, [widgets]);

  const listenersRef = useRef<Set<EventHandler>>(new Set());

  const dispatchEvent = useCallback(
    (evt: MelonyEvent) => {
      // Call the onAction prop if provided
      if (onEvent) {
        onEvent(evt);
      } else {
        console.log("Event:", evt);
      }

      // Notify all registered listeners
      listenersRef.current.forEach((listener) => {
        listener(evt);
      });
    },
    [onEvent]
  );

  const addEventHandler = useCallback((listener: EventHandler) => {
    listenersRef.current.add(listener);
    // Return unsubscribe function
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const contextValue = useMemo(
    () => ({ widgetRegistry, dispatchEvent, addEventHandler }),
    [widgetRegistry, dispatchEvent, addEventHandler]
  );

  return (
    <MelonyContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MelonyContext.Provider>
  );
}

export function useMelony() {
  const context = useContext(MelonyContext);
  if (!context) {
    throw new Error("useMelony must be used within MelonyProvider");
  }
  return {
    widgets: context.widgetRegistry.getAll(),
    widgetRegistry: context.widgetRegistry,
    dispatchEvent: context.dispatchEvent,
  };
}

/**
 * Hook to listen to dispatched actions
 * @param callback - Function to call when an action is dispatched
 * @param deps - Optional dependency array for the callback
 */
export function useDispatchedEvent(
  callback: (evt: MelonyEvent) => void,
  deps?: React.DependencyList
) {
  const context = useContext(MelonyContext);
  const callbackRef = React.useRef(callback);

  // Keep callback ref up to date
  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!context) {
      console.warn("useDispatchedAction must be used within MelonyProvider");
      return;
    }

    // Create a stable listener that always calls the latest callback
    const listener = (evt: MelonyEvent) => {
      callbackRef.current(evt);
    };

    // Subscribe to actions
    const unsubscribe = context.addEventHandler(listener);

    // Cleanup on unmount or deps change
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, ...(deps || [])]);
}
