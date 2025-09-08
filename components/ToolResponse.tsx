import React from "react";
import { Message, MessagePart } from "../core/messages";
import { ToolCall } from "../core/tools";

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

        {/* Show corresponding tool result */}
        {message?.toolResults?.find(
          (result) => result.toolCallId === toolCall.id
        ) && (
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                marginBottom: "0.25rem",
              }}
            >
              Result:
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
              {JSON.stringify(
                message.toolResults.find(
                  (result) => result.toolCallId === toolCall.id
                )?.output,
                null,
                2
              )}
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
      {/* Render streaming state indicator */}
      {message?.streamingState?.isStreaming && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem",
            backgroundColor: "#dbeafe", // bg-blue-50
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
            color: "#1e40af", // text-blue-800
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
              animation: "pulse 2s infinite",
            }}
          />
          {message.streamingState.currentStep === "thinking" && "Thinking..."}
          {message.streamingState.currentStep === "tool-input" &&
            "Preparing tool input..."}
          {message.streamingState.currentStep === "tool-execution" &&
            "Executing tool..."}
          {message.streamingState.currentStep === "tool-output" &&
            "Processing result..."}
          {message.streamingState.currentStep === "response" &&
            "Generating response..."}
        </div>
      )}

      {/* Render tool calls */}
      {message?.toolCalls?.map((toolCall, i) => renderToolCall(toolCall, i))}

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
          case "form":
            return (
              <form
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem", // gap-2
                }}
              >
                {b.fields.map((f) => (
                  <input
                    key={f.name}
                    placeholder={f.label}
                    style={{
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
                    }}
                  />
                ))}
              </form>
            );
          case "detail":
            return (
              <pre
                key={i}
                style={{
                  overflowX: "auto", // overflow-x-auto
                  borderRadius: "0.375rem", // rounded-md
                  border: "1px solid #e5e7eb", // border border-gray-200
                  backgroundColor: "#f9fafb", // bg-gray-50
                  padding: "0.75rem", // p-3
                  fontSize: "0.75rem", // text-xs
                  color: "#111827", // text-gray-900
                }}
              >
                {JSON.stringify(b.data, null, 2)}
              </pre>
            );
          case "chart":
            return (
              <div
                key={i}
                style={{
                  borderRadius: "0.375rem", // rounded-md
                  border: "1px dashed #d1d5db", // border border-dashed border-gray-300
                  padding: "1rem", // p-4
                  textAlign: "center", // text-center
                  fontSize: "0.875rem", // text-sm
                  color: "#6b7280", // text-gray-500
                }}
              >
                [Chart: {b.kind}]
              </div>
            );
          case "tool":
            const toolPart = b as { type: "tool"; toolCallId: string; status: string; inputStream?: string };
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
