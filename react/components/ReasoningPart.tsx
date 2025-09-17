import { Thinking } from "./Thinking";
import type { ReasoningMessagePart } from "../../core/types";

type ReasoningPartProps = {
  part: ReasoningMessagePart;
  index: number;
  isStreaming?: boolean;
};

export function ReasoningPart({ part, index, isStreaming = false }: ReasoningPartProps) {
  return (
    <Thinking key={index} text={part.text} isStreaming={isStreaming} />
  );
}
