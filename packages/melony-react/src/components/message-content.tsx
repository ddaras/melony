import React from "react";
import { Event } from "melony";
import { UIRenderer } from "@/components/ui-renderer";

interface MessageContentProps {
  events: Event[];
}

export function MessageContent({ events }: MessageContentProps) {
  // Identify the latest index for each named slot in this message
  const latestSlotIndexes = new Map<string, number>();
  events.forEach((event, index) => {
    if (event.slot) {
      latestSlotIndexes.set(event.slot, index);
    }
  });

  return (
    <>
      {events.map((event, index) => {
        // "Latest Wins" Logic:
        // If this event has a slot but a newer event exists for that same slot, hide this one.
        if (event.slot && latestSlotIndexes.get(event.slot) !== index) {
          return null;
        }

        if (event.type === "text-delta") {
          return <span key={index}>{event.data?.delta}</span>;
        }
        if (event.type === "text") {
          return (
            <p key={index}>
              {event.data?.content || event.data?.text}
            </p>
          );
        }
        if (event.ui) {
          return <UIRenderer key={index} node={event.ui} />;
        }
        return null;
      })}
    </>
  );
}

