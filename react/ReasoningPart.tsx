import { Thinking } from "./Thinking";
import type { ReasoningMessagePart } from "../core/types";

type ReasoningPartProps = {
  part: ReasoningMessagePart;
  index: number;
};

export function ReasoningPart({ part, index }: ReasoningPartProps) {
  return <Thinking key={index} text={part.text} />;
}
