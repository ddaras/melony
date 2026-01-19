import React from "react";
import { UIContract } from "melony";
import { cn } from "@/lib/utils";
import { widthMap, radiusMap } from "@/lib/theme-utils";

export const Video: React.FC<UIContract["video"]> = ({
  src,
  poster,
  autoPlay = false,
  controls = true,
  loop = false,
  muted = false,
  aspectRatio = "16/9",
  width = "full",
  radius = "lg",
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
        "relative overflow-hidden bg-black shadow-sm",
        aspectRatios[aspectRatio] || "aspect-video",
        widthMap[width],
        radiusMap[radius]
      )}
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
