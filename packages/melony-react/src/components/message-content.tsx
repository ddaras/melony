import React from "react";
import { Event } from "melony";
import { UIRenderer } from "@/components/ui-renderer";

interface MessageContentProps {
  events: Event[];
}

export function MessageContent({ events }: MessageContentProps) {
  // Identify the first and latest index for each named slot in this message
  const firstSlotIndexes = new Map<string, number>();
  const latestSlotIndexes = new Map<string, number>();

  events.forEach((event, index) => {
    if (event.slot) {
      if (!firstSlotIndexes.has(event.slot)) {
        firstSlotIndexes.set(event.slot, index);
      }
      latestSlotIndexes.set(event.slot, index);
    }
  });

  return (
    <>
      {events.map((event, index) => {
        let displayEvent = event;

        if (event.slot) {
          // If this is NOT the first occurrence of this slot, hide it.
          if (firstSlotIndexes.get(event.slot) !== index) {
            return null;
          }
          // If this IS the first occurrence, show the LATEST version.
          const latestIndex = latestSlotIndexes.get(event.slot)!;
          displayEvent = events[latestIndex];
        }

        if (displayEvent.type === "text-delta") {
          return <span key={index}>{displayEvent.data?.delta}</span>;
        }
        if (displayEvent.type === "text") {
          return (
            <p key={index}>
              {displayEvent.data?.content || displayEvent.data?.text}
            </p>
          );
        }
        if (displayEvent.ui) {
          return <UIRenderer key={index} node={displayEvent.ui} />;
        }
        return null;
      })}
    </>
  );
}

