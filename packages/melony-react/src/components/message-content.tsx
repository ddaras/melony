import React from "react";
import { Event } from "@melony/core";
import { UIRenderer } from "@/components/ui-renderer";

interface MessageContentProps {
  events: Event[];
}

export function MessageContent({ events }: MessageContentProps) {
  return (
    <>
      {events.map((event, index) => {
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

