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
  ChatSidebarProvider,
  ChatSidebar,
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
            <ChatSidebarProvider>
              <div className="flex h-screen relative bg-background overflow-hidden">
                <ChatSidebar side="left" className="w-[18rem]">
                  <ThreadList />
                </ChatSidebar>
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
                  />
                </main>
              </div>
            </ChatSidebarProvider>
          </ThreadProvider>
        </AuthProvider>
      </ThemeProvider>
    </MelonyClientProvider>
  );
}
