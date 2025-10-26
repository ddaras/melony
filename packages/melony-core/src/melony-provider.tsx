import React from "react";
import { ThemeProvider, MelonyTheme } from "./theme";
import { ActionProvider } from "./action-context";
import { WidgetsProvider } from "./widgets-context";
import { ActionHandler } from "./types";
import { WidgetTemplate } from "./widget-template";

export interface MelonyProviderProps {
  children: React.ReactNode;
  theme?: MelonyTheme;
  onAction?: ActionHandler;
  widgets?: WidgetTemplate[];
}

/**
 * MelonyProvider - Consolidates all Melony context providers
 * Use this to wrap any Melony components (MelonyMarkdown, MelonyWidget, or custom compositions)
 */
export const MelonyProvider: React.FC<MelonyProviderProps> = ({
  children,
  theme,
  onAction,
  widgets = [],
}) => {
  return (
    <ThemeProvider theme={theme}>
      <ActionProvider onAction={onAction}>
        <WidgetsProvider widgets={widgets}>{children}</WidgetsProvider>
      </ActionProvider>
    </ThemeProvider>
  );
};
