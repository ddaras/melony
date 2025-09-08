import React, { useState } from "react";
import { useConversation } from "../hooks/useConversation";

export const MessageInput: React.FC<{ placeholder?: string }> = ({
  placeholder,
}) => {
  const [text, setText] = useState("");
  const { send } = useConversation();

  const handleSend = () => {
    if (!text) return;
    send({ role: "user", content: text });
    setText("");
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};
