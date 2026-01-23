import React from "react";
import { StarterPrompt } from "@/types";
import { Button } from "./elements";

interface StarterPromptsProps {
  prompts: StarterPrompt[];
}

export function StarterPrompts({ prompts }: StarterPromptsProps) {
  if (!prompts || prompts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-auto max-w-2xl">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          What can I help with today?
        </h2>
      </div>
      <div className="flex flex-col gap-1 w-full">
        {prompts.map((item, index) => (
          <Button
            key={index}
            label={item.label}
            variant="ghost"
            size="lg"
            onClickAction={{
              type: "text",
              data: { content: item.prompt },
            }}
            justify="start"
          />
        ))}
      </div>
    </div>
  );
}
