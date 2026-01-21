import { useState, useEffect } from "react";

export interface ScreenSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Hook to detect screen size and breakpoints
 * @param mobileBreakpoint - Breakpoint for mobile (default: 768px, Tailwind's md)
 * @param tabletBreakpoint - Breakpoint for tablet (default: 1024px, Tailwind's lg)
 */
export function useScreenSize(
  mobileBreakpoint: number = 768,
  tabletBreakpoint: number = 1024,
): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>(() => {
    // SSR-safe default
    if (typeof window === "undefined") {
      return {
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      };
    }

    const width = window.innerWidth;
    return {
      width,
      height: window.innerHeight,
      isMobile: width < mobileBreakpoint,
      isTablet: width >= mobileBreakpoint && width < tabletBreakpoint,
      isDesktop: width >= tabletBreakpoint,
    };
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({
        width,
        height,
        isMobile: width < mobileBreakpoint,
        isTablet: width >= mobileBreakpoint && width < tabletBreakpoint,
        isDesktop: width >= tabletBreakpoint,
      });
    };

    // Set initial size
    updateScreenSize();

    // Listen for resize events
    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, [mobileBreakpoint, tabletBreakpoint]);

  return screenSize;
}
