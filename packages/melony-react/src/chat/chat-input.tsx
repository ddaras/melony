import React, { useRef, useEffect } from "react";
import { useTheme } from "../theme";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  centered?: boolean;
}

export function ChatInput({
  input,
  setInput,
  isLoading,
  onSubmit,
  placeholder = "Type a message...",
  centered = false,
}: ChatInputProps) {
  const theme = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift), allow new line with Shift+Enter
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(e as any);
      }
    }
  };

  return (
    <>
      <style>{`
        textarea::placeholder {
          color: ${theme.colors?.mutedForeground || "#a1a1aa"};
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          ...(centered
            ? {
                top: "50%",
                transform: "translate(-50%, -50%)",
              }
            : {
                bottom: 0,
                transform: "translateX(-50%)",
              }),
          left: "50%",
          width: "100%",
          maxWidth: "48rem",
          padding: `${theme.spacing?.lg || "1rem"} ${theme.spacing?.xs || "0.5rem"}`,
          background: centered
            ? "transparent"
            : `linear-gradient(to top, ${theme.colors?.background || "#ffffff"}, ${theme.colors?.background ? theme.colors.background + "CC" : "rgba(255,255,255,0.8)"} 50%, ${theme.colors?.background ? theme.colors.background + "00" : "rgba(255,255,255,0)"})`,
        }}
      >
        <form
          onSubmit={onSubmit}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            backgroundColor: theme.colors?.inputBackground || "#ffffff",
            borderRadius: theme.radius?.lg || "16px",
            border: `1px solid ${theme.colors?.inputBorder || "#e4e4e7"}`,
            boxShadow: theme.shadows?.md || "0 4px 12px -2px rgba(0, 0, 0, 0.05)",
            padding: `${theme.spacing?.xs || "0.25rem"}`,
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            autoFocus
            style={{
              flex: 1,
              padding: "0.875rem 1.25rem",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: theme.typography?.fontSize?.md || "0.9375rem",
              color: theme.colors?.foreground || "#09090b",
              minWidth: 0,
              resize: "none",
              overflow: "hidden",
              maxHeight: "200px",
              lineHeight: "1.5",
              fontFamily: "inherit",
            }}
          />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2.25rem",
            height: "2.25rem",
            borderRadius: "50%",
            backgroundColor:
              isLoading || !input.trim()
                ? theme.colors?.muted || "#f4f4f5"
                : theme.colors?.primary || "#18181b",
            color:
              isLoading || !input.trim()
                ? theme.colors?.mutedForeground || "#a1a1aa"
                : theme.colors?.background || "#ffffff",
            border: "none",
            cursor: isLoading || !input.trim() ? "default" : "pointer",
            transition: "all 0.2s ease",
            marginRight: "0.34rem",
            flexShrink: 0,
            marginBottom: `${theme.spacing?.sm || "0.34rem"}`,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
        </button>
      </form>
    </div>
    </>
  );
}
