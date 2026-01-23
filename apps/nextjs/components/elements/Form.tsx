import React, { useState } from "react";
import { UIContract } from "@melony/ui-kit";
import { useMelony } from "@melony/react";
import { cn } from "@/lib/utils";
import { gapMap } from "@/lib/theme-utils";

export const Form: React.FC<
  UIContract["form"] & { children?: React.ReactNode[] }
> = ({ children, onSubmitAction, gap = "md" }) => {
  const { send } = useMelony();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitted) return;

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    if (onSubmitAction) {
      setIsSubmitted(true);

      if (typeof onSubmitAction === "object" && "type" in onSubmitAction) {
        send({
          ...onSubmitAction,
          data: {
            ...(onSubmitAction?.data || {}),
            ...data,
          },
        } as any);
      } else if (typeof onSubmitAction === "function") {
        send(onSubmitAction(data));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <fieldset disabled={isSubmitted} className="m-0 border-0 p-0">
        <div
          className={cn(
            "flex flex-col transition-opacity",
            gapMap[gap],
            isSubmitted && "opacity-60 pointer-events-none",
          )}
        >
          {children as React.ReactNode}
        </div>
      </fieldset>
    </form>
  );
};
