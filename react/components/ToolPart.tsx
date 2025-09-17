import type { ToolMessagePart } from "../../core/types";

type ToolPartProps = {
  part: ToolMessagePart;
  index: number;
};

export function ToolPart({ part, index }: ToolPartProps) {
  switch (part.status) {
    case "streaming":
      return <div key={index}>Using {part.toolName}...</div>;
    
    case "pending":
      if (part.input) {
        return (
          <div key={index}>
            Using {part.toolName}... with input:{" "}
            {JSON.stringify(part.input, null, 2)}
          </div>
        );
      }
      return <div key={index}>Using {part.toolName}...</div>;
    
    case "completed":
      return (
        <div key={index}>
          Using {part.toolName}... completed. results:
          {JSON.stringify(part?.output, null, 2)}
        </div>
      );
    
    case "error":
      return <div key={index}>Error using {part.toolName}</div>;

    default:
      return <>unknown state of the tool message</>;
  }
}
