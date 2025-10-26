import { createContext, useContext } from "react";

const Context = createContext<Record<string, any>>({});

export const ContextProvider: React.FC<{
  children: React.ReactNode;
  context: Record<string, any>;
}> = ({ children, context }) => {
  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useContextValue = () => {
  const context = useContext(Context);
  return context || {};
};
