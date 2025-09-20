import { useAgent } from "./Agent";
import { Message } from "./Message";

type MessagesProps = {
  userBubbleClassName?: string;
  assistantBubbleClassName?: string;
  systemBubbleClassName?: string;
};

export function Messages({
  userBubbleClassName,
  assistantBubbleClassName,
  systemBubbleClassName,
}: MessagesProps) {
  const { messages } = useAgent();

  return (
    <>
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          userBubbleClassName={userBubbleClassName}
          assistantBubbleClassName={assistantBubbleClassName}
          systemBubbleClassName={systemBubbleClassName}
        />
      ))}
    </>
  );
}
