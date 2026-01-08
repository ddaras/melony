import React, { useState, useRef, useEffect } from "react";
import { ImageProps } from "./component-types";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  size = "sm",
  groupId,
  className,
  style,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Navigation State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gallery, setGallery] = useState<{ src: string; alt: string }[]>([]);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Scan siblings only when the dialog opens
  useEffect(() => {
    if (open && triggerRef.current) {
      // 1. Find the parent container (the Row or Col)
      // We climb up until we find a parent that has more than one child
      // (this is our 'group')
      let parent = triggerRef.current.parentElement;
      while (
        parent &&
        parent.parentElement &&
        parent.parentElement.children.length === 1
      ) {
        parent = parent.parentElement;
      }
      const container = parent?.parentElement;

      if (container) {
        // 2. Find all images in that same container
        const foundImgs = Array.from(container.querySelectorAll("img"))
          .map((img) => ({
            src: img.getAttribute("src") || "",
            alt: img.getAttribute("alt") || "",
          }))
          // Deduplicate based on src
          .filter((v, i, a) => a.findIndex((t) => t.src === v.src) === i);

        setGallery(foundImgs);

        // 3. Set the starting index to this image
        const idx = foundImgs.findIndex((img) => img.src === src);
        setCurrentIndex(idx >= 0 ? idx : 0);
      }
    }
  }, [open, src]);

  const navigate = (dir: number) => {
    setCurrentIndex((prev) => (prev + dir + gallery.length) % gallery.length);
  };

  const currentImage = gallery[currentIndex] || { src, alt };
  const hasMultiple = gallery.length > 1;

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
          ref={triggerRef}
          className={cn(
            "relative overflow-hidden rounded-md border cursor-pointer",
            className
          )}
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
        className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none shadow-none outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-center group/lightbox">
          <DialogClose className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-50 bg-black/50 rounded-full p-2">
            <IconX size={20} />
          </DialogClose>

          {/* Navigation Arrows */}
          {hasMultiple && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(-1);
                }}
                className="absolute left-4 z-50 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all opacity-0 group-hover/lightbox:opacity-100"
              >
                <IconChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(1);
                }}
                className="absolute right-4 z-50 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all opacity-0 group-hover/lightbox:opacity-100"
              >
                <IconChevronRight size={28} />
              </button>
            </>
          )}

          <img
            src={currentImage.src}
            alt={currentImage.alt || alt || "Enlarged image"}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />

          {hasMultiple && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm font-medium">
              {currentIndex + 1} / {gallery.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
