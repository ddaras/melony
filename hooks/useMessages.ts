import { useConversation } from "../hooks/useConversation";
import { Message } from "../core/messages";

/**
 * useMessages
 * Returns the full message stream and helper methods
 */
export const useMessages = () => {
  const { messages, send } = useConversation();

  // Optionally, you can add helper methods here
  const lastMessage: Message | null = messages[messages.length - 1] ?? null;
  const filterByRole = (role: Message["role"]) =>
    messages.filter((msg) => msg.role === role);

  return {
    messages,
    lastMessage,
    filterByRole,
    send,
  };
};
