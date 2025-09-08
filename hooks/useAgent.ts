import { useMemo } from "react";
import { AISDKAdapter } from "../adapters/ai/ai-sdk";

export function useAgent(baseUrl: string, debug?: boolean) {
  const adapter = useMemo(
    () => new AISDKAdapter({ endpoint: baseUrl, debug }),
    [baseUrl, debug]
  );
  return { adapter };
}
