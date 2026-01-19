import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useScreenSize } from "@/hooks/use-screen-size";

export interface SidebarContextValue {
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  setLeftCollapsed: (collapsed: boolean) => void;
  setRightCollapsed: (collapsed: boolean) => void;
  leftCollapsible: boolean;
  rightCollapsible: boolean;
}

export const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined,
);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export interface SidebarProviderProps {
  children: React.ReactNode;
  defaultLeftCollapsed?: boolean;
  defaultRightCollapsed?: boolean;
}

export function SidebarProvider({
  children,
  defaultLeftCollapsed,
  defaultRightCollapsed,
}: SidebarProviderProps) {
  const { isMobile, isTablet } = useScreenSize();
  const isSmallScreen = isMobile || isTablet;

  // Internal state for uncontrolled mode
  const [leftCollapsed, setLeftCollapsed] = useState(() => {
    if (defaultLeftCollapsed !== undefined) return defaultLeftCollapsed;
    // Initialize collapsed on small screens
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024;
    }
    return false;
  });

  const [rightCollapsed, setRightCollapsed] = useState(() => {
    if (defaultRightCollapsed !== undefined) return defaultRightCollapsed;
    // Initialize collapsed on small screens
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024;
    }
    return false;
  });

  // Auto-collapse sidebars when transitioning to mobile/tablet devices
  useEffect(() => {
    if (isSmallScreen) {
      setLeftCollapsed(true);
      setRightCollapsed(true);
    }
  }, [isSmallScreen]);

  const handleLeftToggle = useCallback((collapsed: boolean) => {
    setLeftCollapsed(collapsed);
  }, []);

  const handleRightToggle = useCallback((collapsed: boolean) => {
    setRightCollapsed(collapsed);
  }, []);

  const contextValue = useMemo(
    () => ({
      leftCollapsed,
      rightCollapsed,
      setLeftCollapsed: handleLeftToggle,
      setRightCollapsed: handleRightToggle,
      leftCollapsible: true,
      rightCollapsible: true,
    }),
    [leftCollapsed, rightCollapsed, handleLeftToggle, handleRightToggle],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
}
