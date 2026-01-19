import React, { useMemo } from "react";
import { Event, filterEventsBySlots } from "melony";
import { UIRenderer } from "@/components/ui-renderer";

interface MessageContentProps {
  events: Event[];
}

export function MessageContent({ events }: MessageContentProps) {
  const displayEvents = useMemo(() => filterEventsBySlots(events), [events]);

  return (
    <>
      {displayEvents.map((displayEvent, index) => {
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

