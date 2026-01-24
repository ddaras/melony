import { useMemo } from "react";
import { Event, } from "melony";
import { MelonyRenderer } from "@melony/ui-kit";

interface MessageContentProps {
  text: string;
  uiEvents: Event[];
}

export function MessageContent({ text, uiEvents }: MessageContentProps) {
  return (
    <div className="flex flex-col space-y-4">
      {uiEvents.map((event, index) => {
        if (event.type === "ui") {
          return <MelonyRenderer key={index} node={event.data} />;
        }
        return null;
      })}

      {text && <p>{text}</p>}
    </div>
  );
}
