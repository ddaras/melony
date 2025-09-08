import { useConversation } from "../hooks/useConversation";

type MessageListProps = {
  className?: string;
  userBubbleClassName?: string;
  assistantBubbleClassName?: string;
  systemBubbleClassName?: string;
};

export function MessageList({
  className,
  userBubbleClassName,
  assistantBubbleClassName,
  systemBubbleClassName,
}: MessageListProps) {
  const { messages } = useConversation();

  const defaultContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem", // gap-3
    padding: "1rem", // p-4
  };

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

  return (
    <div
      data-ai-message-list=""
      className={className}
      style={className ? undefined : defaultContainerStyle}
    >
      {messages.map((m) => {
        const isUser = m.role === "user";
        const isAssistant = m.role === "assistant";
        // const isSystem = m.role === "system";

        let bubbleStyle: React.CSSProperties;
        let bubbleClassName: string | undefined;

        if (isUser) {
          bubbleStyle = userBubbleClassName ? {} : getUserBubbleStyle();
          bubbleClassName = userBubbleClassName;
        } else if (isAssistant) {
          bubbleStyle = assistantBubbleClassName
            ? {}
            : getAssistantBubbleStyle();
          bubbleClassName = assistantBubbleClassName;
        } else {
          bubbleStyle = systemBubbleClassName ? {} : getSystemBubbleStyle();
          bubbleClassName = systemBubbleClassName;
        }

        return (
          <div key={m.id} data-role={m.role} data-type={(m as any).type}>
            <div
              className={bubbleClassName}
              style={bubbleClassName ? undefined : bubbleStyle}
            >
              {m.parts.map((p, index) => {
                if (p.type === "text") {
                  return <p key={index}>{p.text}</p>;
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
