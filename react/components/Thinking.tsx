import React from "react";

type ThinkingProps = {
  text?: string;
  className?: string;
  isStreaming?: boolean;
};

export function Thinking({ text, className }: ThinkingProps) {
  const defaultStyle: React.CSSProperties = {
    padding: "0.75rem", // p-3
    margin: "0.5rem 0", // my-2
    fontStyle: "italic",
    fontSize: "0.875rem", // text-sm
    position: "relative",
  };

  const thinkingIndicatorStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: "500",
  };

  const dotStyle: React.CSSProperties = {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    display: "inline-block",
  };

  return (
    <div className={className} style={className ? undefined : defaultStyle}>
      <div style={thinkingIndicatorStyle}>
        <span>💭 Thinking</span>
        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
          <span style={{ ...dotStyle, animationDelay: "0s" }} />
          <span style={{ ...dotStyle, animationDelay: "0.2s" }} />
          <span style={{ ...dotStyle, animationDelay: "0.4s" }} />
        </div>
      </div>
      {text && <div style={{ marginTop: "0.5rem" }}>{text}</div>}
    </div>
  );
}
