import { useMemo } from "react";
import { DefaultAIClient } from "../core/client";

export function useAgent(baseUrl: string) {
  const client = useMemo(
    () => new DefaultAIClient({ endpoint: baseUrl }),
    [baseUrl]
  );
  return { client };
}
