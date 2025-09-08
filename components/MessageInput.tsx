import React, { useState } from "react";
import { useConversation } from "../hooks/useConversation";

type MessageInputProps = {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
};

export const MessageInput: React.FC<MessageInputProps> = ({
  placeholder,
  className,
  inputClassName,
  buttonClassName,
}) => {
  const [text, setText] = useState("");
  const { send } = useConversation();

  const handleSend = () => {
    if (!text) return;
    send({ role: "user", content: text });
    setText("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      data-ai-message-input-container=""
      className={
        className ??
        "flex items-center gap-2 border-t border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900"
      }
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={
          inputClassName ??
          "flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        }
      />
      <button
        onClick={handleSend}
        disabled={!text}
        className={
          buttonClassName ??
          "rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        }
      >
        Send
      </button>
    </div>
  );
};
