import React from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function QueryContainer({
  action,
  render,
  queryKey,
}: {
  queryKey?: string;
  action: (data: any) => Promise<any>;
  render: (query: UseQueryResult<any, any>) => React.ReactNode;
}) {
  const query = useQuery({
    queryKey: ["query", queryKey],
    queryFn: action,
  });

  return <>{render(query)}</>;
}
