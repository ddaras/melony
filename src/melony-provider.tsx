import React, { createContext, useContext, useRef, useState } from "react";
import { MelonyPart } from "./types";

type MelonyContextType<TPart extends MelonyPart = MelonyPart> = {
  parts: TPart[];
  send: (message: string) => Promise<void>;
  subscribeEvents: (callback: (part: TPart) => void) => () => void;
  status: "idle" | "requested" | "streaming" | "error";
};

export const MelonyContext = createContext<MelonyContextType | null>(null);

export function MelonyProvider<TPart extends MelonyPart = MelonyPart>({
  children,
  endpoint,
  headers,
  mapUserMessage,
  mapIncomingPart,
}: {
  children: React.ReactNode;
  endpoint?: string;
  headers?: Record<string, string>;
  /**
   * Optional mapper to turn a user input string into a framework-specific part.
   */
  mapUserMessage?: (message: string) => TPart;
  /**
   * Optional mapper to convert raw streamed JSON into your framework-specific part.
   */
  mapIncomingPart?: (raw: unknown) => TPart;
}) {
  const [parts, setParts] = useState<TPart[]>([]);
  const [status, setStatus] = useState<
    "idle" | "requested" | "streaming" | "error"
  >("idle");

  const partListeners = useRef<Set<(part: TPart) => void>>(new Set());

  const subscribeEvents = (callback: (part: TPart) => void) => {
    partListeners.current.add(callback);
    return () => partListeners.current.delete(callback);
  };

  const send = async (message: string) => {
    const userPart: TPart = mapUserMessage
      ? mapUserMessage(message)
      : ({
          melonyId: crypto.randomUUID(),
          type: "text",
          role: "user",
          text: message,
        } as unknown as TPart);

    const newParts = [...parts, userPart];

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

      // melonyId is used to group parts in MelonyMessage container
      const melonyId = crypto.randomUUID();

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
            const raw = JSON.parse(data);
            const part = mapIncomingPart
              ? mapIncomingPart(raw)
              : (raw as TPart);
            setParts((prevParts) => [
              ...prevParts,
              {
                ...(part as unknown as Record<string, any>),
                melonyId: melonyId,
                role: "assistant",
              } as unknown as TPart,
            ]);
            // Notify all part listeners with the mapped part
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
        subscribeEvents,
        status,
      }}
    >
      {children}
    </MelonyContext.Provider>
  );
}

export const useMelony = <TPart extends MelonyPart = MelonyPart>() => {
  const context = useContext(MelonyContext) as MelonyContextType<TPart> | null;
  if (!context) {
    throw new Error("useMelony must be used within an MelonyProvider");
  }
  return context as MelonyContextType<TPart>;
};
