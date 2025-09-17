import React from "react";
import { Message, MessagePart, ToolCall } from "../core/types";

type ToolResponseProps = {
  parts: MessagePart[];
  message?: Message; // Full message for accessing tool calls and streaming state
  className?: string;
};

export const ToolResponse: React.FC<ToolResponseProps> = ({
  parts,
  message,
  className,
}) => {
  const defaultContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem", // gap-3
  };

  const renderToolCall = (toolCall: ToolCall, index: number) => {
    const getStatusColor = (status?: string) => {
      switch (status) {
        case "streaming":
          return "#f59e0b"; // amber-500
        case "pending":
          return "#3b82f6"; // blue-500
        case "completed":
          return "#10b981"; // emerald-500
        case "error":
          return "#ef4444"; // red-500
        default:
          return "#6b7280"; // gray-500
      }
    };

    const getStatusText = (status?: string) => {
      switch (status) {
        case "streaming":
          return "Streaming input...";
        case "pending":
          return "Executing...";
        case "completed":
          return "Completed";
        case "error":
          return "Error";
        default:
          return "Unknown";
      }
    };

    return (
      <div
        key={`tool-${index}`}
        style={{
          border: "1px solid #e5e7eb", // border-gray-200
          borderRadius: "0.5rem", // rounded-lg
          padding: "0.75rem", // p-3
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: getStatusColor(toolCall.status),
            }}
          />
          <span style={{ fontWeight: "600", fontSize: "0.875rem" }}>
            {toolCall.name}
          </span>
          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            {getStatusText(toolCall.status)}
          </span>
        </div>

        {toolCall.inputStream && (
          <div style={{ marginBottom: "0.5rem" }}>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                marginBottom: "0.25rem",
              }}
            >
              Input (streaming):
            </div>
            <pre
              style={{
                fontSize: "0.75rem",
                backgroundColor: "#ffffff",
                border: "1px solid #d1d5db",
                borderRadius: "0.25rem",
                padding: "0.5rem",
                overflow: "auto",
                fontFamily: "monospace",
              }}
            >
              {toolCall.inputStream}
            </pre>
          </div>
        )}

        {toolCall.args && (
          <div style={{ marginBottom: "0.5rem" }}>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                marginBottom: "0.25rem",
              }}
            >
              Arguments:
            </div>
            <pre
              style={{
                fontSize: "0.75rem",
                backgroundColor: "#ffffff",
                border: "1px solid #d1d5db",
                borderRadius: "0.25rem",
                padding: "0.5rem",
                overflow: "auto",
                fontFamily: "monospace",
              }}
            >
              {JSON.stringify(toolCall.args, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={className}
      style={className ? undefined : defaultContainerStyle}
    >
      {/* Render regular message parts */}
      {parts.map((b, i) => {
        switch (b.type) {
          case "text":
            return (
              <p
                key={i}
                style={{
                  fontSize: "0.875rem", // text-sm
                  color: "#111827", // text-gray-900
                }}
              >
                {b.text}
              </p>
            );

          case "tool":
            const toolPart = b as {
              type: "tool";
              toolCallId: string;
              status: string;
              inputStream?: string;
            };
            const getStatusColor = (status: string) => {
              switch (status) {
                case "streaming":
                  return "#f59e0b"; // amber-500
                case "pending":
                  return "#3b82f6"; // blue-500
                case "completed":
                  return "#10b981"; // emerald-500
                case "error":
                  return "#ef4444"; // red-500
                default:
                  return "#6b7280"; // gray-500
              }
            };

            const getStatusText = (status: string) => {
              switch (status) {
                case "streaming":
                  return "Streaming input...";
                case "pending":
                  return "Executing...";
                case "completed":
                  return "Completed";
                case "error":
                  return "Error";
                default:
                  return "Unknown";
              }
            };

            return (
              <div
                key={i}
                style={{
                  border: "1px solid #e5e7eb", // border-gray-200
                  borderRadius: "0.5rem", // rounded-lg
                  padding: "0.75rem", // p-3
                  backgroundColor: "#f9fafb", // bg-gray-50
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: getStatusColor(toolPart.status),
                    }}
                  />
                  <span style={{ fontWeight: "600", fontSize: "0.875rem" }}>
                    Tool: {toolPart.toolCallId}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    {getStatusText(toolPart.status)}
                  </span>
                </div>

                {toolPart.inputStream && (
                  <div style={{ marginBottom: "0.5rem" }}>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Input (streaming):
                    </div>
                    <pre
                      style={{
                        fontSize: "0.75rem",
                        backgroundColor: "#ffffff",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.25rem",
                        padding: "0.5rem",
                        overflow: "auto",
                        fontFamily: "monospace",
                      }}
                    >
                      {toolPart.inputStream}
                    </pre>
                  </div>
                )}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
