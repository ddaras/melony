import React, { useState } from "react";
import { ImageProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Image: React.FC<ImageProps> = ({ 
  src, 
  alt, 
  size = "sm",
  className,
  style 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sizes = {
    sm: "h-11 w-11",
    md: "h-22 w-22",
    lg: "h-44 w-44",
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center rounded-md border bg-muted text-muted-foreground",
          sizes[size as keyof typeof sizes] || "h-11 w-11",
          className
        )}
        style={style}
      >
        <span className="text-[10px]">Error</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-md border", className)} style={style}>
      <img
        src={src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          "block h-auto w-full transition-opacity duration-200",
          isLoading ? "opacity-0" : "opacity-100",
          sizes[size as keyof typeof sizes]
        )}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse" />
      )}
    </div>
  );
};
