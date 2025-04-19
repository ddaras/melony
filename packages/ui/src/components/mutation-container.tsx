import React from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

export function MutationContainer({
  mutationKey,
  action,
  render,
}: {
  mutationKey?: string;
  action: (data: any) => Promise<any>;
  render: (mutation: UseMutationResult<any, any, any>) => React.ReactNode;
}) {
  const mutation = useMutation({
    mutationKey: ["mutation", mutationKey],
    mutationFn: action,
  });

  return <>{render(mutation)}</>;
}
