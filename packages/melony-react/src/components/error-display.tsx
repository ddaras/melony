import React from "react";

interface ErrorDisplayProps {
  error: Error;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="text-destructive p-2 border border-destructive rounded-md bg-destructive/10">
      {error.message}
    </div>
  );
}
