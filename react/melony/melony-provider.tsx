import React, { createContext, useContext, useRef, useState } from "react";
import { MelonyPart } from "./types";

type MelonyContextType = {
  parts: MelonyPart[];
  send: (message: string) => Promise<void>;
  subscribePart: (
    partType?: string,
    filter?: (part: MelonyPart) => boolean,
    callback?: (part: MelonyPart) => void
  ) => () => void;
  status: "idle" | "requested" | "streaming" | "error";
};

export const MelonyContext = createContext<MelonyContextType | null>(null);

export function MelonyProvider({
  children,
  endpoint,
  headers,
}: {
  children: React.ReactNode;
  endpoint?: string;
  headers?: Record<string, string>;
}) {
  const [parts, setParts] = useState<MelonyPart[]>([]);
  const [status, setStatus] = useState<
    "idle" | "requested" | "streaming" | "error"
  >("idle");

  const partListeners = useRef<Set<(part: MelonyPart) => void>>(new Set());

  const subscribePart = (
    partType?: string,
    filter?: (part: MelonyPart) => boolean,
    callback?: (part: MelonyPart) => void
  ) => {
    const listener = (part: MelonyPart) => {
      if ((!partType || part.type === partType) && (!filter || filter(part))) {
        callback?.(part);
      }
    };
    partListeners.current.add(listener);
    return () => partListeners.current.delete(listener);
  };

  const send = async (message: string) => {
    const full: MelonyPart = {
      id: crypto.randomUUID(),
      type: "text",
      text: message,
      role: "user",
    };

    const newParts = [...parts, full];

    setParts(newParts);
    setStatus("requested");

    try {
      const response = await fetch(`${endpoint || "/api/chat"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        setStatus("streaming");

        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim(); // Remove "data: " prefix
          if (!data) continue;
          if (data === "[DONE]") {
            // Finalize any remaining messages
            setStatus("idle");
            return;
          }

          try {
            const part = JSON.parse(data);
            setParts((prevParts) => [
              ...prevParts,
              { ...part, role: "assistant" },
            ]);
            // Notify all part listeners
            partListeners.current.forEach((listener) => listener(part));
          } catch (error) {
            setStatus("error");
            console.error("Failed to parse part:", error);
            return;
          } finally {
            setStatus("idle");
          }
        }
      }
    } catch (error) {
      setStatus("error");
      // Optionally, you could emit an error message here
      console.error("Failed to send message:", error);
    }
  };

  return (
    <MelonyContext.Provider
      value={{
        parts,
        send,
        subscribePart,
        status,
      }}
    >
      {children}
    </MelonyContext.Provider>
  );
}

export const useMelony = () => {
  const context = useContext(MelonyContext);
  if (!context) {
    throw new Error("useMelony must be used within an MelonyProvider");
  }
  return context;
};
