import { createContext, useContext } from "react";
import { WidgetTemplate } from "./widget-template";

export const WidgetsContext = createContext<WidgetTemplate[]>([]);

export const WidgetsProvider: React.FC<{
  children: React.ReactNode;
  widgets: WidgetTemplate[];
}> = ({ children, widgets }) => {
  return (
    <WidgetsContext.Provider value={widgets}>
      {children}
    </WidgetsContext.Provider>
  );
};

export const useWidgets = () => {
  return useContext(WidgetsContext);
};
