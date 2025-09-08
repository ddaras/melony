import React from "react";

type ThinkingProps = {
  text?: string;
  className?: string;
  isStreaming?: boolean;
};

export function Thinking({
  text,
  className,
  isStreaming = true,
}: ThinkingProps) {
  const defaultStyle: React.CSSProperties = {
    backgroundColor: "#f8fafc", // bg-slate-50
    border: "1px solid #e2e8f0", // border-slate-200
    borderRadius: "0.5rem", // rounded-lg
    padding: "0.75rem", // p-3
    margin: "0.5rem 0", // my-2
    fontStyle: "italic",
    color: "#64748b", // text-slate-500
    fontSize: "0.875rem", // text-sm
    position: "relative",
    whiteSpace: "pre-wrap",
  };

  const thinkingIndicatorStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: "500",
    color: "#475569", // text-slate-600
  };

  const dotStyle: React.CSSProperties = {
    width: "6px",
    height: "6px",
    backgroundColor: "#94a3b8", // bg-slate-400
    borderRadius: "50%",
    display: "inline-block",
    animation: isStreaming
      ? "thinking-pulse 1.4s ease-in-out infinite"
      : "none",
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
      <style>{`
        @keyframes thinking-pulse {
          0%, 60%, 100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          30% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
