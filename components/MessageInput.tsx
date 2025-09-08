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
    borderTop: "1px solid #e5e7eb", // border-t border-gray-200
    backgroundColor: "#ffffff", // bg-white
    padding: "0.5rem", // p-2
  };

  const defaultInputStyle: React.CSSProperties = {
    flex: 1, // flex-1
    borderRadius: "0.375rem", // rounded-md
    border: "1px solid #d1d5db", // border border-gray-300
    backgroundColor: "#ffffff", // bg-white
    paddingLeft: "0.75rem", // px-3
    paddingRight: "0.75rem",
    paddingTop: "0.5rem", // py-2
    paddingBottom: "0.5rem",
    fontSize: "0.875rem", // text-sm
    color: "#111827", // text-gray-900
    outline: "none", // focus:outline-none
  };

  // Generate unique ID for this input instance
  const inputId = React.useId();

  const defaultButtonStyle: React.CSSProperties = {
    borderRadius: "0.375rem", // rounded-md
    backgroundColor: "#2563eb", // bg-blue-600
    paddingLeft: "0.75rem", // px-3
    paddingRight: "0.75rem",
    paddingTop: "0.5rem", // py-2
    paddingBottom: "0.5rem",
    fontSize: "0.875rem", // text-sm
    fontWeight: "500", // font-medium
    color: "#ffffff", // text-white
    border: "none",
    cursor: "pointer",
  };

  return (
    <div
      data-ai-message-input-container=""
      className={className}
      style={className ? undefined : defaultContainerStyle}
    >
      {!inputClassName && (
        <style>
          {`
            #${inputId}::placeholder {
              color: #9ca3af; /* placeholder:text-gray-400 */
            }
            #${inputId}:focus {
              outline: none;
              box-shadow: 0 0 0 2px #3b82f6; /* focus:ring-2 focus:ring-blue-500 */
            }
          `}
        </style>
      )}
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
                backgroundColor: !text ? "#2563eb" : undefined,
              }
        }
        onMouseEnter={(e) => {
          if (!buttonClassName && text) {
            (e.target as HTMLButtonElement).style.backgroundColor = "#1d4ed8"; // hover:bg-blue-700
          }
        }}
        onMouseLeave={(e) => {
          if (!buttonClassName && text) {
            (e.target as HTMLButtonElement).style.backgroundColor = "#2563eb"; // bg-blue-600
          }
        }}
      >
        Send
      </button>
    </div>
  );
};
