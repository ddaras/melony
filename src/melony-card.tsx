import React, { useMemo } from "react";
import { parse as parsePartialJson } from "partial-json";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MelonyCardProps {
  text: string;
  className?: string;
  customComponents?: Record<string, React.FC<any>>;
}

interface ParsedContent {
  type: "text" | "json";
  data: any;
  originalText: string;
}

// Component type definitions
interface OverviewData {
  type: "overview";
  title?: string;
  description?: string;
  items?: Array<{ label: string; value: string }>;
}

interface DetailsData {
  type: "details";
  title?: string;
  sections?: Array<{ heading: string; content: string }>;
}

interface ChartData {
  type: "chart";
  title?: string;
  chartType?: "bar" | "line" | "pie";
  data?: Array<{ label: string; value: number }>;
}

interface FormData {
  type: "form";
  title?: string;
  fields?: Array<{
    name: string;
    label: string;
    type: string;
    required?: boolean;
  }>;
}

interface ListData {
  type: "list";
  title?: string;
  items?: string[];
}

interface CardData {
  type: "card";
  title?: string;
  content?: string;
  footer?: string;
}

type ComponentData =
  | OverviewData
  | DetailsData
  | ChartData
  | FormData
  | ListData
  | CardData;

// Parse the answer string to detect JSON
const parseAnswer = (answer: string): ParsedContent => {
  // Check if the string contains JSON-like content
  const jsonMatch = answer.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    return {
      type: "text",
      data: null,
      originalText: answer,
    };
  }

  try {
    // Try to parse the JSON (potentially partial)
    const jsonString = jsonMatch[0];
    const parsed = parsePartialJson(jsonString);

    if (parsed && typeof parsed === "object" && "type" in parsed) {
      return {
        type: "json",
        data: parsed,
        originalText: answer,
      };
    }
  } catch (error) {
    // If parsing fails, treat as text
    console.warn("Failed to parse JSON:", error);
  }

  return {
    type: "text",
    data: null,
    originalText: answer,
  };
};

// Individual component renderers
const OverviewComponent: React.FC<OverviewData> = ({
  title,
  description,
  items,
}) => (
  <div
    className="overview-component"
    style={{
      padding: "16px",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
    }}
  >
    {title && (
      <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: 600 }}>
        {title}
      </h3>
    )}
    {description && (
      <p style={{ margin: "0 0 16px 0", color: "#666" }}>{description}</p>
    )}
    {items && items.length > 0 && (
      <div style={{ display: "grid", gap: "12px" }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 500 }}>{item.label}:</span>
            <span style={{ color: "#666" }}>{item.value}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const DetailsComponent: React.FC<DetailsData> = ({ title, sections }) => (
  <div
    className="details-component"
    style={{
      padding: "16px",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
    }}
  >
    {title && (
      <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600 }}>
        {title}
      </h3>
    )}
    {sections && sections.length > 0 && (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {sections.map((section, index) => (
          <div key={index}>
            <h4
              style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 600 }}
            >
              {section.heading}
            </h4>
            <p style={{ margin: 0, color: "#666", lineHeight: "1.5" }}>
              {section.content}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const ChartComponent: React.FC<ChartData> = ({
  title,
  chartType = "bar",
  data,
}) => (
  <div
    className="chart-component"
    style={{
      padding: "16px",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
    }}
  >
    {title && (
      <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600 }}>
        {title}
      </h3>
    )}
    <div
      style={{
        padding: "16px",
        background: "#f5f5f5",
        borderRadius: "4px",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "8px", color: "#666", fontSize: "14px" }}>
        Chart Type: {chartType}
      </div>
      {data && data.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          {data.map((item, index) => (
            <div
              key={index}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <span style={{ minWidth: "100px", textAlign: "left" }}>
                {item.label}:
              </span>
              <div
                style={{
                  flex: 1,
                  background: "#ddd",
                  height: "24px",
                  borderRadius: "4px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    background: "#4caf50",
                    height: "100%",
                    width: `${Math.min(
                      100,
                      (item.value / Math.max(...data.map((d) => d.value))) * 100
                    )}%`,
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: "8px",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const FormComponent: React.FC<FormData> = ({ title, fields }) => (
  <div
    className="form-component"
    style={{
      padding: "16px",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
    }}
  >
    {title && (
      <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600 }}>
        {title}
      </h3>
    )}
    {fields && fields.length > 0 && (
      <form style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {fields.map((field, index) => (
          <div
            key={index}
            style={{ display: "flex", flexDirection: "column", gap: "4px" }}
          >
            <label style={{ fontWeight: 500, fontSize: "14px" }}>
              {field.label}
              {field.required && <span style={{ color: "red" }}> *</span>}
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              required={field.required}
              style={{
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
          </div>
        ))}
      </form>
    )}
  </div>
);

const ListComponent: React.FC<ListData> = ({ title, items }) => (
  <div
    className="list-component"
    style={{
      padding: "16px",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
    }}
  >
    {title && (
      <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600 }}>
        {title}
      </h3>
    )}
    {items && items.length > 0 && (
      <ul
        style={{
          margin: 0,
          paddingLeft: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {items.map((item, index) => (
          <li key={index} style={{ color: "#666", lineHeight: "1.5" }}>
            {item}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const CardComponent: React.FC<CardData> = ({ title, content, footer }) => (
  <div
    className="card-component"
    style={{
      padding: "16px",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }}
  >
    {title && (
      <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: 600 }}>
        {title}
      </h3>
    )}
    {content && (
      <div style={{ margin: "0 0 12px 0", color: "#666", lineHeight: "1.5" }}>
        {content}
      </div>
    )}
    {footer && (
      <div
        style={{
          paddingTop: "12px",
          borderTop: "1px solid #e0e0e0",
          fontSize: "14px",
          color: "#999",
        }}
      >
        {footer}
      </div>
    )}
  </div>
);

// Main component renderer
const renderJsonComponent = (
  data: ComponentData,
  customComponents?: Record<string, React.FC<any>>
) => {
  // Check for custom components first
  if (customComponents && data.type in customComponents) {
    const CustomComponent = customComponents[data.type];
    return <CustomComponent {...data} />;
  }

  // Fall back to built-in components
  switch (data.type) {
    case "overview":
      return <OverviewComponent {...data} />;
    case "details":
      return <DetailsComponent {...data} />;
    case "chart":
      return <ChartComponent {...data} />;
    case "form":
      return <FormComponent {...data} />;
    case "list":
      return <ListComponent {...data} />;
    case "card":
      return <CardComponent {...data} />;
    default:
      return (
        <div
          style={{
            padding: "16px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
          }}
        >
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      );
  }
};

export const MelonyCard: React.FC<MelonyCardProps> = ({
  text,
  className,
  customComponents,
}) => {
  const parsedContent = useMemo(() => parseAnswer(text), [text]);

  if (parsedContent.type === "json" && parsedContent.data) {
    return (
      <div className={className}>
        {renderJsonComponent(
          parsedContent.data as ComponentData,
          customComponents
        )}
      </div>
    );
  }

  // Render as markdown text
  return (
    <div
      className={`markdown-component ${className}`}
      style={{ padding: "16px" }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {parsedContent.originalText}
      </ReactMarkdown>
    </div>
  );
};

export default MelonyCard;
