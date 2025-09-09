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
    send({ role: "user", parts: [{ type: "text", text }] });
    setText("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const defaultContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem", // gap-2
    padding: "0.5rem", // p-2
    border: "1px solid #e5e7eb", // border-gray-200
    borderRadius: "0.5rem", // rounded-lg
    width: "100%",
    maxWidth: "1200px",
    margin: " 0 auto",
  };

  const defaultInputStyle: React.CSSProperties = {
    flex: 1, // flex-1
    paddingLeft: "0.75rem", // px-3
    paddingRight: "0.75rem",
    paddingTop: "0.5rem", // py-2
    paddingBottom: "0.5rem",
    fontSize: "0.875rem", // text-sm
    outline: "none", // focus:outline-none
  };

  // Generate unique ID for this input instance
  const inputId = React.useId();

  const defaultButtonStyle: React.CSSProperties = {
    borderRadius: "0.5rem", // rounded-lg
    paddingLeft: "0.75rem", // px-3
    paddingRight: "0.75rem",
    paddingTop: "0.5rem", // py-2
    paddingBottom: "0.5rem",
    fontSize: "0.875rem", // text-sm
    fontWeight: "500", // font-medium
    border: "none",
    cursor: "pointer",
  };

  return (
    <div
      data-ai-message-input-container=""
      className={className}
      style={className ? undefined : defaultContainerStyle}
    >
      <input
        id={inputId}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputClassName}
        style={inputClassName ? undefined : defaultInputStyle}
      />
      <button
        onClick={handleSend}
        disabled={!text}
        className={buttonClassName}
        style={
          buttonClassName
            ? undefined
            : {
                ...defaultButtonStyle,
                opacity: !text ? 0.5 : 1, // disabled:opacity-50
              }
        }
      >
        Send
      </button>
    </div>
  );
};
