"use client";

import { FullChat } from "@/components/full-chat";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThreadProvider } from "@/providers/thread-provider";
import { FloatingLayout } from "@/components/floating-layout";

export default function Home() {
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
        />
      </FloatingLayout>
    </ThreadProvider>
  );
}

