import React, { useMemo } from "react";
import { UIContract } from "@melony/ui-kit";
import { cn } from "../lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useMelony } from "@melony/react";
import {
  textSizeMap,
  textAlignMap,
  fontWeightMap,
  colorTextMap,
} from "../lib/theme-utils";

export const StreamingText: React.FC<UIContract["streamingText"]> = ({
  eventType,
  size = "md",
  weight = "normal",
  align = "start",
  color = "foreground",
  markdown = true,
}) => {
  const { events } = useMelony();

  const text = useMemo(() => {
    return events
      .filter((e) => e.type === eventType)
      .map((e) => e.data?.delta || e.data?.text || e.data?.content || "")
      .filter(Boolean)
      .join("");
  }, [events, eventType]);

  if (!text) return null;

  if (markdown) {
    return (
      <div
        className={cn(
          "prose prose-sm dark:prose-invert max-w-none break-words [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>li]:mb-1 [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-2 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mb-2 [&>h3]:text-base [&>h3]:font-bold [&>h3]:mb-2 [&>pre]:bg-muted [&>pre]:p-2 [&>pre]:rounded [&>pre]:overflow-x-auto [&>pre]:mb-2 [&>code]:bg-muted [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:font-mono [&>code]:text-sm",
          textAlignMap[align],
          colorTextMap[color],
        )}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {text}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <span
      className={cn(
        textSizeMap[size],
        fontWeightMap[weight],
        textAlignMap[align],
        colorTextMap[color],
      )}
    >
      {text}
    </span>
  );
};
