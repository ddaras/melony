import { useContext } from "react";
import { ThreadContext, ThreadContextValue } from "@/providers/thread-provider";

export const useThreads = (): ThreadContextValue => {
  const context = useContext(ThreadContext);
  if (context === undefined) {
    throw new Error("useThreads must be used within a ThreadProvider");
  }
  return context;
};
