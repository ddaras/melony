import { Surface, UIRenderer } from "@melony/react";
import type { Event } from "melony";

export const Inspector = () => {
  return (
    <Surface name="canvas">
      {(events) => {
        if (events.length === 0) {
          return (
            <div className="flex h-full items-center justify-center text-muted-foreground italic text-sm">
              No artifacts yet.
            </div>
          );
        }

        return (
          <div className="flex flex-col h-full overflow-y-auto p-4 gap-4">
            <h2 className="text-lg font-semibold border-b pb-2">Inspector</h2>
            <div className="flex flex-col gap-4">
              {events.map((event: Event, index: number) => (
                <div key={index}>
                  {event.ui && <UIRenderer node={event.ui} />}
                  {event.type === "text" && (
                    <div className="text-sm text-foreground">
                      {event.data?.content || event.data?.text}
                    </div>
                  )}
                  {!event.ui && event.type !== "text" && (
                    <div className="text-xs text-muted-foreground">
                      Event: {event.type}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </Surface>
  );
};
