import React from "react";
import { Event, } from "melony";
import { MelonyRenderer } from "@melony/ui-kit";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface MessageContentProps {
  content: Event[];
}

export function MessageContent({ content }: MessageContentProps) {
  const elements: React.ReactNode[] = [];
  let currentTextBlock: string[] = [];

  const flushText = (key: number) => {
    if (currentTextBlock.length > 0) {
      elements.push(
        <div key={`text-${key}`} className="prose prose-sm dark:prose-invert max-w-none break-words [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>li]:mb-1 [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-2 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mb-2 [&>h3]:text-base [&>h3]:font-bold [&>h3]:mb-2 [&>pre]:bg-muted [&>pre]:p-2 [&>pre]:rounded [&>pre]:overflow-x-auto [&>pre]:mb-2 [&>code]:bg-muted [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:font-mono [&>code]:text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {currentTextBlock.join("")}
          </ReactMarkdown>
        </div>
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

  return <div className="flex flex-col space-y-2.5">{elements}</div>;
}
