"use client";

import { vstack, text, hstack } from "melony";
import { BaseWidget } from "./widgets/base-widget";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ImageGalleryWidgetProps {
  title: string;
  description: string;
  images: {
    src: string;
    alt: string;
  }[];
  onRemove?: () => void;
  onSettings?: () => void;
}

export function ImageGalleryWidget({
  title,
  description,
  images,
  onRemove,
  onSettings,
}: ImageGalleryWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <BaseWidget
      id="image-gallery-widget"
      onRemove={onRemove}
      onSettings={onSettings}
    >
      {vstack({
        className: "w-full gap-4",
        children: [
          hstack({
            className: "w-full justify-between items-center",
            children: [
              text({
                className: "font-bold text-xl",
                content: title,
              }),
              <button
                key="toggle"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-muted/20 rounded-sm transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>,
            ],
          }),
          text({
            className: "text-sm opacity-50",
            content: description,
          }),
          isExpanded && (
            <div key="gallery" className="grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ),
        ],
      })}
    </BaseWidget>
  );
}
