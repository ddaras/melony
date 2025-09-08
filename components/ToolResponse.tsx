import React from "react";
import { MessagePart } from "../core/messages";

type ToolResponseProps = {
  parts: MessagePart[];
  className?: string;
};

export const ToolResponse: React.FC<ToolResponseProps> = ({
  parts,
  className,
}) => {
  const defaultContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem", // gap-3
  };

  return (
    <div
      className={className}
      style={className ? undefined : defaultContainerStyle}
    >
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
          default:
            return null;
        }
      })}
    </div>
  );
};
