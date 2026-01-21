import { useMemo } from "react";
import { Event, } from "melony";
import { UIRenderer } from "@/components/ui-renderer";
import { filterEventsBySlots } from "@/lib/filter-slots";

interface MessageContentProps {
  text: string;
  uiEvents: Event[];
}

export function MessageContent({ text, uiEvents }: MessageContentProps) {
  const displayUIEvents = useMemo(() => filterEventsBySlots(uiEvents), [uiEvents]);

  return (
    <>
      {displayUIEvents.map((displayEvent, index) => {
        if (displayEvent.type === "ui") {
          return <UIRenderer key={index} node={displayEvent.data} />;
        }
        return null;
      })}
      {text && <p>{text}</p>}
    </>
  );
}
