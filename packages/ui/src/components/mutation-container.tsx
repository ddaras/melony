import React from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

export function MutationContainer({
  mutationKey,
  action,
  render,
  onSuccess,
  onError,
  onSettled,
}: {
  mutationKey?: string;
  action: (data: any) => Promise<any>;
  render: (mutation: UseMutationResult<any, any, any>) => React.ReactNode;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onSettled?: (data: any) => void;
}) {
  const mutation = useMutation({
    mutationKey: ["mutation", mutationKey],
    mutationFn: action,
    onSuccess,
    onError,
    onSettled,
  });

  return <>{render(mutation)}</>;
}
