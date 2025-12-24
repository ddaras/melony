import React, { useState } from "react";
import { ImageProps } from "./component-types";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  size = "sm",
  className,
  style,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const sizes = {
    sm: "h-11",
    md: "h-22",
    lg: "h-44",
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div
          className={cn("relative overflow-hidden rounded-md border cursor-pointer", className)}
          style={style}
        >
          <img
            src={src}
            alt={alt}
            onError={handleError}
            onLoad={handleLoad}
            className={cn(
              "block h-auto w-full transition-opacity duration-200 hover:opacity-90",
              isLoading ? "opacity-0" : "opacity-100",
              sizes[size as keyof typeof sizes]
            )}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse" />
          )}
        </div>
      </DialogTrigger>
      <DialogContent
        className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-center">
          <DialogClose className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </DialogClose>
          <img
            src={src}
            alt={alt || "Enlarged image"}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
