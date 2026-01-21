import { useState } from "react";
import {
  IconChevronUp,
  IconChevronDown,
  IconLoader2,
} from "@tabler/icons-react";

interface LoadingIndicatorProps {
  status?: {
    message: string;
    details?: string;
  };
}

export function LoadingIndicator({ status }: LoadingIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const message = status?.message || "Processing...";
  const details = status?.details;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-muted-foreground group">
        <IconLoader2 className="size-3.5 animate-spin" />
        <div className="animate-pulse">{message}</div>
        {details && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5 hover:bg-muted rounded-sm transition-colors flex items-center justify-center"
            title={isExpanded ? "Hide details" : "Show details"}
          >
            {isExpanded ? (
              <IconChevronUp className="size-3.5 opacity-50 group-hover:opacity-100" />
            ) : (
              <IconChevronDown className="size-3.5 opacity-50 group-hover:opacity-100" />
            )}
          </button>
        )}
      </div>
      {isExpanded && details && (
        <div className="text-[10px] leading-relaxed font-mono bg-muted/30 p-2.5 rounded border border-border/50 max-h-64 overflow-y-auto whitespace-pre-wrap text-muted-foreground shadow-sm">
          {details}
        </div>
      )}
    </div>
  );
}
