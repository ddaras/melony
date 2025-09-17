import type { Message } from "../../core/types";
import { Avatar } from "./Avatar";
import { TextPart } from "./TextPart";
import { ReasoningPart } from "./ReasoningPart";
import { ToolPart } from "./ToolPart";

type MessageItemProps = {
  message: Message;
  userBubbleClassName?: string;
  assistantBubbleClassName?: string;
  systemBubbleClassName?: string;
};

export function MessageItem({
  message,
  userBubbleClassName,
  assistantBubbleClassName,
  systemBubbleClassName,
}: MessageItemProps) {
  const baseBubbleStyle: React.CSSProperties = {
    maxWidth: "90%", // max-w-[80%]
    flex: 1,
  };

  const getUserBubbleStyle = (): React.CSSProperties => ({
    ...baseBubbleStyle,
  });

  const getAssistantBubbleStyle = (): React.CSSProperties => ({
    ...baseBubbleStyle,
  });

  const getSystemBubbleStyle = (): React.CSSProperties => ({
    ...baseBubbleStyle,
    alignSelf: "center", // self-center
  });

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  let bubbleStyle: React.CSSProperties;
  let bubbleClassName: string | undefined;

  if (isUser) {
    bubbleStyle = userBubbleClassName ? {} : getUserBubbleStyle();
    bubbleClassName = userBubbleClassName;
  } else if (isAssistant) {
    bubbleStyle = assistantBubbleClassName ? {} : getAssistantBubbleStyle();
    bubbleClassName = assistantBubbleClassName;
  } else {
    bubbleStyle = systemBubbleClassName ? {} : getSystemBubbleStyle();
    bubbleClassName = systemBubbleClassName;
  }

  const userName = "You";
  const assistantName = "Assistant";

  // For user and assistant messages, use the new layout with avatars
  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem", // gap-3
    marginBottom: "1rem", // mb-4
    flexDirection: isUser ? "row-reverse" : "row",
  };

  const contentContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: isUser ? "flex-end" : "flex-start",
    maxWidth: "90%",
    flex: 1,
  };

  const nameStyle: React.CSSProperties = {
    fontSize: "0.75rem", // text-xs
    fontWeight: "500", // font-medium
    color: "#6b7280", // text-gray-500
    marginBottom: "0.25rem", // mb-1
  };

  return (
    <div
      id="message-item"
      key={message.id}
      data-role={message.role}
      data-type={(message as any).type}
      style={containerStyle}
    >
      <Avatar name={isUser ? userName : assistantName} isUser={isUser} />

      <div style={contentContainerStyle}>
        <div style={nameStyle}>{isUser ? userName : assistantName}</div>

        <div
          className={bubbleClassName}
          style={bubbleClassName ? undefined : bubbleStyle}
        >
          {message.parts.map((part, index) => {
            if (part.type === "text") {
              return <TextPart key={index} part={part} index={index} />;
            }

            if (part.type === "reasoning") {
              return <ReasoningPart key={index} part={part} index={index} />;
            }

            if (part.type === "tool") {
              return <ToolPart key={index} part={part} index={index} />;
            }
          })}
        </div>
      </div>
    </div>
  );
}
