"use client";

import { FullChat } from "@/components/full-chat";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThreadProvider } from "@/providers/thread-provider";
import { useMelony } from "@melony/react";
import { useMemo } from "react";
import { convertEventsToAggregatedMessages } from "@/lib/message-converter";

export default function Home() {
  const { events } = useMelony();
  const messages = useMemo(() => convertEventsToAggregatedMessages(events), [events]);

  console.log(messages);
  console.log(events);

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-black">
      <ThreadProvider service={{
        getThreads: async () => [],
        getEvents: async () => [],
        deleteThread: async () => { },
      }}>
        <FullChat
          headerProps={{
            rightContent: (
              <div className="flex gap-2">
                <ThemeToggle />
              </div>
            )
          }}
          title="Melony Food"
          placeholder="I'm hungry..."
          messages={messages}
        />
      </ThreadProvider>
    </div >
  );
}

