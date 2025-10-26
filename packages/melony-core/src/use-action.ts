import { useEffect } from "react";
import { ActionListener, useActionContext } from "./action-context";
import { Action } from "./types";

export const useAction = (
  actionType: string,
  handler: (payload?: any, action?: Action) => void,
  deps: React.DependencyList = []
) => {
  const context = useActionContext();
  if (!context) {
    throw new Error("useAction must be used within an ActionProvider");
  }

  const { subscribe } = context;

  useEffect(() => {
    const listener: ActionListener = (action) => {
      handler(action.payload, action);
    };

    const unsubscribe = subscribe(actionType, listener);
    return unsubscribe;
  }, [actionType, subscribe, ...deps]);
};

/**
 * Hook to dispatch actions programmatically
 */
export const useActionDispatch = () => {
  const context = useActionContext();
  if (!context) {
    throw new Error("useActionDispatch must be used within an ActionProvider");
  }
  return context.dispatch;
};
