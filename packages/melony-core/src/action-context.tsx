import React, { createContext, useContext, useCallback, useRef } from "react";
import { Action, ActionHandler } from "./types";

export type ActionListener = (action: Action) => void;

interface ActionContextValue {
  onAction?: ActionHandler;
  dispatch: (action: Action) => void;
  subscribe: (type: string, listener: ActionListener) => () => void;
}

const ActionContext = createContext<ActionContextValue | undefined>(undefined);

export const ActionProvider: React.FC<{
  children: React.ReactNode;
  onAction?: ActionHandler;
}> = ({ children, onAction }) => {
  const listenersRef = useRef<Map<string, Set<ActionListener>>>(new Map());

  const dispatch = useCallback(
    (action: Action) => {
      // Call the global onAction handler if provided
      if (onAction) {
        onAction(action);
      }

      // Call all listeners subscribed to this action type
      const listeners = listenersRef.current.get(action.type);
      if (listeners) {
        listeners.forEach((listener) => listener(action));
      }

      // Call wildcard listeners (listening to all actions)
      const wildcardListeners = listenersRef.current.get("*");
      if (wildcardListeners) {
        wildcardListeners.forEach((listener) => listener(action));
      }
    },
    [onAction]
  );

  const subscribe = useCallback((type: string, listener: ActionListener) => {
    if (!listenersRef.current.has(type)) {
      listenersRef.current.set(type, new Set());
    }
    listenersRef.current.get(type)!.add(listener);

    // Return unsubscribe function
    return () => {
      const listeners = listenersRef.current.get(type);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          listenersRef.current.delete(type);
        }
      }
    };
  }, []);

  return (
    <ActionContext.Provider value={{ onAction, dispatch, subscribe }}>
      {children}
    </ActionContext.Provider>
  );
};

export const useActionContext = () => {
  return useContext(ActionContext);
};
