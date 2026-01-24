import React from "react";
import { Event, } from "melony";
import { MelonyRenderer } from "@melony/ui-kit";

interface MessageContentProps {
  content: Event[];
}

export function MessageContent({ content }: MessageContentProps) {
  const elements: React.ReactNode[] = [];
  let currentTextBlock: string[] = [];

  const flushText = (key: number) => {
    if (currentTextBlock.length > 0) {
      elements.push(
        <p key={`text-${key}`} className="whitespace-pre-wrap">
          {currentTextBlock.join("")}
        </p>
      );
      currentTextBlock = [];
    }
  };

  content.forEach((event, index) => {
    const key = event.id || index;
    if (event.type === "ui") {
      flushText(index);
      elements.push(<MelonyRenderer key={key} node={event.data} />);
    } else if (event.type === "assistant:text-delta") {
      currentTextBlock.push(event.data.delta || "");
    } else if (event.type === "assistant:text" || event.type === "user:text") {
      const text = event.data.content || event.data.text || "";
      if (text) {
        currentTextBlock.push(text);
      }
    }
  });
  flushText(content.length);

  return <div className="flex flex-col space-y-4">{elements}</div>;
}
