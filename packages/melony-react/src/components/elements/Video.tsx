import React from "react";
import { VideoProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Video: React.FC<VideoProps> = ({
  src,
  poster,
  autoPlay = false,
  controls = true,
  loop = false,
  muted = false,
  aspectRatio = "16/9",
  width = "100%",
  className,
  style,
}) => {
  const aspectRatios = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
    "9/16": "aspect-[9/16]",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-black shadow-sm",
        aspectRatios[aspectRatio as keyof typeof aspectRatios] || "aspect-video",
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        ...style,
      }}
    >
      <video
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        controls={controls}
        loop={loop}
        muted={muted}
        playsInline
        className="h-full w-full object-cover"
      />
    </div>
  );
};
