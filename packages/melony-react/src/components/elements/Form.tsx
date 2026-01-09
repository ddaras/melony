import React, { useState } from "react";
import { useMelony } from "@/hooks/use-melony";
import { FormProps } from "./component-types";
import { cn } from "@/lib/utils";

export const Form: React.FC<FormProps> = ({
  children,
  onSubmitAction,
  className,
  style,
}) => {
  const { sendEvent } = useMelony();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitted) return;

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    if (onSubmitAction) {
      setIsSubmitted(true);

      if ("type" in onSubmitAction) {
        sendEvent({
          ...onSubmitAction,
          data: {
            ...(onSubmitAction?.data || {}),
            ...data,
          },
        } as any);
      } else {
        sendEvent(onSubmitAction(data));
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("w-full", className)}
      style={style}
    >
      <fieldset disabled={isSubmitted} className="m-0 border-0 p-0">
        <div
          className={cn(
            "flex flex-col gap-4 transition-opacity",
            isSubmitted && "opacity-60 pointer-events-none"
          )}
        >
          {children as React.ReactNode}
        </div>
      </fieldset>
    </form>
  );
};
