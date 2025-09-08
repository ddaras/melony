import { useConversation } from "../hooks/useConversation";

export function MessageList() {
  const { messages } = useConversation();

  return (
    <div data-ai-message-list="">
      {messages.map((m) => (
        <div key={m.id} data-role={m.role} data-type={(m as any).type}>
          <strong>{m.role}:</strong>{" "}
          {typeof m.content === "string" ? m.content : "[rich content]"}
        </div>
      ))}
    </div>
  );
}
