"use client";

import { MelonyClient, createHttpTransport } from "melony/client";
import {
  AuthProvider,
  MelonyClientProvider,
  ThreadProvider,
  ChatFull,
  ThemeProvider,
  ThemeToggle,
  AccountDialog,
  ThreadList,
} from "@melony/react";
import { STARTER_PROMPTS } from "@/app/lib/starter-prompts";
import { createMelonyThreadService } from "@/app/lib/services/thread-service";
import { createMelonyAuthService } from "@/app/lib/services/auth-service";

const client = new MelonyClient(createHttpTransport("/api/chat"));

const threadService = createMelonyThreadService();
const authService = createMelonyAuthService();

export default function Home() {
  return (
    <MelonyClientProvider client={client}>
      <ThemeProvider>
        <AuthProvider service={authService}>
          <ThreadProvider service={threadService}>
            <div className="flex flex-col h-screen relative bg-background">
              <main className="flex-1 overflow-hidden">
                <ChatFull
                  title="Melony"
                  starterPrompts={STARTER_PROMPTS}
                  headerProps={{
                    rightContent: (
                      <div className="flex gap-2">
                        <ThemeToggle />
                        <AccountDialog />
                      </div>
                    ),
                  }}
                  leftSidebar={
                    <div className="w-[18rem]">
                      <ThreadList />
                    </div>
                  }
                />
              </main>
            </div>
          </ThreadProvider>
        </AuthProvider>
      </ThemeProvider>
    </MelonyClientProvider>
  );
}

