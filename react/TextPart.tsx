import type { TextMessagePart } from "../core/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type TextPartProps = {
  part: TextMessagePart;
  index: number;
};

export function TextPart({ part, index }: TextPartProps) {
  return (
    <div key={index}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize paragraph styling to inherit from parent
          p: ({ children }) => (
            <p
              style={{
                margin: "0 0 0.5em 0",
                fontSize: "inherit",
                lineHeight: "inherit",
              }}
            >
              {children}
            </p>
          ),
          // Style code blocks
          pre: ({ children }) => (
            <pre
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "6px",
                padding: "16px",
                overflow: "auto",
                fontSize: "0.9em",
                lineHeight: "1.4",
                margin: "0.5em 0",
              }}
            >
              {children}
            </pre>
          ),
          // Style inline code
          code: ({ className, children, ...props }) => {
            const isInlineCode = !className;
            return (
              <code
                style={
                  isInlineCode
                    ? {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        padding: "0.2em 0.4em",
                        borderRadius: "3px",
                        fontSize: "0.9em",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                      }
                    : {}
                }
                {...props}
              >
                {children}
              </code>
            );
          },
          // Style blockquotes
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: "4px solid rgba(0, 0, 0, 0.2)",
                paddingLeft: "16px",
                margin: "0.5em 0",
                opacity: 0.8,
                fontStyle: "italic",
              }}
            >
              {children}
            </blockquote>
          ),
          // Style tables
          table: ({ children }) => (
            <div style={{ overflow: "auto", margin: "0.5em 0" }}>
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                }}
              >
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th
              style={{
                padding: "8px 12px",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              style={{
                padding: "8px 12px",
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              {children}
            </td>
          ),
        }}
      >
        {part.text}
      </ReactMarkdown>
    </div>
  );
}
