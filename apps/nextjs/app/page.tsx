"use client";

import { MelonyClient } from "melony/client";
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
import { createMelonyThreadService } from "@/app/lib/services/thread-service";
import { createMelonyAuthService } from "@/app/lib/services/auth-service";

const CHAT_API_URL = "/api/chat";
const client = new MelonyClient({
  url: CHAT_API_URL
});

const threadService = createMelonyThreadService();
const authService = createMelonyAuthService();

export default function Home() {
  return (
    <MelonyClientProvider client={client} configApi={CHAT_API_URL}>
      <ThemeProvider>
        <AuthProvider service={authService}>
          <ThreadProvider service={threadService}>
            <div className="flex flex-col h-screen relative bg-background">
              <main className="flex-1 overflow-hidden">
                <ChatFull
                  title="Melony"
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
