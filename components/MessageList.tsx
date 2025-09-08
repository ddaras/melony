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

  return (
    <div
      data-ai-message-list=""
      className={className ?? "flex flex-col gap-3 p-4"}
    >
      {messages.map((m) => {
        const isUser = m.role === "user";
        const isAssistant = m.role === "assistant";
        const isSystem = m.role === "system";

        const baseBubble =
          "max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap";
        const userBubble =
          userBubbleClassName ??
          "self-end bg-blue-600 text-white";
        const assistantBubble =
          assistantBubbleClassName ??
          "self-start bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100";
        const systemBubble =
          systemBubbleClassName ??
          "self-center bg-yellow-50 text-yellow-900 border border-yellow-200";

        const bubbleClassName = isUser
          ? `${baseBubble} ${userBubble}`
          : isAssistant
          ? `${baseBubble} ${assistantBubble}`
          : `${baseBubble} ${systemBubble}`;

        return (
          <div key={m.id} data-role={m.role} data-type={(m as any).type}>
            <div className={bubbleClassName}>
              {typeof m.content === "string"
                ? m.content
                : "[rich content]"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
