"use client";

import { FullChat } from "@/components/full-chat";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThreadProvider } from "@/providers/thread-provider";
import { useMelony } from "@melony/react";
import { useMemo } from "react";
import { convertEventsToAggregatedMessages } from "@/lib/message-converter";
import { FloatingLayout } from "@/components/floating-layout";

export default function Home() {
  const { events } = useMelony();
  const messages = useMemo(() => convertEventsToAggregatedMessages(events), [events]);

  console.log(messages);
  console.log(events);

  return (
    <ThreadProvider service={{
      getThreads: async () => [],
      getEvents: async () => [],
      deleteThread: async () => { },
    }}>
      <FloatingLayout navPosition="top">
        <FullChat
          headerProps={{
            rightContent: (
              <div className="flex gap-2">
                <ThemeToggle />
              </div>
            )
          }}
          title=""
          placeholder="I'm hungry..."
          messages={messages}
        />
      </FloatingLayout>
    </ThreadProvider>
  );
}

