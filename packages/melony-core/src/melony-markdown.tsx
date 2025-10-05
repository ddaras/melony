import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

export interface MarkdownProps {
  children: string;
  className?: string;
  components?: Partial<Components>;
  style?: React.CSSProperties;
}

const defaultComponents: Partial<Components> = {
  // Headings
  h1: ({ children, ...props }) => (
    <h1
      style={{
        fontSize: "1.875rem",
        fontWeight: "bold",
        marginBottom: "1rem",
        marginTop: "1.5rem",
        color: "#111827",
        lineHeight: "1.2",
      }}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      style={{
        fontSize: "1.5rem",
        fontWeight: "600",
        marginBottom: "0.75rem",
        marginTop: "1.25rem",
        color: "#111827",
        lineHeight: "1.3",
      }}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      style={{
        fontSize: "1.25rem",
        fontWeight: "500",
        marginBottom: "0.5rem",
        marginTop: "1rem",
        color: "#111827",
        lineHeight: "1.4",
      }}
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      style={{
        fontSize: "1.125rem",
        fontWeight: "500",
        marginBottom: "0.5rem",
        marginTop: "0.75rem",
        color: "#111827",
        lineHeight: "1.4",
      }}
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5
      style={{
        fontSize: "1rem",
        fontWeight: "500",
        marginBottom: "0.25rem",
        marginTop: "0.5rem",
        color: "#111827",
        lineHeight: "1.5",
      }}
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6
      style={{
        fontSize: "0.875rem",
        fontWeight: "500",
        marginBottom: "0.25rem",
        marginTop: "0.5rem",
        color: "#111827",
        lineHeight: "1.5",
      }}
      {...props}
    >
      {children}
    </h6>
  ),

  // Paragraphs
  p: ({ children, ...props }) => (
    <p
      style={{
        marginBottom: "1rem",
        color: "#374151",
        lineHeight: "1.6",
      }}
      {...props}
    >
      {children}
    </p>
  ),

  // Lists
  ul: ({ children, ...props }) => (
    <ul
      style={{
        marginBottom: "1rem",
        marginLeft: "1.5rem",
        listStyleType: "disc",
        color: "#374151",
      }}
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      style={{
        marginBottom: "1rem",
        marginLeft: "1.5rem",
        listStyleType: "decimal",
        color: "#374151",
      }}
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li
      style={{
        lineHeight: "1.6",
        marginBottom: "0.25rem",
      }}
      {...props}
    >
      {children}
    </li>
  ),

  // Links
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      style={{
        color: "#2563eb",
        textDecoration: "underline",
        transition: "color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#1d4ed8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#2563eb";
      }}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),

  // Code
  code: ({ children, className, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          style={{
            backgroundColor: "#f3f4f6",
            color: "#1f2937",
            padding: "0.125rem 0.375rem",
            borderRadius: "0.25rem",
            fontSize: "0.875rem",
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          }}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        style={{
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          fontSize: "0.875rem",
        }}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre
      style={{
        backgroundColor: "#f3f4f6",
        padding: "1rem",
        borderRadius: "0.5rem",
        overflowX: "auto",
        marginBottom: "1rem",
        fontSize: "0.875rem",
        fontFamily:
          'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        lineHeight: "1.5",
      }}
      {...props}
    >
      {children}
    </pre>
  ),

  // Blockquotes
  blockquote: ({ children, ...props }) => (
    <blockquote
      style={{
        borderLeft: "4px solid #d1d5db",
        paddingLeft: "1rem",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        marginBottom: "1rem",
        fontStyle: "italic",
        color: "#6b7280",
      }}
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Tables (GFM feature)
  table: ({ children, ...props }) => (
    <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
      <table
        style={{
          minWidth: "100%",
          borderCollapse: "collapse",
          border: "1px solid #d1d5db",
        }}
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead
      style={{
        backgroundColor: "#f9fafb",
      }}
      {...props}
    >
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody
      style={{
        backgroundColor: "#ffffff",
      }}
      {...props}
    >
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr
      style={{
        borderBottom: "1px solid #e5e7eb",
      }}
      {...props}
    >
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th
      style={{
        border: "1px solid #d1d5db",
        padding: "0.5rem 1rem",
        textAlign: "left",
        fontWeight: "600",
        color: "#111827",
      }}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      style={{
        border: "1px solid #d1d5db",
        padding: "0.5rem 1rem",
        color: "#374151",
      }}
      {...props}
    >
      {children}
    </td>
  ),

  // Horizontal rule
  hr: ({ ...props }) => (
    <hr
      style={{
        margin: "1.5rem 0",
        border: "none",
        borderTop: "1px solid #d1d5db",
      }}
      {...props}
    />
  ),

  // Strong/Bold
  strong: ({ children, ...props }) => (
    <strong
      style={{
        fontWeight: "600",
        color: "#111827",
      }}
      {...props}
    >
      {children}
    </strong>
  ),

  // Emphasis/Italic
  em: ({ children, ...props }) => (
    <em
      style={{
        fontStyle: "italic",
      }}
      {...props}
    >
      {children}
    </em>
  ),

  // Strikethrough (GFM feature)
  del: ({ children, ...props }) => (
    <del
      style={{
        textDecoration: "line-through",
        color: "#6b7280",
      }}
      {...props}
    >
      {children}
    </del>
  ),

  // Task lists (GFM feature)
  input: ({ type, checked, ...props }) => {
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={checked}
          disabled
          style={{
            marginRight: "0.5rem",
            accentColor: "#2563eb",
          }}
          {...props}
        />
      );
    }
    return <input type={type} {...props} />;
  },

  // Images
  img: ({ src, alt, ...props }) => (
    <img
      src={src}
      alt={alt}
      style={{
        maxWidth: "100%",
        height: "auto",
        borderRadius: "0.5rem",
        marginBottom: "1rem",
      }}
      {...props}
    />
  ),
};

export const MelonyMarkdown: React.FC<MarkdownProps> = ({
  children,
  className = "",
  components = {},
  style = {},
}) => {
  const mergedComponents = { ...defaultComponents, ...components };

  const containerStyle: React.CSSProperties = {
    maxWidth: "none",
    color: "#374151",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontSize: "1rem",
    lineHeight: "1.75",
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mergedComponents}>
        {children}
      </ReactMarkdown>
    </div>
  );
};
