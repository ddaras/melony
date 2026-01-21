"use client";

import { MelonyClientProvider, FullChat, ThreadProvider, ThemeProvider, ThemeToggle } from "@melony/react";
import { MelonyClient } from "melony/client";

const client = new MelonyClient({
  url: "/api/chat",
})

export default function Home() {

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-black">
      <MelonyClientProvider client={client}>
        <ThemeProvider>
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
            />
          </ThreadProvider>
        </ThemeProvider>
      </MelonyClientProvider>
    </div>
  );
}

