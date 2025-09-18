import type { ToolMessagePart } from "../core/types";

type ToolPartProps = {
  part: ToolMessagePart;
  index: number;
};

export function ToolPart({ part, index }: ToolPartProps) {
  const getContent = () => {
    switch (part.status) {
      case "streaming":
        return <div>Using {part.toolName}...</div>;

      case "pending":
        if (part.input) {
          return (
            <div>
              Using {part.toolName}... with input:{" "}
              {JSON.stringify(part.input, null, 2)}
            </div>
          );
        }
        return <div>Using {part.toolName}...</div>;

      case "completed":
        return (
          <div>
            Using {part.toolName}... completed. results:
            {JSON.stringify(part?.output, null, 2)}
          </div>
        );

      case "error":
        return <div>Error using {part.toolName}</div>;

      default:
        return <>unknown state of the tool message</>;
    }
  };

  return (
    <div
      key={index}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        padding: "0.5rem",
      }}
    >
      {getContent()}
    </div>
  );
}
