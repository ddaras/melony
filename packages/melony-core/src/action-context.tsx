import React, { createContext, useContext } from "react";
import { ActionDefinition, ActionHandler } from "./types";

const ActionContext = createContext<ActionHandler | undefined>(undefined);

export const ActionProvider: React.FC<{
  children: React.ReactNode;
  onAction?: ActionHandler;
}> = ({ children, onAction }) => {
  return (
    <ActionContext.Provider value={onAction}>{children}</ActionContext.Provider>
  );
};

export const useAction = () => {
  return useContext(ActionContext);
};

// Helper to handle action execution
export const useActionHandler = () => {
  const onAction = useAction();

  const handleAction = (actionDef?: ActionDefinition) => {
    if (!onAction || !actionDef) return;
    onAction(actionDef.action, actionDef.payload);
  };

  return handleAction;
};
