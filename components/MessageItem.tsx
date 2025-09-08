import { ToolResponse } from "./ToolResponse";
import { Thinking } from "./Thinking";
import type { Message } from "../core/messages";

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
    maxWidth: "80%", // max-w-[80%]
    borderRadius: "0.5rem", // rounded-lg
    paddingLeft: "0.75rem", // px-3
    paddingRight: "0.75rem",
    paddingTop: "0.5rem", // py-2
    paddingBottom: "0.5rem",
    fontSize: "0.875rem", // text-sm
    whiteSpace: "pre-wrap", // whitespace-pre-wrap
  };

  const getUserBubbleStyle = (): React.CSSProperties => ({
    ...baseBubbleStyle,
    alignSelf: "flex-end", // self-end
    backgroundColor: "#2563eb", // bg-blue-600
    color: "#ffffff", // text-white
  });

  const getAssistantBubbleStyle = (): React.CSSProperties => ({
    ...baseBubbleStyle,
    alignSelf: "flex-start", // self-start
    backgroundColor: "#f3f4f6", // bg-gray-100
    color: "#111827", // text-gray-900
  });

  const getSystemBubbleStyle = (): React.CSSProperties => ({
    ...baseBubbleStyle,
    alignSelf: "center", // self-center
    backgroundColor: "#fffbeb", // bg-yellow-50
    color: "#78350f", // text-yellow-900
    border: "1px solid #fed7aa", // border border-yellow-200
  });

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

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

  return (
    <div
      key={message.id}
      data-role={message.role}
      data-type={(message as any).type}
    >
      <div
        className={bubbleClassName}
        style={bubbleClassName ? undefined : bubbleStyle}
      >
        {message.parts.map((part, index) => {
          if (part.type === "text") {
            return <p key={index}>{part.text}</p>;
          }

          if (part.type === "thinking") {
            return (
              <Thinking
                key={index}
                text={part.text}
                isStreaming={
                  message.streamingState?.isStreaming &&
                  message.streamingState?.currentStep === "thinking"
                }
              />
            );
          }

          if (part.type === "tool") {
            return <ToolResponse key={index} parts={[part]} />;
          }
        })}
      </div>

      {message.streamingState?.isStreaming && <>...</>}
    </div>
  );
}
