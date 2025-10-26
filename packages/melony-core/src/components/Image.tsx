import React, { useState, useMemo } from "react";
import { useTheme } from "../theme";
import { ImageProps } from "./component-types";
import { useContextValue } from "../context-provider";
import { TemplateEngine } from "../template-engine";

export const Image: React.FC<ImageProps> = ({ src, alt, size = "sm" }) => {
  const theme = useTheme();
  const context = useContextValue();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Process template variables in src and alt
  const processedSrc = useMemo(() => {
    return TemplateEngine.render(src, context || {});
  }, [src, context]);

  const processedAlt = useMemo(() => {
    return alt ? TemplateEngine.render(alt, context || {}) : "";
  }, [alt, context]);

  const resolvedRadius = size
    ? theme.radius?.[size as keyof typeof theme.radius] || size
    : undefined;

  const sizes = {
    sm: 44,
    md: 88,
    lg: 176,
  };

  const resolvedWidth = size
    ? sizes[size as keyof typeof sizes] || size
    : undefined;

  const resolvedHeight = size
    ? sizes[size as keyof typeof sizes] || size
    : undefined;

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const fallbackStyle = {
    width: resolvedWidth,
    height: resolvedHeight,
    border: `1px solid ${theme.colors?.border}`,
    borderRadius: resolvedRadius,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors?.muted || "#f8fafc",
    color: theme.colors?.mutedForeground || "#64748b",
    fontSize: theme.typography?.fontSize?.xs || "11px",
    textAlign: "center" as const,
    padding: "8px",
    boxSizing: "border-box" as const,
  };

  if (hasError) {
    return <div style={fallbackStyle} />;
  }

  return (
    <img
      src={processedSrc}
      alt={processedAlt}
      onError={handleError}
      onLoad={handleLoad}
      style={{
        width: resolvedWidth,
        height: resolvedHeight,
        border: `1px solid ${theme.colors?.border}`,
        borderRadius: resolvedRadius,
        display: "block",
        opacity: isLoading ? 0.7 : 1,
        transition: "opacity 0.2s ease-in-out",
      }}
    />
  );
};
